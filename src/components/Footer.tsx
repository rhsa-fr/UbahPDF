import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import { TdocLogo } from './TdocLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-200 bg-white pt-10 pb-8 text-xs text-zinc-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Columns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pb-8 border-b border-zinc-100">
          {/* Col 1: Brand Info */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <TdocLogo size={24} />
              <span className="font-bold text-base tracking-tight text-zinc-900">
                Ubah<span className="text-indigo-600">PDF</span>
              </span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              Solusi pengolahan PDF cepat, gratis, dan serbaguna di Indonesia. Diproses 100% secara lokal di browser.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Private (Browser-Only)</span>
            </div>
          </div>

          {/* Col 2: Tool Populer */}
          <div className="space-y-3">
            <h4 className="text-zinc-900 font-semibold text-xs">Tool Populer</h4>
            <ul className="space-y-1.5 text-xs text-zinc-500">
              <li>
                <Link to="/merge-pdf" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-zinc-300" />
                  <span>Merge PDF</span>
                </Link>
              </li>
              <li>
                <Link to="/compress-pdf" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-zinc-300" />
                  <span>Compress PDF</span>
                </Link>
              </li>
              <li>
                <Link to="/image-to-pdf" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-zinc-300" />
                  <span>JPG/PNG to PDF</span>
                </Link>
              </li>
              <li>
                <Link to="/pdf-to-word" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-zinc-300" />
                  <span>PDF to Word</span>
                </Link>
              </li>
              <li>
                <Link to="/split-pdf" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-zinc-300" />
                  <span>Split PDF</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Panduan & Tips */}
          <div className="space-y-3">
            <h4 className="text-zinc-900 font-semibold text-xs">Panduan & Tips</h4>
            <ul className="space-y-1.5 text-xs text-zinc-500">
              <li>
                <Link to="/panduan/cara-kompres-pdf-200kb-cpns-bumn" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-zinc-300" />
                  <span className="truncate">Kompres PDF CPNS 200KB</span>
                </Link>
              </li>
              <li>
                <Link to="/panduan/cara-gabung-ijazah-transkrip-pdf" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-zinc-300" />
                  <span className="truncate">Gabung Ijazah & Transkrip</span>
                </Link>
              </li>
              <li>
                <Link to="/panduan/cara-ubah-foto-ktp-ke-pdf" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-zinc-300" />
                  <span className="truncate">Ubah Foto KTP ke PDF</span>
                </Link>
              </li>
              <li>
                <Link to="/panduan/cara-konversi-pdf-ke-word-gratis" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-zinc-300" />
                  <span className="truncate">Konversi PDF ke Word</span>
                </Link>
              </li>
              <li>
                <Link to="/panduan" className="text-indigo-600 font-medium hover:underline inline-flex items-center gap-1 pt-0.5">
                  <span>Lihat Semua Panduan →</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Keunggulan */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <h4 className="text-zinc-900 font-semibold text-xs">Keunggulan</h4>
            <div className="space-y-2 text-xs text-zinc-500 leading-relaxed">
              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                <span className="font-medium text-zinc-800 block mb-0.5">Tanpa Registrasi</span>
                Gunakan seluruh fitur gratis tanpa perlu membuat akun.
              </div>
              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                <span className="font-medium text-zinc-800 block mb-0.5">Bebas Watermark</span>
                Hasil konversi bersih tanpa cap atau watermark.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-zinc-400 text-[11px] text-center sm:text-left">
          <p>© {new Date().getFullYear()} UbahPDF Indonesia. Hak Cipta Dilindungi.</p>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[10px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              <span>Aktif & Aman</span>
            </div>
            <span className="text-zinc-200">|</span>
            <span className="text-zinc-500 font-medium">Buatan Indonesia 🇮🇩</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
