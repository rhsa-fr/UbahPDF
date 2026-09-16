import mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType } from 'docx';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as pdfjsLib from 'pdfjs-dist';
import { readFileAsArrayBuffer } from './fileUtils';

/**
 * Convert DOCX file to HTML preview string using Mammoth
 */
export async function docxToHtml(file: File): Promise<string> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const result = await mammoth.convertToHtml({ arrayBuffer });
  return result.value;
}

/**
 * Convert DOCX file to plain text string using Mammoth
 */
export async function docxToText(file: File): Promise<string> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

/**
 * Convert DOCX file directly to PDF client-side using Mammoth + HTML2Canvas + jsPDF
 */
export async function docxToPdf(file: File): Promise<Uint8Array> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const htmlContent = result.value;

  // Create temporary container element in DOM to render DOCX content
  const container = document.createElement('div');
  container.style.all = 'initial'; // Isolate from Tailwind v4 oklch variables
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '794px'; // Standard A4 width in px at 96 DPI
  container.style.padding = '40px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#1e293b';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.fontSize = '14px';
  container.style.lineHeight = '1.6';
  container.style.colorScheme = 'light';
  container.innerHTML = htmlContent;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2, // High resolution rendering
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    document.body.removeChild(container);

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 10) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    return new Uint8Array(pdf.output('arraybuffer'));
  } catch (err) {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    throw err;
  }
}

/**
 * Create a DOCX file from plain text lines client-side using `docx` library
 */
export async function textToDocx(text: string): Promise<Blob> {
  const lines = text.split('\n');
  const paragraphs = lines.map(
    (line) =>
      new Paragraph({
        children: [
          new TextRun({
            text: line,
            size: 24, // 12pt
            font: 'Arial',
          }),
        ],
      })
  );

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  return await Packer.toBlob(doc);
}

/**
 * Matrix multiplication helper for 2D transformation matrices [a, b, c, d, tx, ty]
 */
function multiplyTransform(m1: number[], m2: number[]): number[] {
  return [
    m1[0] * m2[0] + m1[1] * m2[2],
    m1[0] * m2[1] + m1[1] * m2[3],
    m1[2] * m2[0] + m1[3] * m2[2],
    m1[2] * m2[1] + m1[3] * m2[3],
    m1[4] * m2[0] + m1[5] * m2[2] + m2[4],
    m1[4] * m2[1] + m1[5] * m2[3] + m2[5],
  ];
}

interface ExtractedImage {
  data: ArrayBuffer;
  displayWidth: number;
  displayHeight: number;
  x: number;
  y: number;
  w: number;
  h: number;
  topY: number;
}

/**
 * Extract embedded images with their exact coordinates from a PDF page
 */
