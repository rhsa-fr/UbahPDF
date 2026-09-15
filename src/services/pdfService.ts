import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { jsPDF } from 'jspdf';
import { readFileAsArrayBuffer, readFileAsDataURL, toRoman } from './fileUtils';
import type { PdfPageThumbnail, ConversionOptions } from '../types';

// Set up pdf.js worker using local Vite bundled URL asset
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

/**
 * Merge multiple PDF files into a single PDF document
 */
export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}

/**
 * Split PDF by extracting specific page numbers (1-based index)
 */
export async function splitPdf(file: File, pageNumbers: number[]): Promise<Uint8Array> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const newPdf = await PDFDocument.create();

  // Convert 1-based to 0-based page indices
  const pageIndices = pageNumbers
    .map((num) => num - 1)
    .filter((idx) => idx >= 0 && idx < pdfDoc.getPageCount());

  const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
  copiedPages.forEach((page) => newPdf.addPage(page));

  return await newPdf.save();
}

/**
 * Render all page thumbnails of a PDF using PDF.js for visual page editor
 */
export async function renderPdfThumbnails(file: File): Promise<PdfPageThumbnail[]> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;
  const thumbnails: PdfPageThumbnail[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: 0.3 }); // Thumbnail scale

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) continue;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport: viewport,
      canvas: canvas,
    } as any).promise;

    thumbnails.push({
      pageNumber: i,
      dataUrl: canvas.toDataURL('image/jpeg', 0.8),
      rotation: 0,
      selected: true,
    });
  }

  return thumbnails;
}

/**
 * Convert PDF pages to Images (PNG or JPEG data URLs)
 */
export async function pdfToImages(
  file: File,
  options: ConversionOptions = {}
): Promise<{ pageNumber: number; dataUrl: string; name: string }[]> {
  const format = options.imageFormat || 'png';
  const quality = options.imageQuality || 0.9;
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const result: { pageNumber: number; dataUrl: string; name: string }[] = [];

  const baseName = file.name.replace(/\.[^/.]+$/, '');

  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 }); // High resolution render

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) continue;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport: viewport,
      canvas: canvas,
    } as any).promise;

    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const dataUrl = canvas.toDataURL(mimeType, quality);

    result.push({
      pageNumber: i,
      dataUrl,
      name: `${baseName}_page_${i}.${format === 'jpeg' ? 'jpg' : 'png'}`,
    });
  }

  return result;
}

/**
 * Convert images (JPG, PNG, WebP) to a single PDF document
 */
export async function imagesToPdf(
  imageFiles: File[],
  options: ConversionOptions = {}
): Promise<Uint8Array> {
  const { orientation = 'portrait', margin = 'small' } = options;
  const doc = new jsPDF({
    orientation: orientation === 'landscape' ? 'l' : 'p',
    unit: 'mm',
    format: 'a4',
  });

  const marginMm = margin === 'none' ? 0 : margin === 'small' ? 10 : 20;

  for (let i = 0; i < imageFiles.length; i++) {
    if (i > 0) doc.addPage();

    const dataUrl = await readFileAsDataURL(imageFiles[i]);
    const img = new Image();
    await new Promise((resolve) => {
      img.onload = resolve;
      img.src = dataUrl;
    });

    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = doc.internal.pageSize.getHeight();

    const printableWidth = pdfWidth - marginMm * 2;
    const printableHeight = pdfHeight - marginMm * 2;

    const imgRatio = img.width / img.height;
    let renderWidth = printableWidth;
    let renderHeight = printableWidth / imgRatio;

    if (renderHeight > printableHeight) {
      renderHeight = printableHeight;
      renderWidth = printableHeight * imgRatio;
    }

    const x = marginMm + (printableWidth - renderWidth) / 2;
    const y = marginMm + (printableHeight - renderHeight) / 2;

    const format = imageFiles[i].type.includes('png') ? 'PNG' : 'JPEG';
    doc.addImage(dataUrl, format, x, y, renderWidth, renderHeight);
  }

  return new Uint8Array(doc.output('arraybuffer'));
}

/**
 * Rotate pages of a PDF document
 */
export async function rotatePdfPages(
  file: File,
  rotations: Map<number, number> // Page number (1-based) => rotation angle (90, 180, 270)
): Promise<Uint8Array> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  rotations.forEach((angle, pageNum) => {
    const idx = pageNum - 1;
    if (idx >= 0 && idx < pdfDoc.getPageCount()) {
      const page = pdfDoc.getPage(idx);
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees((currentRotation + angle) % 360));
    }
  });

  return await pdfDoc.save();
}

/**
 * Add Watermark (Text or Image Logo) to all pages of a PDF
 */
