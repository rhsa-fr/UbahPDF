import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, BookOpen } from 'lucide-react';
import { TdocLogo } from './TdocLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white pt-12 pb-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <TdocLogo size={32} />
              <div className="flex items-center gap-0.5 select-none">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 font-['Outfit']">
                  Ubah
                </span>
                <span className="font-black text-xl tracking-tight bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent font-['Outfit']">
                  PDF
                </span>
              </div>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed max-w-sm">
              Solusi pengolahan PDF cepat, gratis, dan serbaguna di Indonesia. Diproses 100% secara lokal di browser Anda tanpa pernah menyimpan file ke server luar.
            </p>
          </div>

          {/* Panduan Populer */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm font-['Outfit']">
              <BookOpen className="w-4 h-4 text-rose-500" />
              <span>Panduan PDF</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>
                <Link to="/panduan/cara-kompres-pdf-200kb-cpns-bumn" className="hover:text-rose-600 transition-colors">
                  Kompres PDF 200KB CPNS
                </Link>
              </li>
              <li>
                <Link to="/panduan/cara-gabung-ijazah-transkrip-pdf" className="hover:text-rose-600 transition-colors">
                  Gabung Ijazah & Transkrip
                </Link>
              </li>
              <li>
                <Link to="/panduan/cara-ubah-foto-ktp-ke-pdf" className="hover:text-rose-600 transition-colors">
                  Ubah Foto KTP ke PDF
                </Link>
              </li>
              <li>
                <Link to="/panduan/cara-konversi-pdf-ke-word-gratis" className="hover:text-rose-600 transition-colors">
                  Konversi PDF ke Word
                </Link>
              </li>
              <li>
                <Link to="/panduan" className="text-rose-600 font-bold hover:underline inline-block pt-1">
                  Lihat Semua Panduan &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Value Proposition 1 */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm font-['Outfit']">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Jaminan Privasi 100%</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Dokumen rahasia, ijazah, atau surat dinas Anda diproses langsung di memori perangkat Anda. Data Anda tidak pernah keluar dari browser.
            </p>
          </div>

          {/* Value Proposition 2 */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm font-['Outfit']">
              <Zap className="w-4 h-4 text-rose-500" />
              <span>Tanpa Batasan & Gratis</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Konversi PDF ke Word, kompresi file, hingga gabung PDF tanpa perlu berlangganan, tanpa daftar akun, dan tanpa antrean.
            </p>
          </div>
        </div>

        {/* Bottom Copyright & Links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div className="flex items-center gap-2">
            <p>© {new Date().getFullYear()} UbahPDF Indonesia. Hak Cipta Dilindungi.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span>Sistem Aktif & Aman</span>
            </div>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-medium">Buatan Indonesia 🇮🇩</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
