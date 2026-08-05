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
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="flex items-center justify-center p-1">
            <TdocLogo size={36} />
          </div>
          <div className="flex items-center gap-0.5 select-none">
            <span className="font-extrabold text-xl tracking-tight text-slate-900 font-['Outfit']">
              Ubah
            </span>
            <span className="font-black text-xl tracking-tight bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent font-['Outfit']">
              PDF
            </span>
          </div>
        </div>

        {/* Category Navigation Pills */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
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
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </nav>

        {/* Client-Side Privacy Badge */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">100% Private (Browser-Only)</span>
          </div>
        </div>
      </div>
    </header>
  );
};