export async function watermarkPdf(
  file: File,
  textOrImageOptions: ConversionOptions = {}
): Promise<Uint8Array> {
  const {
    watermarkType = 'text',
    watermarkText = 'CONFIDENTIAL',
    watermarkImageFile = null,
    watermarkImageWidth = 150,
    watermarkFontSize = 48,
    watermarkOpacity = 0.3,
    watermarkAngle = 45,
  } = textOrImageOptions;

  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();

  if (watermarkType === 'image' && watermarkImageFile) {
    const imageBytes = await readFileAsArrayBuffer(watermarkImageFile);
    const isPng =
      watermarkImageFile.type.includes('png') ||
      watermarkImageFile.name.toLowerCase().endsWith('.png');

    const embeddedImage = isPng
      ? await pdfDoc.embedPng(imageBytes)
      : await pdfDoc.embedJpg(imageBytes);

    const imgWidth = watermarkImageWidth;
    const imgHeight = (embeddedImage.height / embeddedImage.width) * imgWidth;

    for (const page of pages) {
      const { width, height } = page.getSize();
      page.drawImage(embeddedImage, {
        x: width / 2 - imgWidth / 2,
        y: height / 2 - imgHeight / 2,
        width: imgWidth,
        height: imgHeight,
        opacity: watermarkOpacity,
      });
    }
  } else {
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const text = watermarkText || 'CONFIDENTIAL';

    for (const page of pages) {
      const { width, height } = page.getSize();
      const textWidth = font.widthOfTextAtSize(text, watermarkFontSize);
      const textHeight = font.heightAtSize(watermarkFontSize);

      page.drawText(text, {
        x: width / 2 - textWidth / 2,
        y: height / 2 - textHeight / 2,
        size: watermarkFontSize,
        font,
        color: rgb(0.5, 0.5, 0.5),
        opacity: watermarkOpacity,
        rotate: degrees(watermarkAngle),
      });
    }
  }

  return await pdfDoc.save();
}

/**
 * Extract plain text from PDF file using PDF.js
 */
export async function pdfToText(file: File): Promise<string> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += `--- Page ${i} ---\n\n${pageText}\n\n`;
  }

  return fullText;
}

/**
 * Reorder PDF pages according to custom array of 1-based page numbers
 */
export async function reorderPdfPages(
  file: File,
  newPageOrder: number[]
): Promise<Uint8Array> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const newPdf = await PDFDocument.create();

  for (const pageNum of newPageOrder) {
    const idx = pageNum - 1;
    if (idx >= 0 && idx < pdfDoc.getPageCount()) {
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [idx]);
      newPdf.addPage(copiedPage);
    }
  }

  return await newPdf.save();
}

/**
 * Compress PDF file by optimizing streams and re-encoding page images
 */
export async function compressPdf(
  file: File,
  options: ConversionOptions = {}
): Promise<{ pdfBytes: Uint8Array; originalSize: number; compressedSize: number }> {
  const { compressLevel = 'recommended' } = options;
  const originalSize = file.size;

  const quality = compressLevel === 'extreme' ? 0.4 : compressLevel === 'recommended' ? 0.7 : 0.85;
  const scale = compressLevel === 'extreme' ? 1.2 : compressLevel === 'recommended' ? 1.5 : 2.0;

  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdfDoc.numPages;

  const doc = new jsPDF({
    unit: 'pt',
    compress: true,
  });

  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) continue;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport: viewport,
      canvas: canvas,
    } as any).promise;

    const imgDataUrl = canvas.toDataURL('image/jpeg', quality);
    const pdfPageWidth = viewport.width / scale;
    const pdfPageHeight = viewport.height / scale;

    if (i > 1) {
      doc.addPage([pdfPageWidth, pdfPageHeight]);
    } else {
      doc.setPage(1);
    }

    doc.addImage(imgDataUrl, 'JPEG', 0, 0, pdfPageWidth, pdfPageHeight, undefined, 'FAST');
  }

  const compressedArrayBuffer = doc.output('arraybuffer');
  const compressedBytes = new Uint8Array(compressedArrayBuffer);

  return {
    pdfBytes: compressedBytes,
    originalSize,
    compressedSize: compressedBytes.length,
  };
}

/**
 * Add Page Numbers to PDF with Arabic (1, 2, 3) or Roman (i, ii, iii / I, II, III) formats
 */