async function extractPageImages(page: any): Promise<ExtractedImage[]> {
  const images: ExtractedImage[] = [];
  try {
    const opList = await page.getOperatorList();

    const paintOps = [
      (pdfjsLib as any).OPS?.paintImageXObject,
      (pdfjsLib as any).OPS?.paintInlineImageXObject,
    ].filter(Boolean);

    let currentMatrix = [1, 0, 0, 1, 0, 0];
    const matrixStack: number[][] = [];
    const imagePositions: { ref: string; x: number; y: number; w: number; h: number }[] = [];

    for (let i = 0; i < opList.fnArray.length; i++) {
      const fn = opList.fnArray[i];
      const args = opList.argsArray[i];

      if (fn === (pdfjsLib as any).OPS?.save) {
        matrixStack.push([...currentMatrix]);
      } else if (fn === (pdfjsLib as any).OPS?.restore) {
        if (matrixStack.length > 0) {
          currentMatrix = matrixStack.pop()!;
        }
      } else if (fn === (pdfjsLib as any).OPS?.transform) {
        if (args && args.length >= 6) {
          currentMatrix = multiplyTransform(currentMatrix, args);
        }
      } else if (paintOps.includes(fn)) {
        const imgRef = args?.[0];
        if (typeof imgRef === 'string') {
          const imgX = currentMatrix[4] || 0;
          const imgY = currentMatrix[5] || 0;
          const imgW = Math.abs(currentMatrix[0]) || 100;
          const imgH = Math.abs(currentMatrix[3]) || 100;
          imagePositions.push({
            ref: imgRef,
            x: imgX,
            y: imgY,
            w: imgW,
            h: imgH,
          });
        }
      }
    }

    for (const pos of imagePositions) {
      try {
        const imgObj = await new Promise<any>((resolve) => {
          let resolved = false;
          try {
            page.objs.get(pos.ref, (obj: any) => {
              if (!resolved) {
                resolved = true;
                resolve(obj);
              }
            });
          } catch {
            try {
              page.commonObjs.get(pos.ref, (obj: any) => {
                if (!resolved) {
                  resolved = true;
                  resolve(obj);
                }
              });
            } catch {
              resolve(null);
            }
          }
          setTimeout(() => {
            if (!resolved) {
              resolved = true;
              resolve(null);
            }
          }, 1500);
        });

        if (!imgObj || !imgObj.data || !imgObj.width || !imgObj.height) continue;

        const canvas = document.createElement('canvas');
        canvas.width = imgObj.width;
        canvas.height = imgObj.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        if (imgObj.data.length === imgObj.width * imgObj.height * 4) {
          const imgData = new ImageData(
            new Uint8ClampedArray(imgObj.data),
            imgObj.width,
            imgObj.height
          );
          ctx.putImageData(imgData, 0, 0);
        } else if (imgObj.data.length === imgObj.width * imgObj.height * 3) {
          const rgba = new Uint8ClampedArray(imgObj.width * imgObj.height * 4);
          let src = 0;
          let dst = 0;
          for (let p = 0; p < imgObj.width * imgObj.height; p++) {
            rgba[dst++] = imgObj.data[src++];
            rgba[dst++] = imgObj.data[src++];
            rgba[dst++] = imgObj.data[src++];
            rgba[dst++] = 255;
          }
          const imgData = new ImageData(rgba, imgObj.width, imgObj.height);
          ctx.putImageData(imgData, 0, 0);
        } else {
          continue;
        }

        const blob: Blob = await new Promise((resolve) => {
          canvas.toBlob((b) => resolve(b!), 'image/png');
        });
        const arrayBuf = await blob.arrayBuffer();

        // Fit display size within page margins (max ~520px)
        const maxWidthPx = 520;
        let displayWidth = Math.round(pos.w * (96 / 72));
        let displayHeight = Math.round(pos.h * (96 / 72));
        if (displayWidth > maxWidthPx) {
          const ratio = maxWidthPx / displayWidth;
          displayWidth = maxWidthPx;
          displayHeight = Math.round(displayHeight * ratio);
        }
        if (displayWidth < 10 || displayHeight < 10) continue;

        images.push({
          data: arrayBuf,
          displayWidth,
          displayHeight,
          x: pos.x,
          y: pos.y,
          w: pos.w,
          h: pos.h,
          topY: pos.y + pos.h,
        });
      } catch {
        // Ignore single image failure
      }
    }
  } catch {
    // Ignore operator list failure
  }

  return images;
}

interface TextChunk {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  isBold: boolean;
  isItalic: boolean;
  fontFamily: string;
}

interface TextLine {
  line: TextChunk[];
  lineStartX: number;
  lineEndX: number;
  lineWidth: number;
  topY: number;
  bottomY: number;
}

/**
 * Extract structured text lines with positioning, font properties, and line groupings
 */
