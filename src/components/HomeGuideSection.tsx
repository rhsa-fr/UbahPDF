import React from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blogData';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';

export const HomeGuideSection: React.FC = () => {
  const featuredPosts = BLOG_POSTS.slice(0, 3);

  return (
    <section className="border-t border-zinc-200 bg-white py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-3">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-zinc-900 leading-tight">
              Panduan & Tips PDF Terbaru
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1 leading-relaxed">
              Tutorial praktis untuk syarat CPNS, BUMN, gabung ijazah, dan efisiensi dokumen kerja.
            </p>
          </div>

          <Link
            to="/panduan"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition-all shrink-0 w-full sm:w-auto"
          >
            <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
            <span>Lihat Semua Panduan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Featured Posts Cards */}
        <div className="flex md:grid md:grid-cols-3 gap-3 sm:gap-4 overflow-x-auto scrollbar-none pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory">
          {featuredPosts.map((post) => (
            <Link
              key={post.id}
              to={`/panduan/${post.slug}`}
              className="w-[85vw] max-w-[300px] md:w-auto shrink-0 snap-align-start precision-card rounded-xl p-4 sm:p-5 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-2.5">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-200/60 font-medium text-[10px]">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-[10px]">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="font-semibold text-sm text-zinc-900 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2 leading-snug">
                  {post.title}
                </h3>

                <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2 sm:line-clamp-3 mb-3">
                  {post.summary}
                </p>
              </div>

              <div className="pt-2.5 border-t border-zinc-100 flex items-center justify-between text-xs font-medium text-zinc-400 group-hover:text-indigo-600 transition-colors">
                <span>Baca Panduan</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
