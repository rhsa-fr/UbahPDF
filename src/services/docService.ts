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
 * Convert PDF to DOCX by rendering each page as a high-resolution image
 * and embedding into Word document. Each page becomes its own section with
 * exact matching dimensions (zero margins) so output is pixel-perfect.
 */
export async function pdfToDocx(file: File): Promise<Blob> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdfDoc.numPages;

  // 1 PDF point = 1/72 inch, 1 inch = 914400 EMU
  // docx page size uses twips (1 inch = 1440 twips)
  const PT_TO_TWIP = 20; // 1pt = 20 twips
  const RENDER_SCALE = 2.0; // High-res render for crisp images

  interface PageSection {
    properties: {
      page: {
        size: { width: number; height: number; orientation?: any };
        margin: { top: number; bottom: number; left: number; right: number };
      };
    };
    children: Paragraph[];
  }

  const sections: PageSection[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDoc.getPage(i);

    // Get original page size in PDF points (1/72 inch)
    const baseViewport = page.getViewport({ scale: 1.0 });
    const pageWidthPt = baseViewport.width;
    const pageHeightPt = baseViewport.height;

    // Render at high resolution
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

    // Convert canvas to PNG ArrayBuffer
    const blob: Blob = await new Promise((resolve) => {
      canvas.toBlob((b) => resolve(b!), 'image/png');
    });
    const imgArrayBuffer = await blob.arrayBuffer();

    // Convert PDF points to twips for DOCX page size
    const pageWidthTwip = Math.round(pageWidthPt * PT_TO_TWIP);
    const pageHeightTwip = Math.round(pageHeightPt * PT_TO_TWIP);

    // Image dimensions in the docx: fill entire page (same as page size in points)
    // docx ImageRun transformation uses points directly
    const imgWidthPx = Math.round(pageWidthPt * (96 / 72)); // Convert pt to px at 96 DPI
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
