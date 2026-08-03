import React, { useRef, useState } from 'react';
import { UploadCloud, File, Trash2, Plus, AlertCircle } from 'lucide-react';
import { formatBytes } from '../services/fileUtils';
import type { UploadedFile, Tool } from '../types';

interface FileDropzoneProps {
  tool: Tool;
  files: UploadedFile[];
  onFilesAdded: (newFiles: File[]) => void;
  onRemoveFile: (fileId: string) => void;
  onClearAll: () => void;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  tool,
  files,
  onFilesAdded,
  onRemoveFile,
  onClearAll,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setErrorMsg(null);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (!tool.multiple && droppedFiles.length > 1) {
        setErrorMsg('Tool ini hanya mendukung 1 file pada satu waktu.');
        onFilesAdded([droppedFiles[0]]);
      } else {
        onFilesAdded(droppedFiles);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      onFilesAdded(selected);
    }
  };

  return (
    <div className="w-full">
      {/* Drop Zone Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 select-none ${
          isDragging
            ? 'border-rose-500 bg-rose-500/10 scale-[1.01]'
            : 'border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900/90'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={tool.accept}
          multiple={tool.multiple}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center mx-auto mb-4 border border-slate-700/50 shadow-inner">
          <UploadCloud className="w-8 h-8 text-rose-400 animate-bounce" />
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white mb-1 font-['Outfit']">
          Tarik & Lepas File di Sini
        </h3>

        <p className="text-xs text-slate-400 mb-4">
          atau <span className="text-rose-400 font-semibold underline">pilih file dari perangkat</span> ({tool.accept})
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-lg shadow-rose-500/25 transition-all">
          <Plus className="w-4 h-4" />
          <span>Pilih File</span>
        </div>
      </div>

      {/* Error notification if any */}
      {errorMsg && (
        <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Selected File List */}
      {files.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              File Terpilih ({files.length})
            </h4>
            <button
              onClick={onClearAll}
              className="text-xs font-medium text-rose-400 hover:text-rose-300 transition-colors"
            >
              Hapus Semua
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {files.map((fileObj) => (
              <div
                key={fileObj.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                    <File className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="truncate">
                    <p className="font-semibold text-white truncate max-w-xs sm:max-w-md">
                      {fileObj.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {formatBytes(fileObj.size)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile(fileObj.id);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Hapus file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
