import React, { useState, useRef, useEffect } from 'react';
import { Wand2, FileText, Sun, ImageIcon, Check, Plus, Sparkles, Scan } from 'lucide-react';
import { enhanceDocumentImage, warpPerspective, detectDocumentCorners, type Point2D } from '../services/imageEnhanceService';

interface CamScannerEditorProps {
  files: File[];
  onFinishScan: (processedFiles: File[]) => void;
  onAddMorePhotos: () => void;
}

export const CamScannerEditor: React.FC<CamScannerEditorProps> = ({
  files,
  onFinishScan,
  onAddMorePhotos,
}) => {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [originalPreviews, setOriginalPreviews] = useState<string[]>([]);
  const [processedPreviews, setProcessedPreviews] = useState<string[]>([]);
  const [filterMode, setFilterMode] = useState<'magic-color' | 'bw-clean' | 'grayscale' | 'original'>('magic-color');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // 4 Corner points for cropping current image (percentages 0-100%)
  const [corners, setCorners] = useState<[Point2D, Point2D, Point2D, Point2D]>([
    { x: 5, y: 5 },   // Top-Left
    { x: 95, y: 5 },  // Top-Right
    { x: 95, y: 95 }, // Bottom-Right
    { x: 5, y: 95 },  // Bottom-Left
  ]);
  const [activeCornerIdx, setActiveCornerIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize previews for uploaded files
  useEffect(() => {
    const previews = files.map((f) => URL.createObjectURL(f));
    setOriginalPreviews(previews);
    setProcessedPreviews(previews);
  }, [files]);

  // Auto detect paper edge boundaries on initial load or active page change
  const autoDetectPaperCorners = async (srcUrl: string) => {
    try {
      const detected = await detectDocumentCorners(srcUrl);
      setCorners(detected);
    } catch (err) {
      console.warn('Auto corner detection failed, using fallback:', err);
    }
  };

  useEffect(() => {
    if (originalPreviews[activeIdx]) {
      autoDetectPaperCorners(originalPreviews[activeIdx]);
    }
  }, [activeIdx, originalPreviews]);

  // Re-process active photo whenever filter or corner crop changes
  const applyFilterToCurrentPage = async (srcUrl: string) => {
    setIsProcessing(true);
    try {
      const img = new Image();
      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = srcUrl;
      });

      const pixelCorners: [Point2D, Point2D, Point2D, Point2D] = [
        { x: (corners[0].x / 100) * img.width, y: (corners[0].y / 100) * img.height },
        { x: (corners[1].x / 100) * img.width, y: (corners[1].y / 100) * img.height },
        { x: (corners[2].x / 100) * img.width, y: (corners[2].y / 100) * img.height },
        { x: (corners[3].x / 100) * img.width, y: (corners[3].y / 100) * img.height },
      ];

      const warpedDataUrl = await warpPerspective(srcUrl, pixelCorners);
      const enhancedDataUrl = await enhanceDocumentImage(warpedDataUrl, {
        filterMode,
      });

      setProcessedPreviews((prev) => {
        const next = [...prev];
        next[activeIdx] = enhancedDataUrl;
        return next;
      });
    } catch (err) {
      console.error('Error applying scan enhancement:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (originalPreviews[activeIdx]) {
      applyFilterToCurrentPage(originalPreviews[activeIdx]);
    }
  }, [activeIdx, filterMode, corners]);

  // Handle dragging 4-corner crop handles
  const handlePointerDown = (cornerIdx: number) => {
    setActiveCornerIdx(cornerIdx);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (activeCornerIdx === null || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * 100;
    const rawY = ((e.clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.max(0, Math.min(100, rawX));
    const clampedY = Math.max(0, Math.min(100, rawY));

    setCorners((prev) => {
      const next: [Point2D, Point2D, Point2D, Point2D] = [prev[0], prev[1], prev[2], prev[3]];
      next[activeCornerIdx] = { x: clampedX, y: clampedY };
      return next;
    });
  };

  const handlePointerUp = () => {
    setActiveCornerIdx(null);
  };

  // Convert processed previews back to File objects and send to PDF Generator
  const handleFinish = async () => {
    setIsProcessing(true);
    const finalFiles: File[] = [];

    for (let i = 0; i < processedPreviews.length; i++) {
      const res = await fetch(processedPreviews[i]);
      const blob = await res.blob();
      const file = new File([blob], `scan_page_${i + 1}.jpg`, { type: 'image/jpeg' });
      finalFiles.push(file);
    }

    onFinishScan(finalFiles);
  };

  return (
    <div className="w-full space-y-4 select-none">
      {/* Top Banner Filter Selector (CamScanner Bar) */}
      <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'magic-color', label: 'Magic Color', icon: Wand2, badge: 'CamScanner' },
            { id: 'bw-clean', label: 'Hitam-Putih', icon: FileText, badge: 'Skripsi/Dokumen' },
            { id: 'grayscale', label: 'Grayscale', icon: Sun, badge: 'Abu-abu' },
            { id: 'original', label: 'Original', icon: ImageIcon, badge: 'Asli' },
          ].map((mode) => {
            const IconComp = mode.icon;
            const isSelected = filterMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setFilterMode(mode.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25 scale-105'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => originalPreviews[activeIdx] && autoDetectPaperCorners(originalPreviews[activeIdx])}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Deteksi Otomatis Tepi Kertas Dokumen"
          >
            <Scan className="w-3.5 h-3.5 text-cyan-400" />
            <span>Auto Detect Kertas</span>
          </button>

          <button
            type="button"
            onClick={onAddMorePhotos}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-rose-400" />
            <span>Tambah Halaman</span>
          </button>
        </div>
      </div>

      {/* Main Document Cropping & Warp Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Box: Original Camera Photo + 4 Corner Drag Handles */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-300">
              1. Bingkai Tepi Kertas (Geser 4 Titik Sudut)
            </span>
            <span className="text-[11px] text-cyan-400 font-medium">Tarik sudut untuk meluruskan</span>
          </div>

          <div
            ref={containerRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="relative aspect-[3/4] max-h-[380px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center touch-none"
          >
            {originalPreviews[activeIdx] && (
              <img
                src={originalPreviews[activeIdx]}
                alt="Original Scan"
                className="w-full h-full object-contain select-none"
              />
            )}

            {/* Polygon Lines Connecting the 4 Corners */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <polygon
                points={`${corners[0].x}%,${corners[0].y}% ${corners[1].x}%,${corners[1].y}% ${corners[2].x}%,${corners[2].y}% ${corners[3].x}%,${corners[3].y}%`}
                fill="rgba(6, 182, 212, 0.15)"
                stroke="#06b6d4"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            </svg>

            {/* 4 Draggable Corner Handles */}
            {corners.map((c, idx) => (
              <div
                key={idx}
                onPointerDown={() => handlePointerDown(idx)}
                style={{ left: `${c.x}%`, top: `${c.y}%` }}
                className="absolute w-7 h-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 border-2 border-white shadow-lg cursor-grab active:cursor-grabbing flex items-center justify-center group z-20 hover:scale-125 transition-transform"
              >
                <div className="w-2 h-2 rounded-full bg-slate-950" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Box: Enhanced Straightened Result Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              2. Hasil Scan Jernih (Magic Clean)
            </span>
            <span className="text-[11px] text-slate-400">Siap Jadi PDF</span>
          </div>

          <div className="relative aspect-[3/4] max-h-[380px] rounded-2xl overflow-hidden bg-slate-950 border border-emerald-500/30 flex items-center justify-center shadow-xl">
            {processedPreviews[activeIdx] ? (
              <img
                src={processedPreviews[activeIdx]}
                alt="Enhanced Result"
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <div className="text-slate-500 text-xs">Memproses dokumen...</div>
            )}

            {isProcessing && (
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center gap-2 text-cyan-400 text-xs font-semibold">
                <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                <span>Meluruskan & Membersihkan Dokumen...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Thumbnails Strip & Finalize Button */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
        {/* Page thumbnails selection */}
        <div className="flex items-center gap-2 overflow-x-auto pr-2">
          {processedPreviews.map((previewUrl, idx) => (
            <div
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative w-14 h-18 rounded-lg overflow-hidden border cursor-pointer transition-all ${
                activeIdx === idx
                  ? 'border-rose-500 ring-2 ring-rose-500/40 scale-105'
                  : 'border-slate-800 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={previewUrl} alt={`Halaman ${idx + 1}`} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[9px] font-bold text-center text-white">
                Hal {idx + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Generate PDF Confirm Button */}
        <button
          onClick={handleFinish}
          disabled={isProcessing}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:opacity-90 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-rose-500/25 transition-all shrink-0"
        >
          <Check className="w-4 h-4" />
          <span>Buat PDF Jernih ({files.length} Halaman)</span>
        </button>
      </div>
    </div>
  );
};
