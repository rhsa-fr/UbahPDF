import React from 'react';
import { Search, ShieldCheck, Zap, RefreshCw } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <section className="relative pt-6 pb-4 sm:pt-16 sm:pb-10 text-center">
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
        {/* Headline — compact on mobile, expressive on desktop */}
        <h1 className="text-xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 leading-snug sm:leading-[1.12] mb-1.5 sm:mb-4">
          Konversi & Kelola{' '}
          <br className="hidden sm:block" />
          Dokumen PDF{' '}
          <span className="text-indigo-600">Tanpa Batas</span>
        </h1>

        <p className="text-xs sm:text-base text-zinc-500 max-w-xl mx-auto mb-4 sm:mb-8 leading-relaxed">
          Gabungkan, kompres, ubah format, atau edit dokumen PDF secara instan.
          <span className="hidden sm:inline"> File diproses 100% di browser — tidak pernah diunggah ke server.</span>
        </p>

        {/* Search Bar — slim on mobile */}
        <div className="relative max-w-lg mx-auto mb-4 sm:mb-8">
          <div className="relative flex items-center">
            <Search className="absolute left-3 sm:left-3.5 w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari tool PDF..."
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-xs sm:text-sm shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 sm:right-3 px-2 py-0.5 rounded-md bg-zinc-100 text-[10px] font-medium text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Feature Status Pills — hidden on mobile, visible on sm+ */}
        <div className="hidden sm:flex flex-wrap justify-center items-center gap-3 text-xs text-zinc-600 font-medium">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Browser-Side</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 shadow-xs">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Proses Instan</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 shadow-xs">
            <RefreshCw className="w-3.5 h-3.5 text-indigo-500" />
            <span>Tanpa Registrasi</span>
          </div>
        </div>
      </div>
    </section>
  );
};
