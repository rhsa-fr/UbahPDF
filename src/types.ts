export type Category = 'pdf' | 'office' | 'image' | 'security';

export type ToolId =
  | 'merge-pdf'
  | 'split-pdf'
  | 'compress-pdf'
  | 'pdf-to-word'
  | 'word-to-pdf'
  | 'image-to-pdf'
  | 'pdf-to-image'
  | 'page-numbers'
  | 'rotate-pdf'
  | 'watermark-pdf'
  | 'reorder-pdf'
  | 'sign-pdf'
  | 'delete-pages'
  | 'protect-pdf'
  | 'unlock-pdf'
  | 'resize-pdf'
  | 'extract-images'
  | 'grayscale-pdf'
  | 'excel-to-pdf'
  | 'pdf-to-markdown'
  | 'word-to-markdown';

export interface Tool {
  id: ToolId | string;
  name: string;
  description: string;
  iconName: string;
  category: Category;
  color: string; // Tailored color badge
  gradient: string;
  accept: string; // e.g. '.pdf', '.docx', '.png,.jpg'
  multiple: boolean;
  popular?: boolean;
}

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  pageCount?: number;
  pages?: PdfPageThumbnail[];
}

export interface PdfPageThumbnail {
  pageNumber: number;
  dataUrl: string;
  rotation: number;
  selected: boolean;
}

export interface ConversionOptions {
  // Image to PDF options
  pageSize?: 'a4' | 'letter' | 'fit';
  orientation?: 'portrait' | 'landscape';
  margin?: 'none' | 'small' | 'large';

  // PDF to Image options
  imageFormat?: 'png' | 'jpeg';
  imageQuality?: number; // 0.1 to 1.0

  // Page Number options
  pageNumberFormat?: 'arabic' | 'roman-lower' | 'roman-upper';
  pageNumberStyle?: 'number-only' | 'page-x' | 'page-x-of-y';
  pageNumberPosition?: 'bottom-right' | 'bottom-center' | 'bottom-left' | 'top-right' | 'top-center';
  pageNumberStart?: number;
  pageNumberSkipCover?: boolean;

  // Compress options
  compressLevel?: 'recommended' | 'extreme' | 'low';

  // Watermark options
  watermarkType?: 'text' | 'image';
  watermarkText?: string;
  watermarkImageFile?: File | null;
  watermarkImageWidth?: number;
  watermarkFontSize?: number;
  watermarkColor?: string;
  watermarkOpacity?: number;
  watermarkAngle?: number;

  // Split options
  splitMode?: 'all' | 'range' | 'selected';
  splitRange?: string; // e.g., "1-3, 5, 7-9"

  // Password options
  password?: string;
  userPassword?: string;

  // Signature options
  signatureDataUrl?: string;
  signaturePage?: number;
  signatureScale?: number;
  signatureXPercent?: number;
  signatureYPercent?: number;
  signatureWidthPercent?: number;

  // Delete pages options
  deletePagesList?: number[];

  // Resize PDF options
  resizeTarget?: 'a4' | 'letter' | 'legal' | 'f4';

  // Unlock PDF options
  unlockPassword?: string;

  // PDF to Word output format
  pdfToWordFormat?: 'editable' | 'image' | 'txt';
}

export type ProcessingStatus = 'idle' | 'processing' | 'success' | 'error';
