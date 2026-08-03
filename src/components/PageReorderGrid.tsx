import React from 'react';
import { RotateCw, CheckCircle2, Circle, ArrowLeft, ArrowRight } from 'lucide-react';
import type { PdfPageThumbnail } from '../types';

interface PageReorderGridProps {
  thumbnails: PdfPageThumbnail[];
  onTogglePageSelect: (pageNumber: number) => void;
  onRotatePage?: (pageNumber: number) => void;
  onMovePage?: (fromIdx: number, toIdx: number) => void;
  mode?: 'split' | 'rotate' | 'reorder';
}

export const PageReorderGrid: React.FC<PageReorderGridProps> = ({
  thumbnails,
  onTogglePageSelect,
  onRotatePage,
  onMovePage,
  mode = 'reorder',
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Pratinjau Halaman ({thumbnails.length} Halaman)
        </h4>
        <span className="text-xs text-slate-400">
          {mode === 'split' && 'Klik halaman untuk memilih/membatalkan halaman yang akan diekstrak'}
          {mode === 'rotate' && 'Klik ikon putar untuk mengubah orientasi halaman'}
          {mode === 'reorder' && 'Gunakan panah untuk menggeser posisi halaman'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[420px] overflow-y-auto p-2 bg-slate-950/60 rounded-2xl border border-slate-800">
        {thumbnails.map((thumb, idx) => (
          <div
            key={thumb.pageNumber}
            onClick={() => mode === 'split' && onTogglePageSelect(thumb.pageNumber)}
            className={`relative group rounded-xl overflow-hidden border transition-all select-none ${
              thumb.selected
                ? 'border-rose-500 bg-rose-500/10 shadow-lg shadow-rose-500/10'
                : 'border-slate-800 bg-slate-900/50 opacity-60'
            }`}
          >
            {/* Page Thumbnail Image */}
            <div className="relative aspect-[3/4] p-2 flex items-center justify-center bg-slate-900">
              <img
                src={thumb.dataUrl}
                alt={`Halaman ${thumb.pageNumber}`}
                className="max-h-full max-w-full object-contain rounded shadow transition-transform duration-300"
                style={{ transform: `rotate(${thumb.rotation}deg)` }}
              />

              {/* Selection Checkmark Badge */}
              {mode === 'split' && (
                <div className="absolute top-2 right-2 z-10">
                  {thumb.selected ? (
                    <CheckCircle2 className="w-5 h-5 text-rose-500 fill-rose-500/20" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500" />
                  )}
                </div>
              )}
            </div>

            {/* Bottom Bar / Actions */}
            <div className="p-2 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">
                Hal. {thumb.pageNumber}
              </span>

              <div className="flex items-center gap-1">
                {/* Rotate Action */}
                {onRotatePage && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRotatePage(thumb.pageNumber);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Putar 90°"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Move Left / Right Action */}
                {onMovePage && idx > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMovePage(idx, idx - 1);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Geser ke Kiri"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                )}

                {onMovePage && idx < thumbnails.length - 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMovePage(idx, idx + 1);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Geser ke Kanan"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
