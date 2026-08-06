import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ShieldCheck, BookOpen } from 'lucide-react';
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
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleLogoClick = () => {
    onReset();
    navigate('/');
  };

  const categories = [
    { id: 'all', label: 'Semua Tool' },
    { id: 'pdf', label: 'PDF' },
    { id: 'image', label: 'Gambar' },
    { id: 'office', label: 'Office' },
    { id: 'security', label: 'Keamanan' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={handleLogoClick}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none"
        >
          <div className="flex items-center justify-center p-0.5 sm:p-1">
            <TdocLogo size={32} />
          </div>
          <div className="flex items-center gap-0.5 select-none">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 font-['Outfit']">
              Ubah
            </span>
            <span className="font-black text-lg sm:text-xl tracking-tight bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent font-['Outfit']">
              PDF
            </span>
          </div>
        </div>

        {/* Desktop Category Navigation Pills */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                navigate('/');
              }}
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

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Link
            to="/panduan"
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold transition-all shadow-2xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-[11px] sm:text-xs">Panduan & Tips</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">100% Private (Browser-Only)</span>
          </div>
        </div>
      </div>

      {/* Mobile Horizontal Category Bar (Only shown on Homepage) */}
      {isHomePage && (
        <nav className="flex md:hidden items-center gap-1.5 px-4 py-2 border-t border-slate-200/60 overflow-x-auto scrollbar-none bg-slate-50/70 animate-fadeIn">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                navigate('/');
              }}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap shrink-0 transition-all ${
                selectedCategory === cat.id
                  ? 'bg-rose-500 text-white shadow-xs font-bold'
                  : 'bg-white text-slate-600 border border-slate-200/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
};
