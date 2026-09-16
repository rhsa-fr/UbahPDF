import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Play,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { FileDropzone } from './FileDropzone';
import { PageReorderGrid } from './PageReorderGrid';
import { PdfSignatureOverlay } from './PdfSignatureOverlay';
import { SuccessResultView } from './SuccessResultView';
import { ToolOptionsPanel } from './ToolOptionsPanel';
import { ToolIcon } from './ToolIcons';
import {
  mergePdfs,
  splitPdf,
  renderPdfThumbnails,
  pdfToImages,
  imagesToPdf,
  rotatePdfPages,
  watermarkPdf,
  pdfToText,
  reorderPdfPages,
  compressPdf,
  addPageNumbers,
  signPdf,
  deletePdfPages,
  protectPdf,
  unlockPdf,
  resizePdfPages,
  extractImagesFromPdf,
  grayscalePdf,
} from '../services/pdfService';
import { textToDocx, docxToPdf, pdfToDocx, pdfToDocxImage } from '../services/docService';
import { excelToPdf } from '../services/excelService';
import { pdfToMarkdown, docxToMarkdown } from '../services/markdownService';
import { downloadFile, parsePageRanges } from '../services/fileUtils';
import type { Tool, UploadedFile, PdfPageThumbnail, ConversionOptions } from '../types';

interface ToolWorkspaceProps {
  tool: Tool;
  onClose: () => void;
  isEmbedded?: boolean;
}

