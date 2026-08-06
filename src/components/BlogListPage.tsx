import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blogData';
import { Search, Clock, Calendar, ArrowRight, Sparkles } from 'lucide-react';

export const BlogListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  useEffect(() => {
    document.title = 'Panduan & Tips Seputar Dokumen PDF - UbahPDF';
    
    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://ubahpdf.my.id/panduan');

    // Update meta description
    let desc = document.querySelector('meta[name="description"]');
    if (desc) {
      desc.setAttribute('content', 'Kumpulan panduan, tips, dan tutorial lengkap seputar pengolahan dokumen PDF untuk CPNS, BUMN, perkuliahan, dan dunia kerja.');
    }
  }, []);

  const categories = useMemo(() => {
    const cats = ['Semua', ...new Set(BLOG_POSTS.map((p) => p.category))];
    return cats;
  }, []);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold mb-4 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Pusat Edukasi & Tutorial UbahPDF</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit'] mb-3">
          Panduan & Tips Pengolahan Dokumen PDF
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Temukan solusi praktis seputar kompresi dokumen CPNS/BUMN, penggabungan ijazah, serta tips efisiensi dokumen kerja Anda.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 max-w-4xl mx-auto">
        <div className="flex flex-wrap gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari panduan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
        </div>
      </div>

      {/* Articles Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 text-slate-500 text-sm">
          Tidak ada panduan yang cocok dengan kata kunci pencarian Anda.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {filteredPosts.map((post) => (
            <Link
              key={post.id}
              to={`/panduan/${post.slug}`}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                  <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-600 font-bold text-[11px] border border-rose-200">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-['Outfit'] group-hover:text-rose-600 transition-colors mb-3 leading-snug">
                  {post.title}
                </h2>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
                  {post.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-slate-900 transition-colors">
                <span className="flex items-center gap-1 text-slate-400 font-normal">
                  <Calendar className="w-3.5 h-3.5" />
                  {post.publishedDate}
                </span>
                <span className="flex items-center gap-1 text-rose-500 font-bold">
                  Baca Selengkapnya
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