export async function addPageNumbers(
  file: File,
  options: ConversionOptions = {}
): Promise<Uint8Array> {
  const {
    pageNumberFormat = 'arabic',
    pageNumberStyle = 'page-x-of-y',
    pageNumberPosition = 'bottom-right',
    pageNumberStart = 1,
    pageNumberSkipCover = false,
  } = options;

  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 10;
  const margin = 30;

  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  for (let i = 0; i < totalPages; i++) {
    // Skip cover page if enabled
    if (pageNumberSkipCover && i === 0) continue;

    const page = pages[i];
    const { width, height } = page.getSize();

    // Calculate numeric value based on starting index & cover skip
    const currentNumVal = pageNumberSkipCover
      ? i + (pageNumberStart - 1)
      : (i + 1) + (pageNumberStart - 1);

    let numStr = currentNumVal.toString();
    let totalStr = totalPages.toString();

    if (pageNumberFormat === 'roman-lower') {
      numStr = toRoman(currentNumVal, false);
      totalStr = toRoman(totalPages, false);
    } else if (pageNumberFormat === 'roman-upper') {
      numStr = toRoman(currentNumVal, true);
      totalStr = toRoman(totalPages, true);
    }

    // Format text string
    let textLabel = numStr;
    if (pageNumberStyle === 'page-x') {
      textLabel = `Halaman ${numStr}`;
    } else if (pageNumberStyle === 'page-x-of-y') {
      textLabel = `Halaman ${numStr} dari ${totalStr}`;
    }

    const textWidth = font.widthOfTextAtSize(textLabel, fontSize);

    // Calculate (x, y) coordinates
    let x = width - margin - textWidth; // default bottom-right
    let y = margin; // default bottom

    if (pageNumberPosition === 'bottom-center') {
      x = (width - textWidth) / 2;
      y = margin;
    } else if (pageNumberPosition === 'bottom-left') {
      x = margin;
      y = margin;
    } else if (pageNumberPosition === 'top-right') {
      x = width - margin - textWidth;
      y = height - margin;
    } else if (pageNumberPosition === 'top-center') {
      x = (width - textWidth) / 2;
      y = height - margin;
    }

    page.drawText(textLabel, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });
  }

  return await pdfDoc.save();
}

/**
 * Sign PDF by stamping a signature PNG image onto specified page (1-based index)
 */
export async function signPdf(
  file: File,
  signatureDataUrl: string,
  options: ConversionOptions = {}
): Promise<Uint8Array> {
  if (!signatureDataUrl) {
    throw new Error('Silakan gambar atau upload tanda tangan terlebih dahulu.');
  }

  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  const targetPageNum = options.signaturePage || 1;
  const pages = pdfDoc.getPages();
  if (targetPageNum < 1 || targetPageNum > pages.length) {
    throw new Error('Halaman tanda tangan tidak valid.');
  }

  const page = pages[targetPageNum - 1];
  const { width: pageWidth, height: pageHeight } = page.getSize();

  // Embed signature image (PNG or JPG)
  let signatureImage;
  if (signatureDataUrl.startsWith('data:image/png')) {
    signatureImage = await pdfDoc.embedPng(signatureDataUrl);
  } else {
    signatureImage = await pdfDoc.embedJpg(signatureDataUrl);
  }

  let x: number;
  let y: number;
  let sigWidth: number;
  let sigHeight: number;

  if (
    options.signatureXPercent !== undefined &&
    options.signatureYPercent !== undefined &&
    options.signatureWidthPercent !== undefined
  ) {
    sigWidth = (options.signatureWidthPercent / 100) * pageWidth;
    const aspectRatio = signatureImage.height / signatureImage.width;
    sigHeight = sigWidth * aspectRatio;

    x = (options.signatureXPercent / 100) * pageWidth;
    const topY = (options.signatureYPercent / 100) * pageHeight;
    y = pageHeight - topY - sigHeight;
  } else {
    const scaleFactor = options.signatureScale || 0.4;
    const sigDims = signatureImage.scale(scaleFactor);
    sigWidth = sigDims.width;
    sigHeight = sigDims.height;
    x = Math.max(20, pageWidth - sigWidth - 40);
    y = 40;
  }

  page.drawImage(signatureImage, {
    x,
    y,
    width: sigWidth,
    height: sigHeight,
  });

  return await pdfDoc.save();
}

/**
 * Delete specific page numbers (1-based index) from a PDF document
 */
export async function deletePdfPages(
  file: File,
  pageNumbersToDelete: number[]
): Promise<Uint8Array> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const totalPages = pdfDoc.getPageCount();

  const toDeleteSet = new Set(pageNumbersToDelete);
  const pagesToKeep: number[] = [];

  for (let i = 1; i <= totalPages; i++) {
    if (!toDeleteSet.has(i)) {
      pagesToKeep.push(i);
    }
  }

  if (pagesToKeep.length === 0) {
    throw new Error('Dokumen tidak boleh kosong (sisakan setidaknya 1 halaman).');
  }

  return await splitPdf(file, pagesToKeep);
}

