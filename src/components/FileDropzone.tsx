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
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center cursor-pointer transition-all duration-200 select-none ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
            : 'border-zinc-300 hover:border-indigo-400 bg-gradient-to-b from-white to-zinc-50/80 hover:from-indigo-50/30 hover:to-white'
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

        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-indigo-100 shadow-sm transition-transform duration-200 ${isDragging ? 'scale-110' : ''}`}>
          <UploadCloud className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
        </div>

        <h3 className="text-sm sm:text-base font-bold text-zinc-900 mb-0.5 sm:mb-1">
          <span className="sm:hidden">Ketuk untuk Memilih File</span>
          <span className="hidden sm:inline">Tarik & Lepas File di Sini</span>
        </h3>

        <p className="text-[11px] sm:text-xs text-zinc-500 mb-3 sm:mb-4">
          <span className="sm:hidden">Format: {tool.accept}</span>
          <span className="hidden sm:inline">atau <span className="text-indigo-600 font-semibold underline underline-offset-2">pilih dari perangkat</span> ({tool.accept})</span>
        </p>

        <div className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl btn-primary text-xs font-semibold shadow-sm">
          <Plus className="w-3.5 h-3.5" />
          <span>Pilih File</span>
        </div>
      </div>

      {/* Error notification */}
      {errorMsg && (
        <div className="mt-3 flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Selected File List */}
      {files.length > 0 && (
        <div className="mt-3 sm:mt-5">
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
              File Terpilih ({files.length})
            </h4>
            <button
              onClick={onClearAll}
              className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Hapus Semua
            </button>
          </div>

          <div className="space-y-1 sm:space-y-1.5 max-h-48 sm:max-h-60 overflow-y-auto pr-1">
            {files.map((fileObj) => (
              <div
                key={fileObj.id}
                className="flex items-center justify-between p-2 sm:p-2.5 rounded-lg bg-white border border-zinc-200 text-xs text-zinc-800 shadow-xs"
              >
                <div className="flex items-center gap-2 sm:gap-2.5 truncate">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-indigo-50 flex items-center justify-center shrink-0">
                    <File className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-600" />
                  </div>
                  <div className="truncate">
                    <p className="font-medium text-zinc-900 truncate max-w-[160px] sm:max-w-md">
                      {fileObj.name}
                    </p>
                    <p className="text-[11px] text-zinc-400 tabular">
                      {formatBytes(fileObj.size)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile(fileObj.id);
                  }}
                  className="p-1 rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Hapus file"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
