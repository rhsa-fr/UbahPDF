import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Heart, ArrowRight } from 'lucide-react';
import { TdocLogo } from './TdocLogo';
import { TOOLS } from '../data/toolsData';
import { BLOG_POSTS } from '../data/blogData';
import { ROUTES } from '../config/routes';

const popularTools = TOOLS.filter((t) => t.popular).slice(0, 4);
const moreTools = TOOLS.filter((t) => !t.popular).slice(0, 4);
const guides = BLOG_POSTS.slice(0, 4);

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-200 bg-gradient-to-b from-white to-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-6">
        {/* Top Section — Brand + Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-6 pb-8 border-b border-zinc-100">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1 space-y-3">
            <Link to={ROUTES.HOME} className="flex items-center gap-2 group">
              <TdocLogo size={22} />
              <span className="font-bold text-base tracking-tight text-zinc-900">
                Ubah<span className="text-indigo-600">PDF</span>
              </span>
            </Link>
            <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed max-w-xs">
              Pengolahan PDF cepat, gratis, dan privat. Diproses 100% di browser, tanpa upload ke server manapun.
            </p>
            {/* Trust Badges — compact row */}
            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-medium">
                <ShieldCheck className="w-3 h-3" />
                Privat
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/80 text-[10px] font-medium">
                <Zap className="w-3 h-3" />
                Instan
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200/80 text-[10px] font-medium">
                <Heart className="w-3 h-3" />
                Gratis
              </span>
            </div>
          </div>

          {/* Tool Populer */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold text-zinc-900 uppercase tracking-wider">Tool Populer</h4>
            <ul className="space-y-1.5">
              {popularTools.map((t) => (
                <li key={t.id}>
                  <Link to={ROUTES.TOOL(t.id)} className="text-xs text-zinc-500 hover:text-indigo-600 transition-colors">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tool Lainnya */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold text-zinc-900 uppercase tracking-wider">Tool Lainnya</h4>
            <ul className="space-y-1.5">
              {moreTools.map((t) => (
                <li key={t.id}>
                  <Link to={ROUTES.TOOL(t.id)} className="text-xs text-zinc-500 hover:text-indigo-600 transition-colors">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Panduan */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold text-zinc-900 uppercase tracking-wider">Panduan</h4>
            <ul className="space-y-1.5">
              {guides.map((g) => (
                <li key={g.slug}>
                  <Link to={ROUTES.BLOG_POST(g.slug)} className="text-xs text-zinc-500 hover:text-indigo-600 transition-colors truncate block">
                    {g.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link to={ROUTES.BLOG_LIST} className="text-xs text-indigo-600 font-medium hover:text-indigo-700 transition-colors inline-flex items-center gap-1 mt-0.5">
                  Semua Panduan
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-400">
          <p>© {new Date().getFullYear()} UbahPDF Indonesia. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              Aktif & Aman
            </span>
            <span className="text-zinc-200">·</span>
            <span className="text-zinc-500 font-medium">Buatan Indonesia 🇮🇩</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