async function extractTextLines(
  page: any
): Promise<{ lines: TextLine[]; totalChars: number }> {
  const textContent = await page.getTextContent({ includeMarkedContent: false });
  const items: TextChunk[] = [];
  let totalChars = 0;

  for (const rawItem of textContent.items) {
    if (!('str' in rawItem) || !rawItem.str) continue;
    const item = rawItem as any;
    const str = item.str;
    if (!str.trim()) continue;

    totalChars += str.length;
    const transform = item.transform || [1, 0, 0, 1, 0, 0];
    const x = transform[4] || 0;
    const y = transform[5] || 0;
    const fontSize = Math.round(Math.abs(transform[3]) || item.height || 11);

    const fontStyle = textContent.styles?.[item.fontName] || {};
    const fontName = (item.fontName || '').toLowerCase();
    const family = (fontStyle.fontFamily || 'Arial').toLowerCase();

    const isBold =
      fontName.includes('bold') ||
      fontName.includes('black') ||
      fontName.includes('bld') ||
      fontName.includes('heavy') ||
      family.includes('bold');

    const isItalic =
      fontName.includes('italic') ||
      fontName.includes('oblique') ||
      family.includes('italic');

    items.push({
      str,
      x,
      y,
      width: item.width || 0,
      height: item.height || fontSize,
      fontSize,
      isBold,
      isItalic,
      fontFamily: fontStyle.fontFamily || 'Arial',
    });
  }

  if (items.length === 0) {
    return { lines: [], totalChars: 0 };
  }

  // Sort items top-to-bottom (Y descending)
  items.sort((a, b) => b.y - a.y);

  // Group items into lines
  const rawLines: TextChunk[][] = [];
  let currentLine: TextChunk[] = [];
  let currentLineY: number | null = null;

  for (const item of items) {
    if (currentLineY === null) {
      currentLine = [item];
      currentLineY = item.y;
    } else {
      const tolerance = Math.max(3.5, item.fontSize * 0.35);
      if (Math.abs(item.y - currentLineY) <= tolerance) {
        currentLine.push(item);
      } else {
        rawLines.push(currentLine);
        currentLine = [item];
        currentLineY = item.y;
      }
    }
  }
  if (currentLine.length > 0) {
    rawLines.push(currentLine);
  }

  const lines: TextLine[] = [];

  for (const rawLine of rawLines) {
    // Sort horizontally (left to right)
    rawLine.sort((a, b) => a.x - b.x);

    const lineStartX = rawLine[0].x;
    const lastItem = rawLine[rawLine.length - 1];
    const lineEndX = lastItem.x + lastItem.width;
    const lineWidth = lineEndX - lineStartX;
    const maxFontSize = Math.max(...rawLine.map((it) => it.fontSize));
    const baseY = rawLine[0].y;

    lines.push({
      line: rawLine,
      lineStartX,
      lineEndX,
      lineWidth,
      topY: baseY + maxFontSize,
      bottomY: baseY,
    });
  }

  return { lines, totalChars };
}

/**
 * Render a fallback screenshot of the page when there is no extractable text or images
 */
async function renderPageFallbackParagraph(page: any): Promise<Paragraph | null> {
  try {
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    await page.render({
      canvasContext: ctx,
      viewport,
      canvas,
    } as any).promise;

    const blob: Blob = await new Promise((resolve) => {
      canvas.toBlob((b) => resolve(b!), 'image/png');
    });
    const imgArrayBuffer = await blob.arrayBuffer();

    const maxW = 520;
    const ratio = maxW / viewport.width;

    return new Paragraph({
      spacing: { before: 80, after: 80 },
      children: [
        new ImageRun({
          data: imgArrayBuffer,
          transformation: {
            width: maxW,
            height: Math.round(viewport.height * ratio),
          },
          type: 'png',
        }),
      ],
    });
  } catch {
    return null;
  }
}

type PageBlock =
  | { type: 'text'; topY: number; bottomY: number; lineData: TextLine }
  | { type: 'image'; topY: number; bottomY: number; imgData: ExtractedImage };

/**
 * Convert PDF to an EDITABLE Word (.docx) document:
 * Reconstructs layout with accurate indentation, text alignment (center/right/left),
 * tabular column spacing, proportional vertical gaps, and embeds images at their exact
 * vertical positions relative to text.
 */
