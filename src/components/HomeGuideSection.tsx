import React from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blogData';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';

export const HomeGuideSection: React.FC = () => {
  const featuredPosts = BLOG_POSTS.slice(0, 3);

  return (
    <section className="border-t border-zinc-200 bg-gradient-to-b from-white to-zinc-50/80 py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 sm:mb-8 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <h2 className="text-base sm:text-xl font-bold text-zinc-900 leading-tight">
                Panduan & Tips PDF
              </h2>
            </div>
            <p className="text-[11px] sm:text-xs text-zinc-400 ml-9 sm:ml-0 leading-relaxed">
              Tutorial praktis untuk syarat CPNS, BUMN, gabung ijazah, dan efisiensi dokumen kerja.
            </p>
          </div>

          <Link
            to="/panduan"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 hover:text-indigo-600 text-xs font-medium transition-all shadow-xs shrink-0"
          >
            Semua Panduan
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Featured Posts Cards */}
        <div className="flex sm:grid sm:grid-cols-3 gap-3 sm:gap-4 overflow-x-auto scrollbar-none pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory">
          {featuredPosts.map((post) => (
            <Link
              key={post.id}
              to={`/panduan/${post.slug}`}
              className="w-[75vw] max-w-[280px] sm:w-auto shrink-0 snap-start precision-card rounded-xl p-3.5 sm:p-5 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-200/60 font-medium text-[10px]">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-[10px]">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="font-semibold text-xs sm:text-sm text-zinc-900 group-hover:text-indigo-600 transition-colors mb-1.5 line-clamp-2 leading-snug">
                  {post.title}
                </h3>

                <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2 mb-2">
                  {post.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] font-medium text-zinc-400 group-hover:text-indigo-600 transition-colors">
                <span>Baca Panduan</span>
                <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile CTA — below cards */}
        <div className="sm:hidden mt-4">
          <Link
            to="/panduan"
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 text-xs font-medium transition-all"
          >
            Lihat Semua Panduan
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
