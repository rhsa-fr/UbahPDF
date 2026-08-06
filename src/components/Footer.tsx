import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, BookOpen, Wrench, ChevronRight } from 'lucide-react';
import { TdocLogo } from './TdocLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white pt-10 sm:pt-14 pb-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Professional Columns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pb-8 sm:pb-12 border-b border-slate-100">
          {/* Col 1: Brand Info & Mission */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 font-['Outfit']">
                Ubah
              </span>
              <TdocLogo size={34} />
              <span className="font-black text-xl tracking-tight text-slate-900 font-['Outfit']">
                PDF
              </span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed max-w-sm">
              Solusi pengolahan PDF cepat, gratis, dan serbaguna di Indonesia. Diproses 100% secara lokal di browser Anda tanpa pernah mengunggah berkas ke server luar.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Private (Browser-Only)</span>
            </div>
          </div>

          {/* Col 2: Tool Populer */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm font-['Outfit']">
              <Wrench className="w-4 h-4 text-rose-500" />
              <span>Tool Populer</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/merge-pdf" className="hover:text-rose-600 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-slate-300" />
                  <span>Merge PDF</span>
                </Link>
              </li>
              <li>
                <Link to="/compress-pdf" className="hover:text-rose-600 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-slate-300" />
                  <span>Compress PDF</span>
                </Link>
              </li>
              <li>
                <Link to="/image-to-pdf" className="hover:text-rose-600 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-slate-300" />
                  <span>JPG/PNG to PDF</span>
                </Link>
              </li>
              <li>
                <Link to="/pdf-to-word" className="hover:text-rose-600 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-slate-300" />
                  <span>PDF to Word</span>
                </Link>
              </li>
              <li>
                <Link to="/split-pdf" className="hover:text-rose-600 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-slate-300" />
                  <span>Split PDF</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Panduan & Tips */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm font-['Outfit']">
              <BookOpen className="w-4 h-4 text-rose-500" />
              <span>Panduan & Tips</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/panduan/cara-kompres-pdf-200kb-cpns-bumn" className="hover:text-rose-600 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-slate-300" />
                  <span className="truncate">Kompres PDF CPNS 200KB</span>
                </Link>
              </li>
              <li>
                <Link to="/panduan/cara-gabung-ijazah-transkrip-pdf" className="hover:text-rose-600 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-slate-300" />
                  <span className="truncate">Gabung Ijazah & Transkrip</span>
                </Link>
              </li>
              <li>
                <Link to="/panduan/cara-ubah-foto-ktp-ke-pdf" className="hover:text-rose-600 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-slate-300" />
                  <span className="truncate">Ubah Foto KTP ke PDF</span>
                </Link>
              </li>
              <li>
                <Link to="/panduan/cara-konversi-pdf-ke-word-gratis" className="hover:text-rose-600 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-slate-300" />
                  <span className="truncate">Konversi PDF ke Word</span>
                </Link>
              </li>
              <li>
                <Link to="/panduan" className="text-rose-600 font-bold hover:underline inline-flex items-center gap-1 pt-0.5">
                  <span>Lihat Semua Panduan &rarr;</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Keunggulan & Layanan */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm font-['Outfit']">
              <Zap className="w-4 h-4 text-rose-500" />
              <span>Keunggulan Layanan</span>
            </div>
            <div className="space-y-2 text-xs text-slate-500 leading-relaxed">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="font-bold text-slate-800 block mb-0.5">⚡ Tanpa Registrasi</span>
                Gunakan seluruh fitur secara gratis tanpa perlu membuat akun atau memasukkan email.
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="font-bold text-slate-800 block mb-0.5">🔒 Bebas Watermark</span>
                Hasil konversi dokumen bersih tanpa cap atau watermark tambahan.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Professional Copyright & Status Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px] text-center sm:text-left">
          <p>© {new Date().getFullYear()} UbahPDF Indonesia. Hak Cipta Dilindungi.</p>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-full border border-emerald-200/80 text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span>Sistem Aktif & Aman</span>
            </div>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600 font-medium">Buatan Indonesia 🇮🇩</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