export const ToolWorkspace: React.FC<ToolWorkspaceProps> = ({ tool, onClose, isEmbedded = false }) => {
  const modalBodyRef = useRef<HTMLDivElement | null>(null);

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [thumbnails, setThumbnails] = useState<PdfPageThumbnail[]>([]);
  const [pageRotations, setPageRotations] = useState<Map<number, number>>(new Map());
  const [isLoadingThumbnails, setIsLoadingThumbnails] = useState<boolean>(false);
  const [signStep, setSignStep] = useState<'create' | 'place'>('create');

  // Conversion Options State
  const [options, setOptions] = useState<ConversionOptions>({
    pageSize: 'a4',
    orientation: 'portrait',
    margin: 'small',
    imageFormat: 'png',
    imageQuality: 0.9,
    compressLevel: 'recommended',
    pageNumberFormat: 'arabic',
    pageNumberStyle: 'page-x-of-y',
    pageNumberPosition: 'bottom-right',
    pageNumberStart: 1,
    pageNumberSkipCover: false,
    watermarkType: 'text',
    watermarkText: 'CONFIDENTIAL',
    watermarkImageFile: null,
    watermarkImageWidth: 160,
    watermarkFontSize: 42,
    watermarkOpacity: 0.3,
    watermarkAngle: 45,
    splitRange: '',
  });

  // Processing State
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progressText, setProgressText] = useState<string>('');
  const [resultData, setResultData] = useState<{
    data: Blob | Uint8Array | { dataUrl: string; name: string }[];
    filename: string;
    type: 'single' | 'images' | 'text';
    meta?: { originalSize: number; compressedSize: number };
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Load PDF thumbnails when first PDF file is added (for split, rotate, reorder, sign, delete)
  useEffect(() => {
    if (
      files.length > 0 &&
      files[0].file.type.includes('pdf') &&
      ['split-pdf', 'rotate-pdf', 'reorder-pdf', 'sign-pdf', 'delete-pages'].includes(tool.id)
    ) {
      setIsLoadingThumbnails(true);
      renderPdfThumbnails(files[0].file)
        .then((thumbs) => {
          setThumbnails(thumbs);
          setIsLoadingThumbnails(false);
        })
        .catch((err) => {
          console.error('Error rendering thumbnails:', err);
          setIsLoadingThumbnails(false);
        });
    } else {
      setThumbnails([]);
    }
  }, [files, tool.id]);

  const handleFilesAdded = (newFiles: File[]) => {
    const uploaded = newFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    if (tool.multiple) {
      setFiles((prev) => [...prev, ...uploaded]);
    } else {
      setFiles(uploaded);
    }
    setStatus('idle');
    setResultData(null);
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    setStatus('idle');
    setResultData(null);
  };

  const handleClearAll = () => {
    setFiles([]);
    setThumbnails([]);
    setSignStep('create');
    setStatus('idle');
    setResultData(null);
  };

  // Thumbnail interactions
  const handleTogglePageSelect = (pageNum: number) => {
    setThumbnails((prev) =>
      prev.map((t) => (t.pageNumber === pageNum ? { ...t, selected: !t.selected } : t))
    );
  };

  const handleRotatePage = (pageNum: number) => {
    setPageRotations((prev) => {
      const next = new Map(prev);
      const current = next.get(pageNum) || 0;
      next.set(pageNum, (current + 90) % 360);
      return next;
    });

    setThumbnails((prev) =>
      prev.map((t) =>
        t.pageNumber === pageNum ? { ...t, rotation: ((t.rotation || 0) + 90) % 360 } : t
      )
    );
  };

  const handleMovePage = (dragIdx: number, dropIdx: number) => {
    setThumbnails((prev) => {
      const updated = [...prev];
      const [removed] = updated.splice(dragIdx, 1);
      updated.splice(dropIdx, 0, removed);
      return updated;
    });
  };

  // Core Conversion Dispatcher
  const handleStartConversion = async () => {
    if (files.length === 0) return;

    setStatus('processing');
    setErrorMsg('');

    try {
      if (tool.id === 'merge-pdf') {
        setProgressText('Menggabungkan dokumen PDF...');
        const mergedBytes = await mergePdfs(files.map((f) => f.file));
        setResultData({
          data: mergedBytes,
          filename: `UbahPDF_Merged_${Date.now()}.pdf`,
          type: 'single',
        });
      } else if (tool.id === 'split-pdf') {
        setProgressText('Memisahkan halaman PDF...');
        let pagesToKeep: number[] = [];
        if (options.splitRange && options.splitRange.trim()) {
          pagesToKeep = parsePageRanges(options.splitRange, thumbnails.length || 100);
        } else {
          pagesToKeep = thumbnails.filter((t) => t.selected).map((t) => t.pageNumber);
        }

        if (pagesToKeep.length === 0) {
          throw new Error('Pilih setidaknya satu halaman untuk dipisahkan.');
        }

        const splitBytes = await splitPdf(files[0].file, pagesToKeep);
        setResultData({
          data: splitBytes,
          filename: `UbahPDF_Split_${files[0].name}`,
          type: 'single',
        });
      } else if (tool.id === 'pdf-to-image') {
        setProgressText('Mengekstrak halaman PDF menjadi gambar...');
        const images = await pdfToImages(files[0].file, options);
        setResultData({
          data: images,
          filename: `UbahPDF_Images_${files[0].name}.zip`,
          type: 'images',
        });
      } else if (tool.id === 'image-to-pdf') {
        setProgressText('Mengonversi gambar ke dokumen PDF...');
        const pdfBytes = await imagesToPdf(
          files.map((f) => f.file),
          options
        );
        setResultData({
          data: pdfBytes,
          filename: `UbahPDF_Document_${Date.now()}.pdf`,
          type: 'single',
        });
      } else if (tool.id === 'rotate-pdf') {
        setProgressText('Memutar orientasi halaman PDF...');
        const rotatedBytes = await rotatePdfPages(files[0].file, pageRotations);
        setResultData({
          data: rotatedBytes,
          filename: `UbahPDF_Rotated_${files[0].name}`,
          type: 'single',
        });
      } else if (tool.id === 'watermark-pdf') {
        setProgressText('Menambahkan watermark pada PDF...');
        const watermarkedBytes = await watermarkPdf(files[0].file, options);
        setResultData({
          data: watermarkedBytes,
          filename: `UbahPDF_Watermarked_${files[0].name}`,
          type: 'single',
        });
      } else if (tool.id === 'pdf-to-text') {
        setProgressText('Mengekstrak teks dari PDF...');
        const textContent = await pdfToText(files[0].file);
        const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        setResultData({
          data: blob,
          filename: `UbahPDF_Extracted_${files[0].name.replace(/\.[^/.]+$/, '')}.txt`,
          type: 'single',
        });
      } else if (tool.id === 'pdf-to-word') {
        const outputFormat = options.pdfToWordFormat || 'editable';
        if (outputFormat === 'editable') {
          setProgressText('Mengekstrak teks & gambar menjadi dokumen Word yang dapat diedit...');
          const docxBlob = await pdfToDocx(files[0].file);
          setResultData({
            data: docxBlob,
            filename: `UbahPDF_${files[0].name.replace(/\.[^/.]+$/, '')}.docx`,
            type: 'single',
          });
        } else if (outputFormat === 'image') {
          setProgressText('Mengonversi PDF ke dokumen Word (salinan visual gambar)...');
          const docxBlob = await pdfToDocxImage(files[0].file);
          setResultData({
            data: docxBlob,
            filename: `UbahPDF_Visual_${files[0].name.replace(/\.[^/.]+$/, '')}.docx`,
            type: 'single',
          });
        } else {
          setProgressText('Mengekstrak teks dari PDF...');
          const textContent = await pdfToText(files[0].file);
          const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
          setResultData({
            data: blob,
            filename: `UbahPDF_${files[0].name.replace(/\.[^/.]+$/, '')}.txt`,
            type: 'single',
          });
        }
      } else if (tool.id === 'txt-to-word') {
        setProgressText('Mengonversi file TXT menjadi DOCX Word...');
        const textContent = await files[0].file.text();
        const docxBlob = await textToDocx(textContent);
        setResultData({
          data: docxBlob,
          filename: `UbahPDF_${files[0].name.replace(/\.[^/.]+$/, '')}.docx`,
          type: 'single',
        });
      } else if (tool.id === 'word-to-pdf') {
        setProgressText('Mengonversi file Word DOCX menjadi PDF...');
        const pdfBytes = await docxToPdf(files[0].file);
        setResultData({
          data: pdfBytes,
          filename: `UbahPDF_${files[0].name.replace(/\.[^/.]+$/, '')}.pdf`,
          type: 'single',
        });
      } else if (tool.id === 'reorder-pdf') {
        setProgressText('Mengurutkan ulang halaman PDF...');
        const newOrder = thumbnails.map((t) => t.pageNumber);
        const reorderedBytes = await reorderPdfPages(files[0].file, newOrder);
        setResultData({
          data: reorderedBytes,
          filename: `UbahPDF_Reordered_${files[0].name}`,
          type: 'single',
        });
      } else if (tool.id === 'compress-pdf') {
        setProgressText('Mengecilkan ukuran file PDF...');
        const res = await compressPdf(files[0].file, options);
        setResultData({
          data: res.pdfBytes,
          filename: `UbahPDF_Compressed_${files[0].name}`,
          type: 'single',
          meta: {
            originalSize: res.originalSize,
            compressedSize: res.compressedSize,
          },
        });
      } else if (tool.id === 'page-numbers') {
        setProgressText('Menambahkan nomor halaman ke PDF...');
        const numberedBytes = await addPageNumbers(files[0].file, options);
        setResultData({
          data: numberedBytes,
          filename: `UbahPDF_Numbered_${files[0].name}`,
          type: 'single',
        });
      } else if (tool.id === 'sign-pdf') {
        setProgressText('Menempelkan tanda tangan ke PDF...');
        if (!options.signatureDataUrl) {
          throw new Error('Silakan gambar atau upload tanda tangan terlebih dahulu.');
        }
        const signedBytes = await signPdf(files[0].file, options.signatureDataUrl, options);
        setResultData({
          data: signedBytes,
          filename: `UbahPDF_Signed_${files[0].name}`,
          type: 'single',
        });
      } else if (tool.id === 'delete-pages') {
        setProgressText('Menghapus halaman PDF...');
        const pagesToDelete = thumbnails.filter((t) => !t.selected).map((t) => t.pageNumber);
        if (pagesToDelete.length === 0) {
          throw new Error('Pilih setidaknya 1 halaman yang ingin dihapus (klik thumbnail halaman di atas).');
        }
        const cleanedBytes = await deletePdfPages(files[0].file, pagesToDelete);
        setResultData({
          data: cleanedBytes,
          filename: `UbahPDF_Cleaned_${files[0].name}`,
          type: 'single',
        });
      } else if (tool.id === 'protect-pdf') {
        setProgressText('Mengunci file PDF dengan kata sandi...');
        if (!options.userPassword || !options.userPassword.trim()) {
          throw new Error('Silakan masukkan kata sandi (password) untuk mengunci PDF.');
        }
        const protectedBytes = await protectPdf(files[0].file, options.userPassword);
        setResultData({
          data: protectedBytes,
          filename: `UbahPDF_Protected_${files[0].name}`,
          type: 'single',
        });
      } else if (tool.id === 'unlock-pdf') {
        setProgressText('Membuka kunci proteksi PDF...');
        const unlockedBytes = await unlockPdf(files[0].file, options.unlockPassword);
        setResultData({
          data: unlockedBytes,
          filename: `UbahPDF_Unlocked_${files[0].name}`,
          type: 'single',
        });
      } else if (tool.id === 'resize-pdf') {
        setProgressText('Mengubah ukuran halaman PDF...');
        const resizedBytes = await resizePdfPages(files[0].file, options.resizeTarget || 'a4');
        setResultData({
          data: resizedBytes,
          filename: `UbahPDF_Resized_${files[0].name}`,
          type: 'single',
        });
      } else if (tool.id === 'extract-images') {
        setProgressText('Mengekstrak gambar dari PDF...');
        const images = await extractImagesFromPdf(files[0].file);
        setResultData({
          data: images,
          filename: `UbahPDF_Images_${files[0].name}.zip`,
          type: 'images',
        });
      } else if (tool.id === 'grayscale-pdf') {
        setProgressText('Mengonversi PDF menjadi hitam putih...');
        const grayBytes = await grayscalePdf(files[0].file);
        setResultData({
          data: grayBytes,
          filename: `UbahPDF_Grayscale_${files[0].name}`,
          type: 'single',
        });
      } else if (tool.id === 'excel-to-pdf') {
        setProgressText('Mengonversi file Excel menjadi PDF...');
        const pdfBytes = await excelToPdf(files[0].file);
        setResultData({
          data: pdfBytes,
          filename: `UbahPDF_${files[0].name.replace(/\.[^/.]+$/, '')}.pdf`,
          type: 'single',
        });
      } else if (tool.id === 'pdf-to-markdown') {
        setProgressText('Mengekstrak konten PDF ke Markdown...');
        const mdContent = await pdfToMarkdown(files[0].file);
        const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
        setResultData({
          data: blob,
          filename: `UbahPDF_${files[0].name.replace(/\.[^/.]+$/, '')}.md`,
          type: 'single',
        });
      } else if (tool.id === 'word-to-markdown') {
        setProgressText('Mengonversi dokumen Word ke Markdown...');
        const mdContent = await docxToMarkdown(files[0].file);
        const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
        setResultData({
          data: blob,
          filename: `UbahPDF_${files[0].name.replace(/\.[^/.]+$/, '')}.md`,
          type: 'single',
        });
      }

      setStatus('success');
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (err: any) {
      console.error('Conversion Error:', err);
      setStatus('error');
      setErrorMsg(err.message || 'Gagal memproses dokumen. Pastikan format file sesuai.');
    }
  };

  const handleDownload = () => {
    if (!resultData) return;
    if (resultData.type === 'single') {
      downloadFile(resultData.data as Blob | Uint8Array, resultData.filename);
    } else if (resultData.type === 'images') {
      const imgList = resultData.data as { dataUrl: string; name: string }[];
      imgList.forEach((img) => {
        const a = document.createElement('a');
        a.href = img.dataUrl;
        a.download = img.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    }
  };

  const handleRenameResult = (newName: string) => {
    setResultData((prev) => {
      if (!prev) return null;
      if (prev.type === 'images' && Array.isArray(prev.data)) {
        const baseNameWithoutExt = newName.replace(/\.[^/.]+$/, '');
        const updatedImages = (prev.data as { dataUrl: string; name: string }[]).map((img, idx) => {
          const imgExt = img.name.slice(img.name.lastIndexOf('.'));
          return {
            ...img,
            name: `${baseNameWithoutExt}_page_${idx + 1}${imgExt}`,
          };
        });
        return {
          ...prev,
          filename: newName,
          data: updatedImages,
        };
      }
      return { ...prev, filename: newName };
    });
  };

  const handleGoToSignStepPlace = () => {
    setSignStep('place');
    if (modalBodyRef.current) {
      modalBodyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const containerClass = isEmbedded
    ? "relative w-full bg-white rounded-xl overflow-hidden flex flex-col"
    : "fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/30 backdrop-blur-sm animate-fadeIn";

  const innerClass = isEmbedded
    ? "relative w-full bg-white rounded-xl overflow-hidden flex flex-col"
    : "relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl overflow-hidden border border-zinc-200 flex flex-col shadow-lg";

  return (
    <div className={containerClass}>
      <div className={innerClass}>
        {/* Workspace Top Header */}
        <div className="px-4 sm:px-6 py-3 border-b border-zinc-200 flex items-center justify-between bg-zinc-50 gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="shrink-0">
              <ToolIcon toolId={tool.id} size={36} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 truncate">
                {tool.name}
              </h2>
              <p className="text-[11px] sm:text-xs text-zinc-500 truncate sm:whitespace-normal">
                {tool.description}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div ref={modalBodyRef} className="p-3.5 sm:p-6 overflow-y-auto flex-1 space-y-4 sm:space-y-6">
          {status === 'success' ? (
            <SuccessResultView
              resultData={resultData}
              onDownload={handleDownload}
              onClearAll={handleClearAll}
              onRename={handleRenameResult}
            />
          ) : tool.id === 'sign-pdf' && signStep === 'place' ? (
            /* Dedicated Full-Screen Signature Drag Editor (Step 2) */
            <div className="space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <button
                  type="button"
                  onClick={() => setSignStep('create')}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors shrink-0"
                >
                  ← Ganti / Edit Tanda Tangan
                </button>

                {thumbnails.length > 0 && (
                  <div className="flex items-center gap-3 text-xs">
                    <label className="text-slate-800 font-bold shrink-0">
                      Tempel pada Halaman Ke-:
                    </label>
                    <select
                      value={options.signaturePage || 1}
                      onChange={(e) =>
                        setOptions({ ...options, signaturePage: parseInt(e.target.value) })
                      }
                      className="p-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 font-bold"
                    >
                      {thumbnails.map((t) => (
                        <option key={t.pageNumber} value={t.pageNumber}>
                          Halaman {t.pageNumber}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {isLoadingThumbnails ? (
                <div className="flex items-center justify-center py-12 gap-3 text-slate-500 text-xs">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                  <span>Membuat pratinjau halaman PDF untuk tanda tangan...</span>
                </div>
              ) : options.signatureDataUrl && thumbnails.length > 0 ? (
                <PdfSignatureOverlay
                  thumbnail={
                    thumbnails.find((t) => t.pageNumber === (options.signaturePage || 1)) ||
                    thumbnails[0]
                  }
                  signatureDataUrl={options.signatureDataUrl}
                  onPositionChange={(pos) =>
                    setOptions((prev) => ({
                      ...prev,
                      signatureXPercent: pos.xPercent,
                      signatureYPercent: pos.yPercent,
                      signatureWidthPercent: pos.widthPercent,
                    }))
                  }
                />
              ) : (
                <div className="p-6 text-center text-slate-500 text-xs space-y-3">
                  <p>Silakan buat atau upload tanda tangan terlebih dahulu pada langkah sebelumnya.</p>
                  <button
                    type="button"
                    onClick={() => setSignStep('create')}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold"
                  >
                    Kembali ke Kanvas Tanda Tangan
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* File Upload Box */}
              <FileDropzone
                tool={tool}
                files={files}
                onFilesAdded={handleFilesAdded}
                onRemoveFile={handleRemoveFile}
                onClearAll={handleClearAll}
              />

              {/* Thumbnail Preview & Visual Page Tools */}
              {isLoadingThumbnails && (
                <div className="flex items-center justify-center py-8 gap-3 text-zinc-400 text-xs">
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                  <span>Membuat pratinjau halaman PDF...</span>
                </div>
              )}

              {thumbnails.length > 0 && !isLoadingThumbnails && (
                <PageReorderGrid
                  thumbnails={thumbnails}
                  onTogglePageSelect={handleTogglePageSelect}
                  onRotatePage={tool.id === 'rotate-pdf' ? handleRotatePage : undefined}
                  onMovePage={tool.id === 'reorder-pdf' ? handleMovePage : undefined}
                  mode={
                    tool.id === 'split-pdf' || tool.id === 'delete-pages'
                      ? 'split'
                      : tool.id === 'rotate-pdf'
                      ? 'rotate'
                      : 'reorder'
                  }
                />
              )}

              {/* Options Panel for Tools */}
              <ToolOptionsPanel
                tool={tool}
                files={files}
                options={options}
                setOptions={setOptions}
                onGoToSignStepPlace={handleGoToSignStepPlace}
              />

              {/* Status Feedback */}
              {status === 'processing' && (
                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs flex items-center justify-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                  <span className="font-semibold">{progressText}</span>
                </div>
              )}

              {status === 'error' && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Workspace Bottom Action Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between gap-3">
          {status === 'success' ? (
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-lg btn-ghost text-xs font-semibold text-center"
            >
              Selesai & Kembali ke Beranda
            </button>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors shrink-0"
              >
                Batal
              </button>

              <button
                disabled={files.length === 0 || status === 'processing'}
                onClick={handleStartConversion}
                className={`px-5 sm:px-6 py-2.5 rounded-lg text-xs font-semibold text-white flex items-center gap-2 transition-all ${
                  files.length === 0 || status === 'processing'
                    ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {status === 'processing' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Mulai Konversi</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