export async function pdfToDocx(file: File): Promise<Blob> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdfDoc.numPages;

  const PT_TO_TWIP = 20;

  interface DocxSection {
    properties: {
      page: {
        size: { width: number; height: number };
        margin: { top: number; bottom: number; left: number; right: number };
      };
    };
    children: Paragraph[];
  }

  const sections: DocxSection[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: 1.0 });
    const pageWidthPt = viewport.width;
    const pageHeightPt = viewport.height;

    const pageWidthTwip = Math.round(pageWidthPt * PT_TO_TWIP);
    const pageHeightTwip = Math.round(pageHeightPt * PT_TO_TWIP);

    const { lines, totalChars } = await extractTextLines(page);
    const images = await extractPageImages(page);

    const sectionChildren: Paragraph[] = [];

    let baseMarginTwip = 720;

    // Fallback if page is scanned or empty
    if (totalChars < 15 && images.length === 0) {
      const fallbackParagraph = await renderPageFallbackParagraph(page);
      if (fallbackParagraph) {
        sectionChildren.push(fallbackParagraph);
      }
    } else {
      // Find minimum left margin of all blocks on the page
      const leftPositions: number[] = [
        ...lines.map((l) => l.lineStartX),
        ...images.map((img) => img.x),
      ].filter((x) => x > 0);

      const minLeftPt = leftPositions.length > 0 ? Math.min(...leftPositions) : 36;
      const baseMarginLeftPt = Math.max(20, Math.min(54, minLeftPt));
      baseMarginTwip = Math.round(baseMarginLeftPt * PT_TO_TWIP);

      // Combine text lines and images into a single sorted chronological stream
      const blocks: PageBlock[] = [
        ...lines.map((l) => ({
          type: 'text' as const,
          topY: l.topY,
          bottomY: l.bottomY,
          lineData: l,
        })),
        ...images.map((img) => ({
          type: 'image' as const,
          topY: img.topY,
          bottomY: img.y,
          imgData: img,
        })),
      ];

      // Sort from top of page to bottom of page (PDF Y: larger Y is higher)
      blocks.sort((a, b) => b.topY - a.topY);

      let prevBottomY: number | null = null;

      for (let b = 0; b < blocks.length; b++) {
        const block = blocks[b];

        // Calculate vertical spacing before this block
        let spaceBefore = 40; // 2pt minimal spacing
        if (prevBottomY !== null) {
          const gapPt = prevBottomY - block.topY;
          if (gapPt > 3) {
            // Convert gap in pt to twips, capped at 1200 twips (60pt)
            spaceBefore = Math.min(1200, Math.max(40, Math.round(gapPt * PT_TO_TWIP)));
          }
        }
        prevBottomY = block.bottomY;

        if (block.type === 'text') {
          const l = block.lineData;
          const line = l.line;

          // Determine horizontal alignment
          let alignment: (typeof AlignmentType)[keyof typeof AlignmentType] = AlignmentType.LEFT;
          let indentLeftTwips = 0;

          const lineCenterX = l.lineStartX + l.lineWidth / 2;
          const isCentered =
            Math.abs(lineCenterX - pageWidthPt / 2) < 28 && l.lineWidth < pageWidthPt * 0.75;
          const isRightAligned =
            pageWidthPt - l.lineEndX < 65 && l.lineStartX > pageWidthPt * 0.35;

          if (isCentered) {
            alignment = AlignmentType.CENTER;
          } else if (isRightAligned) {
            alignment = AlignmentType.RIGHT;
          } else {
            const indentPt = Math.max(0, l.lineStartX - baseMarginLeftPt);
            if (indentPt > 10) {
              indentLeftTwips = Math.round(indentPt * PT_TO_TWIP);
            }
          }

          // Build TextRuns with inter-word and tabular gap detection
          const textRuns: TextRun[] = [];
          let prevItemEnd = line[0].x;

          for (let k = 0; k < line.length; k++) {
            const item = line[k];
            const gap = item.x - prevItemEnd;

            if (k > 0) {
              if (gap > 28) {
                // Large gap indicates table column or tab separator
                textRuns.push(new TextRun({ text: '\t' }));
              } else if (gap > 3.5) {
                const prevRun = line[k - 1];
                if (!prevRun.str.endsWith(' ') && !item.str.startsWith(' ')) {
                  textRuns.push(
                    new TextRun({
                      text: ' ',
                      size: Math.max(16, Math.min(72, item.fontSize * 2)),
                      font: item.fontFamily,
                    })
                  );
                }
              }
            }

            textRuns.push(
              new TextRun({
                text: item.str,
                bold: item.isBold,
                italics: item.isItalic,
                size: Math.max(16, Math.min(72, item.fontSize * 2)),
                font: item.fontFamily,
              })
            );

            prevItemEnd = item.x + item.width;
          }

          sectionChildren.push(
            new Paragraph({
              alignment,
              indent: indentLeftTwips > 0 ? { left: indentLeftTwips } : undefined,
              spacing: {
                before: spaceBefore,
                after: 40,
              },
              children: textRuns,
            })
          );
        } else if (block.type === 'image') {
          const img = block.imgData;

          let imgAlign: (typeof AlignmentType)[keyof typeof AlignmentType] = AlignmentType.LEFT;
          let imgIndentTwips = 0;

          const imgCenterX = img.x + img.w / 2;
          if (Math.abs(imgCenterX - pageWidthPt / 2) < 35) {
            imgAlign = AlignmentType.CENTER;
          } else if (pageWidthPt - (img.x + img.w) < 65) {
            imgAlign = AlignmentType.RIGHT;
          } else {
            const indentPt = Math.max(0, img.x - baseMarginLeftPt);
            if (indentPt > 10) {
              imgIndentTwips = Math.round(indentPt * PT_TO_TWIP);
            }
          }

          sectionChildren.push(
            new Paragraph({
              alignment: imgAlign,
              indent: imgIndentTwips > 0 ? { left: imgIndentTwips } : undefined,
              spacing: {
                before: spaceBefore,
                after: 60,
              },
              children: [
                new ImageRun({
                  data: img.data,
                  transformation: {
                    width: img.displayWidth,
                    height: img.displayHeight,
                  },
                  type: 'png',
                }),
              ],
            })
          );
        }
      }
    }

    // Standardized section page settings based on original document dimensions
    sections.push({
      properties: {
        page: {
          size: {
            width: pageWidthTwip,
            height: pageHeightTwip,
          },
          margin: {
            top: 720, // 0.5 inch (36pt)
            bottom: 720,
            left: baseMarginTwip,
            right: baseMarginTwip,
          },
        },
      },
      children:
        sectionChildren.length > 0
          ? sectionChildren
          : [new Paragraph({ children: [new TextRun({ text: '' })] })],
    });
  }

  const doc = new Document({
    sections: sections as any,
  });

  return await Packer.toBlob(doc);
}

