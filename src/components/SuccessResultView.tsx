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
    <div className="py-10 px-4 text-center flex flex-col items-center justify-center space-y-5 animate-fadeIn">
      <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
        <CheckCircle2 className="w-7 h-7" />
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <h3 className="text-xl font-bold text-zinc-900">
          Dokumen Berhasil Diproses
        </h3>
        {resultData?.filename && (
          <p className="text-xs text-zinc-600 font-mono bg-zinc-100 px-3 py-1.5 rounded-lg inline-block border border-zinc-200 truncate max-w-xs sm:max-w-md">
            {resultData.filename}
          </p>
        )}
        {resultData?.meta && (
          <div className="mt-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-lg inline-block">
            Ukuran berkurang{' '}
            <span className="font-bold tabular">
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
            (<span className="tabular">{formatBytes(resultData.meta.originalSize)}</span> →{' '}
            <span className="tabular font-semibold">{formatBytes(resultData.meta.compressedSize)}</span>)
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 w-full max-w-sm justify-center">
        <button
          onClick={onDownload}
          className="w-full sm:w-auto px-6 py-2.5 rounded-lg btn-primary text-xs flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Unduh Hasil</span>
        </button>

        <button
          onClick={onClearAll}
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg btn-ghost text-xs flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Konversi Lain</span>
        </button>
      </div>
    </div>
  );
};
