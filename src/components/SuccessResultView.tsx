import React, { useState, useEffect } from 'react';
import { CheckCircle2, Download, RefreshCw, Pencil } from 'lucide-react';
import { formatBytes, splitFilename } from '../services/fileUtils';

interface SuccessResultViewProps {
  resultData: {
    data: Blob | Uint8Array | { dataUrl: string; name: string }[];
    filename: string;
    type: 'single' | 'images' | 'text';
    meta?: { originalSize: number; compressedSize: number };
  } | null;
  onDownload: () => void;
  onClearAll: () => void;
  onRename?: (newName: string) => void;
}

export const SuccessResultView: React.FC<SuccessResultViewProps> = ({
  resultData,
  onDownload,
  onClearAll,
  onRename,
}) => {
  const currentFilename = resultData?.filename || '';
  const { base: initialBase, ext: extension } = splitFilename(currentFilename);

  const [baseName, setBaseName] = useState(initialBase);

  useEffect(() => {
    const { base } = splitFilename(resultData?.filename || '');
    setBaseName(base);
  }, [resultData?.filename]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBase = e.target.value;
    setBaseName(newBase);
    if (onRename) {
      const { ext } = splitFilename(resultData?.filename || '');
      onRename(`${newBase}${ext}`);
    }
  };

  return (
    <div className="py-8 px-4 text-center flex flex-col items-center justify-center space-y-5 animate-fadeIn">
      <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
        <CheckCircle2 className="w-7 h-7" />
      </div>

      <div className="space-y-3 max-w-md mx-auto w-full">
        <h3 className="text-xl font-bold text-zinc-900">
          Dokumen Berhasil Diproses
        </h3>

        {/* Rename File Input Box */}
        {resultData?.filename && (
          <div className="w-full max-w-sm mx-auto text-left space-y-1.5">
            <label className="text-[11px] font-semibold text-zinc-600 flex items-center gap-1.5">
              <Pencil className="w-3.5 h-3.5 text-zinc-400" />
              <span>Nama File Hasil:</span>
            </label>
            <div className="flex items-center rounded-lg border border-zinc-200 bg-white overflow-hidden shadow-xs focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-400 transition-all">
              <input
                type="text"
                value={baseName}
                onChange={handleNameChange}
                placeholder="Ketik nama file baru..."
                className="flex-1 min-w-0 px-3 py-2 text-xs font-mono text-zinc-800 bg-transparent focus:outline-none"
              />
              <span className="px-2.5 py-2 text-xs font-mono font-semibold text-zinc-500 bg-zinc-100/90 border-l border-zinc-200 select-none shrink-0">
                {extension}
              </span>
            </div>
            <p className="text-[10px] text-zinc-400">
              Anda dapat mengubah nama file di atas sebelum mengunduh.
            </p>
          </div>
        )}

        {resultData?.meta && (
          <div className="mt-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-lg inline-block">
            Ukuran berkurang{' '}
<span className="font-bold tabular">
              {resultData.meta.originalSize > 0
                ? Math.max(
                    0,
                    Math.round(
                      ((resultData.meta.originalSize - resultData.meta.compressedSize) /
                        resultData.meta.originalSize) *
                        100
                    )
                  )
                : 0}
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
          type="button"
          onClick={onDownload}
          className="w-full sm:w-auto px-6 py-2.5 rounded-lg btn-primary text-xs flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Unduh Hasil</span>
        </button>

        <button
          type="button"
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
