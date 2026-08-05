import React from 'react';
import { Settings } from 'lucide-react';
import { SignatureCanvas } from './SignatureCanvas';
import type { Tool, ConversionOptions, UploadedFile } from '../types';

interface ToolOptionsPanelProps {
  tool: Tool;
  files: UploadedFile[];
  options: ConversionOptions;
  setOptions: React.Dispatch<React.SetStateAction<ConversionOptions>>;
  onGoToSignStepPlace: () => void;
}

export const ToolOptionsPanel: React.FC<ToolOptionsPanelProps> = ({
  tool,
  files,
  options,
  setOptions,
  onGoToSignStepPlace,
}) => {
  if (files.length === 0) return null;

  return (
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
                onClick={() => setOptions({ ...options, compressLevel: lvl.id as any })}
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
                  <p className="text-[11px] text-slate-500 leading-relaxed mb-2">{lvl.desc}</p>
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
            <label className="block text-slate-600 mb-1 font-medium">Format Penomoran</label>
            <select
              value={options.pageNumberFormat}
              onChange={(e: any) => setOptions({ ...options, pageNumberFormat: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-rose-500"
            >
              <option value="arabic">Angka Arab (1, 2, 3...)</option>
              <option value="roman-lower">Romawi Kecil (i, ii, iii...)</option>
              <option value="roman-upper">Romawi Besar (I, II, III...)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 mb-1 font-medium font-semibold">Gaya Teks</label>
            <select
              value={options.pageNumberStyle}
              onChange={(e: any) => setOptions({ ...options, pageNumberStyle: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-rose-500 font-medium"
            >
              <option value="number-only">Angka saja (misal: 1)</option>
              <option value="page-x">Halaman X (misal: Halaman 1)</option>
              <option value="page-x-of-y">Halaman X dari Y (misal: Halaman 1 dari 10)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 mb-1 font-medium font-semibold">Posisi Letak Nomor</label>
            <select
              value={options.pageNumberPosition}
              onChange={(e: any) => setOptions({ ...options, pageNumberPosition: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-rose-500 font-medium"
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
              onChange={(e) => setOptions({ ...options, pageNumberSkipCover: e.target.checked })}
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
            <label className="block text-slate-600 mb-1 font-medium">Format Gambar Output</label>
            <select
              value={options.imageFormat}
              onChange={(e: any) => setOptions({ ...options, imageFormat: e.target.value })}
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
            <label className="block text-slate-600 mb-1 font-medium">Ukuran Halaman</label>
            <select
              value={options.pageSize}
              onChange={(e: any) => setOptions({ ...options, pageSize: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-rose-500"
            >
              <option value="a4">Standar A4</option>
              <option value="letter">Letter</option>
              <option value="fit">Sesuai Ukuran Gambar</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-600 mb-1 font-medium">Orientasi</label>
            <select
              value={options.orientation}
              onChange={(e: any) => setOptions({ ...options, orientation: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-rose-500"
            >
              <option value="portrait">Tegak (Portrait)</option>
              <option value="landscape">Mendatar (Landscape)</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-600 mb-1 font-medium">Margin Pinggir</label>
            <select
              value={options.margin}
              onChange={(e: any) => setOptions({ ...options, margin: e.target.value })}
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
                <label className="block text-slate-600 mb-1 font-medium">Teks Watermark</label>
                <input
                  type="text"
                  value={options.watermarkText}
                  onChange={(e) => setOptions({ ...options, watermarkText: e.target.value })}
                  placeholder="misal: RAHASIA / DRAFT"
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Ukuran Font ({options.watermarkFontSize}px)</label>
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
              <label className="block text-slate-600 font-medium">Upload File Logo Watermark (PNG/JPG)</label>
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

          {options.signatureDataUrl && (
            <button
              type="button"
              onClick={onGoToSignStepPlace}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
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
  );
};
