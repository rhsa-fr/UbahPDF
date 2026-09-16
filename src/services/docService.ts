import mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun, ImageRun } from 'docx';
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
 * Extract embedded images from a PDF page using PDF.js operator list
 */
async function extractPageImages(
  page: any
): Promise<{ data: ArrayBuffer; width: number; height: number }[]> {
  const images: { data: ArrayBuffer; width: number; height: number }[] = [];
  try {
    const opList = await page.getOperatorList();
    const imageRefs: string[] = [];

    const paintOps = [
      (pdfjsLib as any).OPS?.paintImageXObject,
      (pdfjsLib as any).OPS?.paintInlineImageXObject,
    ].filter(Boolean);

    for (let i = 0; i < opList.fnArray.length; i++) {
      const fn = opList.fnArray[i];
      if (paintOps.includes(fn)) {
        const imgRef = opList.argsArray[i][0];
        if (typeof imgRef === 'string' && !imageRefs.includes(imgRef)) {
          imageRefs.push(imgRef);
        }
      }
    }

    for (const ref of imageRefs) {
      try {
        const imgObj = await new Promise<any>((resolve) => {
          let resolved = false;
          try {
            page.objs.get(ref, (obj: any) => {
              if (!resolved) {
                resolved = true;
                resolve(obj);
              }
            });
          } catch {
            // Some objects might be in commonObjs
            try {
              page.commonObjs.get(ref, (obj: any) => {
                if (!resolved) {
                  resolved = true;
                  resolve(obj);
                }
              });
            } catch {
              resolve(null);
            }
          }
          // Safety timeout after 1.5s
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

        // Constrain max display width for Word page (~550px max width)
        const maxWidthPx = 540;
        let displayWidth = imgObj.width;
        let displayHeight = imgObj.height;
        if (displayWidth > maxWidthPx) {
          const ratio = maxWidthPx / displayWidth;
          displayWidth = maxWidthPx;
          displayHeight = Math.round(displayHeight * ratio);
        }

        images.push({
          data: arrayBuf,
          width: displayWidth,
          height: displayHeight,
        });
      } catch {
        // Continue if single image extraction fails
      }
    }
  } catch {
    // Continue if operator list parsing fails
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

/**
 * Extract structured text items grouped into editable paragraphs from a PDF page
 */
async function extractStructuredParagraphs(
  page: any
): Promise<{ paragraphs: Paragraph[]; totalChars: number }> {
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
    return { paragraphs: [], totalChars: 0 };
  }

  // Sort by Y descending (PDF coordinates: Y=0 at bottom, so larger Y is higher on page)
  items.sort((a, b) => b.y - a.y);

  // Group items into lines based on Y coordinate tolerance
  const lines: TextChunk[][] = [];
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
        lines.push(currentLine);
        currentLine = [item];
        currentLineY = item.y;
      }
    }
  }
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  // Convert each line into a Paragraph with TextRuns
  const paragraphs: Paragraph[] = [];

  for (let l = 0; l < lines.length; l++) {
    const line = lines[l];
    // Sort items horizontally (left to right)
    line.sort((a, b) => a.x - b.x);

    const textRuns: TextRun[] = [];
    let prevItemEnd = 0;

    for (let i = 0; i < line.length; i++) {
      const item = line[i];

      // Add a space if there's a horizontal gap between words
      if (i > 0 && item.x - prevItemEnd > 3.5) {
        const prevRun = line[i - 1];
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

      textRuns.push(
        new TextRun({
          text: item.str,
          bold: item.isBold,
          italics: item.isItalic,
          size: Math.max(16, Math.min(72, item.fontSize * 2)), // Half-points (11pt = 22)
          font: item.fontFamily,
        })
      );

      prevItemEnd = item.x + item.width;
    }

    // Detect if this line has significant vertical spacing before/after
    const avgFontSize = line.reduce((acc, it) => acc + it.fontSize, 0) / line.length;
    let spaceAfter = 60; // 3pt default spacing
    if (l < lines.length - 1) {
      const nextLine = lines[l + 1];
      const gap = line[0].y - nextLine[0].y;
      if (gap > avgFontSize * 1.8) {
        spaceAfter = 180; // 9pt paragraph spacing
      }
    }

    paragraphs.push(
      new Paragraph({
        children: textRuns,
        spacing: {
          after: spaceAfter,
          before: 0,
        },
      })
    );
  }

  return { paragraphs, totalChars };
}

/**
 * Render a page as a fallback screenshot paragraph (used when page has no text, e.g. scanned doc)
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

    const maxW = 540;
    const ratio = maxW / viewport.width;

    return new Paragraph({
      spacing: { before: 100, after: 100 },
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

/**
 * Convert PDF to an EDITABLE Word (.docx) document:
 * Extracts real selectable text with font size, bold, italics, paragraph groupings,
 * and extracts embedded images as separate movable picture objects.
 * If a page is scanned (no text), it falls back to high-res page image so content isn't lost.
 */
export async function pdfToDocx(file: File): Promise<Blob> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdfDoc.numPages;

  const PT_TO_TWIP = 20; // 1pt = 20 twips

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

    const pageWidthTwip = Math.round(viewport.width * PT_TO_TWIP);
    const pageHeightTwip = Math.round(viewport.height * PT_TO_TWIP);

    // 1. Extract structured editable paragraphs
    const { paragraphs, totalChars } = await extractStructuredParagraphs(page);

    // 2. Extract embedded images
    const images = await extractPageImages(page);

    const sectionChildren: Paragraph[] = [];

    // Fallback: If page has virtually no text and no images (e.g. scanned document),
    // render the page as high-res visual image so user doesn't get blank document
    if (totalChars < 15 && images.length === 0) {
      const fallbackParagraph = await renderPageFallbackParagraph(page);
      if (fallbackParagraph) {
        sectionChildren.push(fallbackParagraph);
      }
    } else {
      // Add text paragraphs
      if (paragraphs.length > 0) {
        sectionChildren.push(...paragraphs);
      }

      // Add extracted embedded images as separate editable Word images
      for (const img of images) {
        sectionChildren.push(
          new Paragraph({
            spacing: { before: 140, after: 140 },
            children: [
              new ImageRun({
                data: img.data,
                transformation: {
                  width: img.width,
                  height: img.height,
                },
                type: 'png',
              }),
            ],
          })
        );
      }
    }

    // Standard Word page margins (0.75 inch = 1080 twips)
    sections.push({
      properties: {
        page: {
          size: {
            width: pageWidthTwip,
            height: pageHeightTwip,
          },
          margin: {
            top: 1080,
            bottom: 1080,
            left: 1080,
            right: 1080,
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