/**
 * Protect PDF with user password
 */
export async function protectPdf(
  file: File,
  userPassword: string
): Promise<Uint8Array> {
  if (!userPassword || !userPassword.trim()) {
    throw new Error('Silakan masukkan kata sandi (password) untuk mengunci PDF.');
  }

  const images = await pdfToImages(file, { imageFormat: 'jpeg', imageQuality: 0.92 });
  if (images.length === 0) {
    throw new Error('Gagal membaca halaman PDF.');
  }

  const doc = new jsPDF({
    orientation: 'p',
    unit: 'pt',
    format: 'a4',
    encryption: {
      userPassword: userPassword.trim(),
      ownerPassword: userPassword.trim() + '_owner',
      userPermissions: ['print', 'copy'],
    },
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 0; i < images.length; i++) {
    if (i > 0) doc.addPage();
    doc.addImage(images[i].dataUrl, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
  }

  const pdfArrayBuffer = doc.output('arraybuffer');
  return new Uint8Array(pdfArrayBuffer);
}

/**
 * Unlock PDF by removing password protection
 */
export async function unlockPdf(
  file: File,
  password?: string
): Promise<Uint8Array> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const userPass = password?.trim() || '';

  try {
    // 1. First try loading with pdf-lib ignoreEncryption (works for owner/permission passwords)
    if (!userPass) {
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      return await pdfDoc.save();
    }
  } catch {
    // Falls through to pdfjs decryptor
  }

  // 2. Decrypt using pdfjs-dist which natively supports password parameter
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      password: userPass,
    });
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;

    const doc = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) continue;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: context,
        viewport,
        canvas,
      } as any).promise;

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      if (i > 1) doc.addPage();
      doc.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
    }

    return new Uint8Array(doc.output('arraybuffer'));
  } catch (err: any) {
    if (err.name === 'PasswordException' || err.message?.toLowerCase().includes('password')) {
      throw new Error('Kata sandi salah atau diperlukan. Masukkan kata sandi yang valid.');
    }
    throw new Error('Gagal membuka file PDF: ' + (err.message || 'Format tidak valid.'));
  }
}

/**
 * Resize all PDF pages to a target standard size
 * Supported sizes: A4 (595.28 x 841.89 pt), Letter (612 x 792 pt), Legal (612 x 1008 pt), F4/Folio (609.45 x 935.43 pt)
 */
export async function resizePdfPages(
  file: File,
  targetSize: 'a4' | 'letter' | 'legal' | 'f4' = 'a4'
): Promise<Uint8Array> {
  const SIZES: Record<string, [number, number]> = {
    a4: [595.28, 841.89],
    letter: [612.0, 792.0],
    legal: [612.0, 1008.0],
    f4: [609.45, 935.43], // 215mm x 330mm
  };

  const [targetWidth, targetHeight] = SIZES[targetSize] || SIZES.a4;
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  const pages = pdfDoc.getPages();
  for (const page of pages) {
    const { width, height } = page.getSize();
    const scaleX = targetWidth / width;
    const scaleY = targetHeight / height;
    // Scale uniformly to prevent distortion, centered
    const scale = Math.min(scaleX, scaleY);

    page.scale(scale, scale);
    page.setSize(targetWidth, targetHeight);
    
    // Recenter content
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;
    const offsetX = (targetWidth - scaledWidth) / 2;
    const offsetY = (targetHeight - scaledHeight) / 2;
    page.translateContent(offsetX, offsetY);
  }

  return await pdfDoc.save();
}

/**
 * Extract all rendered images from PDF pages at high resolution
 */
export async function extractImagesFromPdf(
  file: File
): Promise<{ dataUrl: string; name: string }[]> {
  const images = await pdfToImages(file, { imageFormat: 'png', imageQuality: 1.0 });
  const baseName = file.name.replace(/\.[^/.]+$/, '');

  return images.map((img, idx) => ({
    dataUrl: img.dataUrl,
    name: `${baseName}_Gambar_${idx + 1}.png`,
  }));
}

/**
 * Convert PDF to Grayscale / Black & White
 * Renders each page to canvas, converts pixel buffer with luminance weights, and outputs clean B&W PDF
 */
export async function grayscalePdf(file: File): Promise<Uint8Array> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;

  const doc = new jsPDF({
    orientation: 'p',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) continue;

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport,
      canvas,
    } as any).promise;

    // Apply grayscale conversion
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      // Standard luminance formula
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    }
    context.putImageData(imageData, 0, 0);

    const imgData = canvas.toDataURL('image/jpeg', 0.9);
    if (pageNum > 1) doc.addPage();
    doc.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
  }

  return new Uint8Array(doc.output('arraybuffer'));
}

