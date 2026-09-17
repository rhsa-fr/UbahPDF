import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blogData';
import { Search, Clock, Calendar, ArrowRight } from 'lucide-react';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { BASE_URL, ROUTES } from '../config/routes';

const BLOG_CATEGORIES = ['Semua', ...Array.from(new Set(BLOG_POSTS.map((p) => p.category)))];

export const BlogListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  useSeoMeta({
    title: 'Panduan & Tips Seputar Dokumen PDF - UbahPDF',
    description: 'Kumpulan panduan, tips, dan tutorial lengkap seputar pengolahan dokumen PDF untuk CPNS, BUMN, perkuliahan, dan dunia kerja.',
    canonicalUrl: `${BASE_URL}${ROUTES.GUIDES}`,
  });

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCategory = selectedCategory === 'Semua' || post.category === selectedCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 mb-2 leading-tight">
          Panduan & Tips Pengolahan Dokumen PDF
        </h1>
        <p className="text-zinc-500 text-xs sm:text-base leading-relaxed">
          Temukan solusi praktis seputar kompresi dokumen CPNS/BUMN, penggabungan ijazah, serta tips efisiensi dokumen kerja.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none pb-1 bg-zinc-100/90 p-1 rounded-lg border border-zinc-200/80 w-full md:w-auto">
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md text-[11px] sm:text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Cari panduan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
          />
        </div>
      </div>

      {/* Articles Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 text-zinc-500 text-sm">
          Tidak ada panduan yang cocok dengan kata kunci pencarian Anda.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {filteredPosts.map((post) => (
            <Link
              key={post.id}
              to={ROUTES.GUIDE_DETAIL(post.slug)}
              className="precision-card rounded-xl p-5 sm:p-6 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-2.5">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 font-medium text-[10px] border border-indigo-200/60">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>

                <h2 className="text-sm sm:text-lg font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors mb-2 leading-snug">
                  {post.title}
                </h2>

                <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1 text-[11px]">
                  <Calendar className="w-3.5 h-3.5" />
                  {post.publishedDate}
                </span>
                <span className="flex items-center gap-1 text-indigo-600 font-medium text-xs group-hover:text-indigo-700">
                  Baca Selengkapnya
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
