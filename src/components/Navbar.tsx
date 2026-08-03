import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { TdocLogo } from './TdocLogo';

interface NavbarProps {
  onSelectCategory: (cat: string) => void;
  selectedCategory: string;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectCategory,
  selectedCategory,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="flex items-center justify-center p-1">
            <TdocLogo size={38} />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent font-['Outfit']">
              Tdoc
            </span>
            <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Pro
            </span>
          </div>
        </div>

        {/* Category Navigation Pills */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
          {[
            { id: 'all', label: 'Semua Tool' },
            { id: 'pdf', label: 'PDF' },
            { id: 'image', label: 'Gambar' },
            { id: 'office', label: 'Office' },
            { id: 'security', label: 'Keamanan' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </nav>

        {/* Client-Side Privacy Badge */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/50 px-3 py-1.5 rounded-full border border-emerald-500/20 shadow-inner">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-medium">100% Private (Browser-Only)</span>
          </div>
        </div>
      </div>
    </header>
  );
};
