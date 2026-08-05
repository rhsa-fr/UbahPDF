import React from 'react';
import { CheckCircle2, Download, RefreshCw } from 'lucide-react';
import { formatBytes } from '../services/fileUtils';

interface SuccessResultViewProps {
  resultData: {
    data: Blob | Uint8Array | { dataUrl: string; name: string }[];
    filename: string;
    type: 'single' | 'images' | 'text';
    meta?: { originalSize: number; compressedSize: number };
  } | null;
  onDownload: () => void;
  onClearAll: () => void;
}

export const SuccessResultView: React.FC<SuccessResultViewProps> = ({
  resultData,
  onDownload,
  onClearAll,
}) => {
  return (
    <div className="py-10 px-4 text-center flex flex-col items-center justify-center space-y-6 animate-fadeIn">
      <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-lg shadow-emerald-500/10">
        <CheckCircle2 className="w-10 h-10 animate-bounce" />
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
          onClick={onDownload}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Download className="w-5 h-5" />
          <span>Unduh File PDF</span>
        </button>

        <button
          onClick={onClearAll}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-slate-200"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Konversi File Lain</span>
        </button>
      </div>
    </div>
  );
};