/**
 * Convert PDF to DOCX by rendering each page as a high-resolution image
 * (Visual match / pixel-perfect screenshot clone mode)
 */
export async function pdfToDocxImage(file: File): Promise<Blob> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdfDoc.numPages;

  const PT_TO_TWIP = 20;
  const RENDER_SCALE = 2.0;

  interface PageSection {
    properties: {
      page: {
        size: { width: number; height: number };
        margin: { top: number; bottom: number; left: number; right: number };
      };
    };
    children: Paragraph[];
  }

  const sections: PageSection[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const baseViewport = page.getViewport({ scale: 1.0 });
    const pageWidthPt = baseViewport.width;
    const pageHeightPt = baseViewport.height;

    const renderViewport = page.getViewport({ scale: RENDER_SCALE });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) continue;

    canvas.width = renderViewport.width;
    canvas.height = renderViewport.height;

    await page.render({
      canvasContext: context,
      viewport: renderViewport,
      canvas: canvas,
    } as any).promise;

    const blob: Blob = await new Promise((resolve) => {
      canvas.toBlob((b) => resolve(b!), 'image/png');
    });
    const imgArrayBuffer = await blob.arrayBuffer();

    const pageWidthTwip = Math.round(pageWidthPt * PT_TO_TWIP);
    const pageHeightTwip = Math.round(pageHeightPt * PT_TO_TWIP);
    const imgWidthPx = Math.round(pageWidthPt * (96 / 72));
    const imgHeightPx = Math.round(pageHeightPt * (96 / 72));

    sections.push({
      properties: {
        page: {
          size: {
            width: pageWidthTwip,
            height: pageHeightTwip,
          },
          margin: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          },
        },
      },
      children: [
        new Paragraph({
          spacing: { before: 0, after: 0 },
          children: [
            new ImageRun({
              data: imgArrayBuffer,
              transformation: {
                width: imgWidthPx,
                height: imgHeightPx,
              },
              type: 'png',
            }),
          ],
        }),
      ],
    });
  }

  const doc = new Document({
    sections: sections as any,
  });

  return await Packer.toBlob(doc);
}
