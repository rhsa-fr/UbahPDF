import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { BookOpen, ShieldCheck } from 'lucide-react';
import { TdocLogo } from './TdocLogo';
import { ROUTES } from '../config/routes';

interface NavbarProps {
  onSelectCategory: (cat: string) => void;
  selectedCategory: string;
  onReset: () => void;
}

const NAVBAR_CATEGORIES = [
  { id: 'all', label: 'Semua Tool' },
  { id: 'pdf', label: 'PDF' },
  { id: 'image', label: 'Gambar' },
  { id: 'office', label: 'Office' },
  { id: 'security', label: 'Keamanan' },
] as const;

export const Navbar: React.FC<NavbarProps> = ({
  onSelectCategory,
  selectedCategory,
  onReset,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === ROUTES.HOME;

  const handleLogoClick = () => {
    onReset();
    navigate(ROUTES.HOME);
  };

  const handleCategoryClick = (catId: string) => {
    onSelectCategory(catId);
    if (!isHomePage) {
      navigate(ROUTES.HOME);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full header-bar">
      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-12 sm:h-14 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={handleLogoClick}
            aria-label="UbahPDF Beranda"
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg text-left"
          >
            <TdocLogo size={24} />
            <span className="font-bold text-base sm:text-lg tracking-tight text-zinc-900 font-['Inter']">
              Ubah<span className="text-indigo-600">PDF</span>
            </span>
          </button>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% In-Browser · Privat</span>
          </div>
        </div>

        {/* Desktop Category Navigation Pills */}
        <nav
          aria-label="Navigasi kategori desktop"
          className="hidden md:flex items-center gap-0.5 bg-zinc-100/90 p-1 rounded-lg border border-zinc-200/80"
        >
          {NAVBAR_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleCategoryClick(cat.id)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action */}
        <div className="flex items-center gap-2">
          <Link
            to={ROUTES.GUIDES}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900 border border-zinc-200 text-xs font-medium transition-all shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
            <span className="hidden sm:inline">Panduan & Tips</span>
            <span className="sm:hidden text-[11px]">Panduan</span>
          </Link>
        </div>
      </div>

      {/* Mobile Category Scroll Pills (Only on Homepage) */}
      {isHomePage && (
        <nav
          aria-label="Navigasi kategori seluler"
          className="flex md:hidden items-center gap-1.5 px-3.5 py-1.5 border-t border-zinc-100 overflow-x-auto scrollbar-none bg-white/60"
        >
          {NAVBAR_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleCategoryClick(cat.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap shrink-0 transition-all ${
                  isSelected
                    ? 'bg-zinc-900 text-white shadow-xs font-semibold'
                    : 'bg-zinc-100/80 text-zinc-600 hover:bg-zinc-200/60 active:bg-zinc-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
};
