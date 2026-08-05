import React from 'react';
import { FileText, Shield, Zap, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white pt-12 pb-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-slate-100">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                <FileText className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-slate-900 font-['Outfit']">UbahPDF</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed max-w-sm">
              Platform konversi dokumen PDF gratis serbaguna dengan teknologi pemrosesan client-side WebAssembly untuk privasi maksimal file Anda.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm font-['Outfit']">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Privasi Terjamin</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Semua file dikonversi secara lokal di dalam browser Anda. Kami tidak menyimpan, mengunggah, atau membagikan dokumen Anda ke server mana pun.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm font-['Outfit']">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Kecepatan Tinggi</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Nikmati kecepatan manipulasi dan ekstraksi PDF tanpa harus menunggu antrean upload atau kuota harian.
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <p>© {new Date().getFullYear()} UbahPDF. Dibuat dengan presisi tinggi.</p>
          <div className="flex items-center gap-1">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>untuk pengolahan dokumen cepat</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
