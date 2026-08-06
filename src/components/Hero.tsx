import React from 'react';
import { Search, Sparkles, Zap, Lock, RefreshCw } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-10 sm:pt-16 sm:pb-12 text-center">
      {/* Background glow graphics */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-rose-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-10 left-1/4 w-[300px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-[10px] sm:text-xs font-semibold mb-4 sm:mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span>Konverter Dokumen PDF Cepat, Gratis & Bebas Batasan</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 font-['Outfit'] leading-snug sm:leading-tight mb-3 sm:mb-4">
          Konversi & Kelola Dokumen PDF{' '}
          <span className="bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Tanpa Batas
          </span>
        </h1>

        <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed">
          Gabungkan PDF, kompres ukuran file, ubah JPG ke PDF, atau konversi dokumen Office secara instan. File Anda diproses 100% aman di dalam browser tanpa pernah diunggah ke server.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto mb-8">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari tool PDF... (misal: Merge PDF, JPG to PDF, Compress...)"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-sm shadow-md shadow-slate-200/50"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-4 text-xs font-semibold text-slate-400 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-full border border-slate-200/60 shadow-2xs">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Proses Instan</span>
          </div>
          <div className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-full border border-slate-200/60 shadow-2xs">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>100% Rahasia & Aman</span>
          </div>
          <div className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-full border border-slate-200/60 shadow-2xs">
            <RefreshCw className="w-4 h-4 text-blue-600" />
            <span>Tanpa Registrasi</span>
          </div>
        </div>
      </div>
    </section>
  );
};
