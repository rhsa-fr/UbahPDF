import React from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blogData';
import { BookOpen, Clock, ArrowRight, Sparkles } from 'lucide-react';

export const HomeGuideSection: React.FC = () => {
  const featuredPosts = BLOG_POSTS.slice(0, 3);

  return (
    <section className="border-t border-slate-200/80 bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pusat Edukasi Dokumen</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
              Panduan & Tips PDF Terbaru
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Tutorial praktis untuk syarat CPNS, BUMN, gabung ijazah, dan efisiensi dokumen kerja.
            </p>
          </div>

          <Link
            to="/panduan"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md shrink-0 w-fit"
          >
            <BookOpen className="w-4 h-4 text-rose-400" />
            <span>Lihat Semua Panduan</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Featured Posts Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredPosts.map((post) => (
            <Link
              key={post.id}
              to={`/panduan/${post.slug}`}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-rose-600 font-bold text-[10px]">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 group-hover:text-rose-600 transition-colors font-['Outfit'] mb-2 line-clamp-2 leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
                  {post.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-rose-500 group-hover:text-rose-600">
                <span>Baca Panduan</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
