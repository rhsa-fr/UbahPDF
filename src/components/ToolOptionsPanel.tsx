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

// Only show panel for tools that actually have configurable options
const TOOLS_WITH_OPTIONS = new Set([
  'compress-pdf',
  'page-numbers',
  'pdf-to-image',
  'image-to-pdf',
  'watermark-pdf',
  'split-pdf',
  'sign-pdf',
  'delete-pages',
  'protect-pdf',
  'unlock-pdf',
  'resize-pdf',
  'pdf-to-word',
]);

export const ToolOptionsPanel: React.FC<ToolOptionsPanelProps> = ({
  tool,
  files,
  options,
  setOptions,
  onGoToSignStepPlace,
}) => {
  if (files.length === 0) return null;
  if (!TOOLS_WITH_OPTIONS.has(tool.id)) return null;

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
                onClick={() => setOptions((prev) => ({ ...prev, compressLevel: lvl.id as ConversionOptions['compressLevel'] }))}
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
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setOptions((prev) => ({ ...prev, pageNumberFormat: e.target.value as ConversionOptions['pageNumberFormat'] }))
              }
              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-rose-500"
            >
              <option value="arabic">Angka Arab (1, 2, 3...)</option>
              <option value="roman-lower">Romawi Kecil (i, ii, iii...)</option>
              <option value="roman-upper">Romawi Besar (I, II, III...)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Gaya Teks</label>
            <select
              value={options.pageNumberStyle}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setOptions((prev) => ({ ...prev, pageNumberStyle: e.target.value as ConversionOptions['pageNumberStyle'] }))
              }
              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-rose-500 font-medium"
            >
              <option value="number-only">Angka saja (misal: 1)</option>
              <option value="page-x">Halaman X (misal: Halaman 1)</option>
              <option value="page-x-of-y">Halaman X dari Y (misal: Halaman 1 dari 10)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Posisi Letak Nomor</label>
            <select
              value={options.pageNumberPosition}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setOptions((prev) => ({ ...prev, pageNumberPosition: e.target.value as ConversionOptions['pageNumberPosition'] }))
              }
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
              onChange={(e) => setOptions((prev) => ({ ...prev, pageNumberSkipCover: e.target.checked }))}
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
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setOptions((prev) => ({ ...prev, imageFormat: e.target.value as ConversionOptions['imageFormat'] }))
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
            <label className="block text-slate-600 mb-1 font-medium">Ukuran Halaman</label>
            <select
              value={options.pageSize}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setOptions((prev) => ({ ...prev, pageSize: e.target.value as ConversionOptions['pageSize'] }))
              }
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
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setOptions((prev) => ({ ...prev, orientation: e.target.value as ConversionOptions['orientation'] }))
              }
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
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setOptions((prev) => ({ ...prev, margin: e.target.value as ConversionOptions['margin'] }))
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
                onChange={() => setOptions((prev) => ({ ...prev, watermarkType: 'text' }))}
                className="text-rose-500 focus:ring-rose-500"
              />
              <span>Watermark Teks</span>
            </label>
            <label className="flex items-center gap-2 text-slate-600 font-medium cursor-pointer">
              <input
                type="radio"
                name="wmType"
                checked={options.watermarkType === 'image'}
                onChange={() => setOptions((prev) => ({ ...prev, watermarkType: 'image' }))}
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setOptions((prev) => ({ ...prev, watermarkText: e.target.value }))
                  }
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setOptions((prev) => ({ ...prev, watermarkFontSize: parseInt(e.target.value, 10) }))
                  }
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    setOptions((prev) => ({ ...prev, watermarkImageFile: file }));
                  }
                  e.target.value = '';
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setOptions((prev) => ({ ...prev, splitRange: e.target.value }))
            }
            placeholder="Kosongkan untuk menggunakan hasil klik pratinjau di atas"
            className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-rose-500"
          />
        </div>
      )}

      {tool.id === 'sign-pdf' && (
        <div className="space-y-4 text-xs">
          <SignatureCanvas
            onSaveSignature={(dataUrl) =>
              setOptions((prev) => ({ ...prev, signatureDataUrl: dataUrl }))
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
          <label className="block text-zinc-700 font-semibold">
            Masukkan Kata Sandi (Password) Pengunci PDF
          </label>
          <input
            type="password"
            value={options.userPassword || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setOptions((prev) => ({ ...prev, userPassword: e.target.value }))
            }
            placeholder="Ketik password untuk mengunci file..."
            className="w-full p-3 rounded-lg bg-white border border-zinc-200 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 font-medium"
          />
          <p className="text-[11px] text-zinc-500">
            File PDF hasil unduhan akan meminta password ini setiap kali dibuka.
          </p>
        </div>
      )}

      {tool.id === 'unlock-pdf' && (
        <div className="space-y-3 text-xs">
          <label className="block text-zinc-700 font-semibold">
            Masukkan Kata Sandi PDF yang Terkunci
          </label>
          <input
            type="password"
            value={options.unlockPassword || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setOptions((prev) => ({ ...prev, unlockPassword: e.target.value }))
            }
            placeholder="Ketik password PDF yang ingin dibuka kuncinya..."
            className="w-full p-3 rounded-lg bg-white border border-zinc-200 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 font-medium"
          />
          <p className="text-[11px] text-zinc-500">
            Masukkan password yang diminta saat membuka PDF ini. Hasil download akan bebas password.
          </p>
        </div>
      )}

      {tool.id === 'resize-pdf' && (
        <div className="space-y-3 text-xs">
          <label className="block text-zinc-700 font-semibold">Ukuran Halaman Target</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'a4', label: 'A4', desc: '210 × 297 mm (Standar)' },
              { id: 'letter', label: 'Letter (US)', desc: '216 × 279 mm' },
              { id: 'legal', label: 'Legal', desc: '216 × 356 mm' },
              { id: 'f4', label: 'F4 / Folio', desc: '215 × 330 mm (Indonesia)' },
            ].map((size) => {
              const selected = (options.resizeTarget || 'a4') === size.id;
              return (
                <button
                  key={size.id}
                  type="button"
                  onClick={() =>
                    setOptions((prev) => ({ ...prev, resizeTarget: size.id as ConversionOptions['resizeTarget'] }))
                  }
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selected
                      ? 'border-indigo-400 bg-indigo-50 ring-2 ring-indigo-500/20'
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  <span className={`block font-semibold text-xs ${selected ? 'text-indigo-700' : 'text-zinc-900'}`}>
                    {size.label}
                  </span>
                  <span className="text-[10px] text-zinc-400 tabular">{size.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {tool.id === 'pdf-to-word' && (
        <div className="space-y-3 text-xs">
          <label className="block text-zinc-700 font-semibold">Format Output</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: 'editable',
                label: 'Word Dapat Diedit (.docx)',
                desc: 'Teks bisa diedit & gambar terpisah (Direkomendasikan)',
                badge: 'Populer',
              },
              {
                id: 'image',
                label: 'Salinan Visual (.docx)',
                desc: 'Tampilan visual persis PDF asli dalam dokumen Word',
                badge: 'Presisi',
              },
              {
                id: 'txt',
                label: 'Teks Murni (.txt)',
                desc: 'Hanya ekstrak teks tanpa format dokumen',
              },
            ].map((fmt) => {
              const selected = (options.pdfToWordFormat || 'editable') === fmt.id;
              return (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() =>
                    setOptions((prev) => ({ ...prev, pdfToWordFormat: fmt.id as ConversionOptions['pdfToWordFormat'] }))
                  }
                  className={`p-3 rounded-xl border text-left transition-all relative ${
                    selected
                      ? 'border-blue-500 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-sm'
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  {fmt.badge && (
                    <span className="absolute top-2 right-2 text-[9px] font-semibold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                      {fmt.badge}
                    </span>
                  )}
                  <span className={`block font-semibold text-xs ${selected ? 'text-blue-700' : 'text-zinc-900'}`}>
                    {fmt.label}
                  </span>
                  <span className="text-[11px] text-zinc-500 mt-1 block leading-tight">{fmt.desc}</span>
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 leading-relaxed mt-2">
            <span className="font-semibold">⚠ Catatan:</span> Hasil konversi mungkin tidak 100% identik dengan file PDF asli. Perbedaan kecil pada tata letak, font, spasi, dan posisi elemen bisa terjadi karena perbedaan mendasar antara format PDF (posisi tetap/cetak) dan Word (teks mengalir). Untuk tampilan yang persis sama, gunakan opsi <strong>"Salinan Visual"</strong>.
          </p>
        </div>
      )}
    </div>
  );
};
