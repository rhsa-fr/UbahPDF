import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import * as Icons from 'lucide-react';
import {
  X,
  Play,
  Download,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Settings,
  RefreshCw,
} from 'lucide-react';
import { FileDropzone } from './FileDropzone';
import { PageReorderGrid } from './PageReorderGrid';
import { SignatureCanvas } from './SignatureCanvas';
import { PdfSignatureOverlay } from './PdfSignatureOverlay';
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
} from '../services/pdfService';
import { textToDocx, docxToPdf } from '../services/docService';
import { downloadFile, parsePageRanges, formatBytes } from '../services/fileUtils';
import type { Tool, UploadedFile, PdfPageThumbnail, ConversionOptions } from '../types';

interface ToolWorkspaceProps {
  tool: Tool;
  onClose: () => void;
}

export const ToolWorkspace: React.FC<ToolWorkspaceProps> = ({ tool, onClose }) => {
  const ToolHeaderIcon = (Icons as any)[tool.iconName] || Icons.FileText;
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load PDF thumbnails when first PDF file is added (for split, rotate, reorder)
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
      prev.map((t) => (t.pageNumber === pageNum ? { ...t, rotation: (t.rotation + 90) % 360 } : t))
    );
  };

  const handleMovePage = (fromIdx: number, toIdx: number) => {
    setThumbnails((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  };

  // Execute Document Conversion Engine
  const handleStartConversion = async () => {
    if (files.length === 0) return;

    setStatus('processing');
    setErrorMsg(null);
    setProgressText('Memproses dokumen...');

    try {
      if (tool.id === 'merge-pdf') {
        setProgressText('Menggabungkan beberapa file PDF...');
        const mergedBytes = await mergePdfs(files.map((f) => f.file));
        setResultData({
          data: mergedBytes,
          filename: 'UbahPDF_Merged.pdf',
          type: 'single',
        });
      } else if (tool.id === 'compress-pdf') {
        setProgressText('Mengompresi file PDF...');
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
        setProgressText('Menambahkan nomor halaman...');
        const resBytes = await addPageNumbers(files[0].file, options);
        setResultData({
          data: resBytes,
          filename: `UbahPDF_Numbered_${files[0].name}`,
          type: 'single',
        });
      } else if (tool.id === 'split-pdf') {
        setProgressText('Memisahkan halaman PDF...');
        let pagesToKeep: number[] = [];
        if (options.splitRange?.trim()) {
          pagesToKeep = parsePageRanges(options.splitRange, thumbnails.length);
        } else {
          pagesToKeep = thumbnails.filter((t) => t.selected).map((t) => t.pageNumber);
        }

        if (pagesToKeep.length === 0) {
          throw new Error('Pilih setidaknya 1 halaman untuk dipisahkan.');
        }

        const splitBytes = await splitPdf(files[0].file, pagesToKeep);
        setResultData({
          data: splitBytes,
          filename: `UbahPDF_Split_${files[0].name}`,
          type: 'single',
        });
      } else if (tool.id === 'image-to-pdf') {
        setProgressText('Mengonversi gambar menjadi PDF...');
        const pdfBytes = await imagesToPdf(
          files.map((f) => f.file),
          options
        );
        setResultData({
          data: pdfBytes,
          filename: 'UbahPDF_Converted.pdf',
          type: 'single',
        });
      } else if (tool.id === 'pdf-to-image') {
        setProgressText('Meng-ekstrak halaman PDF menjadi Gambar...');
        const imagesResult = await pdfToImages(files[0].file, options);
        setResultData({
          data: imagesResult,
          filename: `${files[0].name}_images`,
          type: 'images',
        });
      } else if (tool.id === 'pdf-to-word') {
        setProgressText('Meng-ekstrak teks dari PDF ke Word (.docx)...');
        const extractedText = await pdfToText(files[0].file);
        const docxBlob = await textToDocx(extractedText);
        setResultData({
          data: docxBlob,
          filename: `${files[0].name.replace(/\.[^/.]+$/, '')}.docx`,
          type: 'single',
        });
      } else if (tool.id === 'word-to-pdf') {
        setProgressText('Mengonversi dokumen Word (.docx) ke PDF...');
        const pdfBytes = await docxToPdf(files[0].file);
        setResultData({
          data: pdfBytes,
          filename: `${files[0].name.replace(/\.[^/.]+$/, '')}.pdf`,
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
        setProgressText('Menambahkan watermark ke PDF...');
        if (options.watermarkType === 'image' && !options.watermarkImageFile) {
          throw new Error('Silakan pilih file gambar/logo watermark terlebih dahulu.');
        }
        const watermarkedBytes = await watermarkPdf(
          files[0].file,
          options
        );
        setResultData({
          data: watermarkedBytes,
          filename: `UbahPDF_Watermarked_${files[0].name}`,
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
      }

      setStatus('success');
      // Trigger confetti celebration!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden border border-slate-200 flex flex-col shadow-2xl">
        {/* Workspace Top Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold shadow-2xs shrink-0"
              style={{ backgroundColor: `${tool.color}15`, color: tool.color }}
            >
              <ToolHeaderIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-['Outfit'] truncate">
                {tool.name}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 truncate sm:whitespace-normal">
                {tool.description}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup"
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {status === 'success' ? (
            /* Dedicated Success Screen View */
            <div className="py-10 px-4 text-center flex flex-col items-center justify-center space-y-6 animate-fadeIn">
              <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
                  Dokumen Berhasil Diproses!
                </h3>
                {resultData?.filename && (
                  <p className="text-xs text-slate-600 font-mono bg-slate-100 px-3.5 py-2 rounded-xl inline-block border border-slate-200 truncate max-w-xs sm:max-w-md">
                    {resultData.filename}
                  </p>
                )}
                {resultData?.meta && (
                  <div className="mt-3 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl inline-block">
                    🎉 Ukuran berkurang{' '}
                    <span className="font-extrabold text-emerald-950">
                      {Math.max(
                        0,
                        Math.round(
                          ((resultData.meta.originalSize - resultData.meta.compressedSize) /
                            resultData.meta.originalSize) *
                            100
                        )
                      )}
                      %
                    </span>{' '}
                    ({formatBytes(resultData.meta.originalSize)} ➔{' '}
                    {formatBytes(resultData.meta.compressedSize)})
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 w-full max-w-md justify-center">
                <button
                  onClick={handleDownload}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Download className="w-5 h-5" />
                  <span>Unduh File PDF</span>
                </button>

                <button
                  onClick={handleClearAll}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-slate-200"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Konversi File Lain</span>
                </button>
              </div>
            </div>
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
                <div className="flex items-center justify-center py-8 gap-3 text-slate-400 text-xs">
                  <Loader2 className="w-5 h-5 animate-spin text-rose-400" />
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
              {files.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <Settings className="w-4 h-4 text-rose-500" />
                    <span>Pengaturan Konversi</span>
                  </div>

                  {tool.id === 'compress-pdf' && (
                    <div className="space-y-3 text-xs">
                      <label className="block text-slate-600 font-medium">Tingkat Kompresi</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          {
                            id: 'recommended',
                            title: 'Direkomendasikan',
                            desc: 'Kualitas teks & gambar tetap bagus, ukuran mengecil signifikan.',
                            badge: 'Paling Seimbang',
                          },
                          {
                            id: 'extreme',
                            title: 'Kompresi Ekstrim',
                            desc: 'Ukuran file sekecil mungkin untuk email/upload terbatas.',
                            badge: 'Ukuran Terkecil',
                          },
                          {
                            id: 'low',
                            title: 'Kompresi Rendah',
                            desc: 'Pengurangan ukuran ringan dengan kualitas gambar maksimal.',
                            badge: 'Kualitas Tinggi',
                          },
                        ].map((lvl) => (
                          <button
                            key={lvl.id}
                            type="button"
                            onClick={() =>
                              setOptions({ ...options, compressLevel: lvl.id as any })
                            }
                            className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                              options.compressLevel === lvl.id
                                ? 'border-rose-500 bg-rose-50 shadow-sm'
                                : 'border-slate-200 bg-white hover:bg-slate-100/60 text-slate-600'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-slate-900">{lvl.title}</span>
                              </div>
                              <p className="text-[11px] text-slate-500 leading-relaxed mb-2">
                                {lvl.desc}
                              </p>
                            </div>
                            <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                              {lvl.badge}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {tool.id === 'page-numbers' && (
                    <div className="space-y-4 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1 font-medium">Format Penomoran</label>
                        <select
                          value={options.pageNumberFormat}
                          onChange={(e: any) =>
                            setOptions({ ...options, pageNumberFormat: e.target.value })
                          }
                          className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-rose-500"
                        >
                          <option value="arabic">Angka Arab (1, 2, 3...)</option>
                          <option value="roman-lower">Romawi Kecil (i, ii, iii...)</option>
                          <option value="roman-upper">Romawi Besar (I, II, III...)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1 font-medium">Gaya Teks</label>
                        <select
                          value={options.pageNumberStyle}
                          onChange={(e: any) =>
                            setOptions({ ...options, pageNumberStyle: e.target.value })
                          }
                          className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-rose-500"
                        >
                          <option value="number-only">Angka saja (misal: 1)</option>
                          <option value="page-x">Halaman X (misal: Halaman 1)</option>
                          <option value="page-x-of-y">Halaman X dari Y (misal: Halaman 1 dari 10)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1 font-medium">Posisi Letak Nomor</label>
                        <select
                          value={options.pageNumberPosition}
                          onChange={(e: any) =>
                            setOptions({ ...options, pageNumberPosition: e.target.value })
                          }
                          className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-rose-500"
                        >
                          <option value="bottom-right">Bawah Kanan (Standar Buku/Skripsi)</option>
                          <option value="bottom-center">Bawah Tengah (Standar Makalah)</option>
                          <option value="bottom-left">Bawah Kiri</option>
                          <option value="top-right">Atas Kanan</option>
                          <option value="top-center">Atas Tengah</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="skipCover"
                          checked={options.pageNumberSkipCover}
                          onChange={(e) =>
                            setOptions({ ...options, pageNumberSkipCover: e.target.checked })
                          }
                          className="rounded border-slate-300 text-rose-500 focus:ring-rose-500"
                        />
                        <label htmlFor="skipCover" className="text-slate-600 font-medium cursor-pointer">
                          Lewati Halaman Sampul/Cover (Jangan beri nomor di Halaman 1)
                        </label>
                      </div>
                    </div>
                  )}

                  {tool.id === 'pdf-to-image' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1">Format Gambar Output</label>
                        <select
                          value={options.imageFormat}
                          onChange={(e: any) =>
                            setOptions({ ...options, imageFormat: e.target.value })
                          }
                          className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-rose-500"
                        >
                          <option value="png">PNG (Kualitas Terbaik & Jernih)</option>
                          <option value="jpeg">JPG / JPEG (Ukuran Lebih Ringan)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {tool.id === 'image-to-pdf' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1">Ukuran Halaman</label>
                        <select
                          value={options.pageSize}
                          onChange={(e: any) =>
                            setOptions({ ...options, pageSize: e.target.value })
                          }
                          className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-rose-500"
                        >
                          <option value="a4">Standar A4</option>
                          <option value="letter">Letter</option>
                          <option value="fit">Sesuai Ukuran Gambar</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Orientasi</label>
                        <select
                          value={options.orientation}
                          onChange={(e: any) =>
                            setOptions({ ...options, orientation: e.target.value })
                          }
                          className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-rose-500"
                        >
                          <option value="portrait">Tegak (Portrait)</option>
                          <option value="landscape">Mendatar (Landscape)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Margin Pinggir</label>
                        <select
                          value={options.margin}
                          onChange={(e: any) =>
                            setOptions({ ...options, margin: e.target.value })
                          }
                          className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-rose-500"
                        >
                          <option value="none">Tanpa Margin (Penuh)</option>
                          <option value="small">Margin Kecil</option>
                          <option value="large">Margin Besar</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {tool.id === 'watermark-pdf' && (
                    <div className="space-y-4 text-xs">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-slate-600 font-medium cursor-pointer">
                          <input
                            type="radio"
                            name="wmType"
                            checked={options.watermarkType === 'text'}
                            onChange={() => setOptions({ ...options, watermarkType: 'text' })}
                            className="text-rose-500 focus:ring-rose-500"
                          />
                          <span>Watermark Teks</span>
                        </label>
                        <label className="flex items-center gap-2 text-slate-600 font-medium cursor-pointer">
                          <input
                            type="radio"
                            name="wmType"
                            checked={options.watermarkType === 'image'}
                            onChange={() => setOptions({ ...options, watermarkType: 'image' })}
                            className="text-rose-500 focus:ring-rose-500"
                          />
                          <span>Watermark Logo / Gambar</span>
                        </label>
                      </div>

                      {options.watermarkType === 'text' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-slate-400 mb-1">Teks Watermark</label>
                            <input
                              type="text"
                              value={options.watermarkText}
                              onChange={(e) => setOptions({ ...options, watermarkText: e.target.value })}
                              placeholder="misal: RAHASIA / DRAFT"
                              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-rose-500"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-1">Ukuran Font ({options.watermarkFontSize}px)</label>
                            <input
                              type="range"
                              min="12"
                              max="120"
                              value={options.watermarkFontSize}
                              onChange={(e) => setOptions({ ...options, watermarkFontSize: parseInt(e.target.value) })}
                              className="w-full accent-rose-500 cursor-pointer"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <label className="block text-slate-400 font-medium">Upload File Logo Watermark (PNG/JPG)</label>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setOptions({ ...options, watermarkImageFile: e.target.files[0] });
                              }
                            }}
                            className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-600 hover:file:bg-rose-100"
                          />

                          {options.watermarkImageFile && (
                            <p className="text-[11px] text-emerald-600 font-semibold">
                              ✓ Logo terpilih: {options.watermarkImageFile.name}
                            </p>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div>
                              <label className="block text-slate-400 mb-1">Ukuran Lebar Logo ({options.watermarkImageWidth || 150}px)</label>
                              <input
                                type="range"
                                min="40"
                                max="400"
                                value={options.watermarkImageWidth || 150}
                                onChange={(e) => setOptions({ ...options, watermarkImageWidth: parseInt(e.target.value) })}
                                className="w-full accent-rose-500 cursor-pointer"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-400 mb-1">
                                Transparansi Logo ({Math.round((options.watermarkOpacity || 0.3) * 100)}%)
                              </label>
                              <input
                                type="range"
                                min="0.1"
                                max="1.0"
                                step="0.05"
                                value={options.watermarkOpacity || 0.3}
                                onChange={(e) =>
                                  setOptions({
                                    ...options,
                                    watermarkOpacity: parseFloat(e.target.value),
                                  })
                                }
                                className="w-full accent-rose-500 cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {tool.id === 'split-pdf' && (
                    <div className="text-xs">
                      <label className="block text-slate-600 mb-1 font-medium">
                        Rentang Halaman Kustom (Opsional, misal: 1-3, 5, 8-10)
                      </label>
                      <input
                        type="text"
                        value={options.splitRange}
                        onChange={(e) => setOptions({ ...options, splitRange: e.target.value })}
                        placeholder="Kosongkan untuk menggunakan hasil klik pratinjau di atas"
                        className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  )}

                  {tool.id === 'sign-pdf' && (
                    <div className="space-y-4 text-xs">
                      <SignatureCanvas
                        onSaveSignature={(dataUrl) =>
                          setOptions({ ...options, signatureDataUrl: dataUrl })
                        }
                        savedDataUrl={options.signatureDataUrl}
                      />

                      {options.signatureDataUrl && files.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSignStep('place')}
                          className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5"
                        >
                          <span>Lanjut Geser Posisi Tanda Tangan di PDF ➔</span>
                        </button>
                      )}
                    </div>
                  )}

                  {tool.id === 'delete-pages' && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                      💡 Klik pada thumbnail halaman di atas yang ingin Anda HAPUS. Halaman yang terpilih akan ditandai.
                    </div>
                  )}

                  {tool.id === 'protect-pdf' && (
                    <div className="space-y-3 text-xs">
                      <label className="block text-slate-700 font-bold">
                        Masukkan Kata Sandi (Password) Pengunci PDF
                      </label>
                      <input
                        type="password"
                        value={options.userPassword || ''}
                        onChange={(e) => setOptions({ ...options, userPassword: e.target.value })}
                        placeholder="Ketik password untuk mengunci file..."
                        className="w-full p-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-purple-500 font-medium"
                      />
                      <p className="text-[11px] text-slate-500">
                        File PDF hasil unduhan akan meminta password ini setiap kali dibuka di aplikasi pembaca PDF.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Status Feedback for Processing & Error */}
              {status === 'processing' && (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 text-xs flex items-center justify-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  <span className="font-semibold">{progressText}</span>
                </div>
              )}

              {status === 'error' && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Workspace Bottom Action Footer */}
        <div className="px-4 sm:px-6 py-3.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3">
          {status === 'success' ? (
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors border border-slate-200 text-center"
            >
              Selesai & Kembali ke Beranda
            </button>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors shrink-0"
              >
                Batal
              </button>

              <button
                disabled={files.length === 0 || status === 'processing'}
                onClick={handleStartConversion}
                className={`px-5 sm:px-6 py-2.5 rounded-xl text-xs font-extrabold text-white flex items-center gap-2 transition-all shadow-md ${
                  files.length === 0 || status === 'processing'
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-rose-500 to-indigo-600 hover:opacity-95 shadow-rose-500/20'
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
