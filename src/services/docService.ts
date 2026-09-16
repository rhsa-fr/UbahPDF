import mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun, ImageRun, PageBreak } from 'docx';
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
 * and embedding into Word document. Preserves visual layout, images, diagrams.
 */
export async function pdfToDocx(file: File): Promise<Blob> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdfDoc.numPages;

  // A4 dimensions in EMU (English Metric Units) for docx
  // 1 inch = 914400 EMU, A4 = 210mm x 297mm = 8.27in x 11.69in
  const PAGE_WIDTH_EMU = Math.round(8.27 * 914400);
  const PAGE_HEIGHT_EMU = Math.round(11.69 * 914400);
  // Leave ~1 inch margin on each side
  const CONTENT_WIDTH_EMU = Math.round(6.27 * 914400);

  const children: Paragraph[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 }); // High-res render

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) continue;

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport: viewport,
      canvas: canvas,
    } as any).promise;

    // Convert canvas to PNG blob then to ArrayBuffer
    const blob: Blob = await new Promise((resolve) => {
      canvas.toBlob((b) => resolve(b!), 'image/png');
    });
    const imgArrayBuffer = await blob.arrayBuffer();

    // Calculate image dimensions maintaining aspect ratio
    const aspectRatio = viewport.height / viewport.width;
    const imgWidthEmu = CONTENT_WIDTH_EMU;
    const imgHeightEmu = Math.round(imgWidthEmu * aspectRatio);

    const paragraphChildren: (ImageRun | PageBreak)[] = [
      new ImageRun({
        data: imgArrayBuffer,
        transformation: {
          width: Math.round(imgWidthEmu / 9525), // EMU to pixels (approx for docx)
          height: Math.round(imgHeightEmu / 9525),
        },
        type: 'png',
      }),
    ];

    // Add page break after every page except the last
    if (i < numPages) {
      paragraphChildren.push(new PageBreak());
    }

    children.push(
      new Paragraph({
        children: paragraphChildren,
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: PAGE_WIDTH_EMU,
              height: PAGE_HEIGHT_EMU,
            },
            margin: {
              top: 720, // 0.5 inch in twips
              bottom: 720,
              left: 720,
              right: 720,
            },
          },
        },
        children,
      },
    ],
  });

  return await Packer.toBlob(doc);
}
