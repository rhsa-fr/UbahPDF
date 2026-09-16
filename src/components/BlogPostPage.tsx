import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blogData';
import { TOOLS } from '../data/toolsData';
import { Clock, Calendar, ArrowRight, CheckCircle2, BookOpen } from 'lucide-react';
import { ToolIcon } from './ToolIcons';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} - UbahPDF`;

      let desc = document.querySelector('meta[name="description"]');
      if (desc) {
        desc.setAttribute('content', post.metaDescription);
      }

      const canonicalUrl = `https://ubahpdf.my.id/panduan/${post.slug}`;
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', canonicalUrl);

      let script = document.getElementById('blog-posting-json-ld');
      if (!script) {
        script = document.createElement('script');
        script.id = 'blog-posting-json-ld';
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'BlogPosting',
            'headline': post.title,
            'description': post.metaDescription,
            'author': {
              '@type': 'Organization',
              'name': 'UbahPDF'
            },
            'publisher': {
              '@type': 'Organization',
              'name': 'UbahPDF',
              'logo': {
                '@type': 'ImageObject',
                'url': 'https://ubahpdf.my.id/logo.png'
              }
            },
            'datePublished': '2026-08-06',
            'mainEntityOfPage': canonicalUrl
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Beranda',
                'item': 'https://ubahpdf.my.id/'
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Panduan',
                'item': 'https://ubahpdf.my.id/panduan'
              },
              {
                '@type': 'ListItem',
                'position': 3,
                'name': post.title,
                'item': canonicalUrl
              }
            ]
          }
        ]
      });
    }
  }, [post]);

  if (!post) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Artikel Tidak Ditemukan</h2>
        <p className="text-zinc-500 text-sm mb-4">Artikel panduan yang Anda cari tidak tersedia.</p>
        <Link to="/panduan" className="text-indigo-600 font-semibold text-xs hover:underline">
          ← Kembali ke Daftar Panduan
        </Link>
      </div>
    );
  }

  const relatedTool = TOOLS.find((t) => t.id === post.relatedToolId);
  const otherPosts = BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[11px] sm:text-xs text-zinc-400 mb-5 overflow-hidden">
        <Link to="/" className="hover:text-zinc-900 transition-colors shrink-0">Beranda</Link>
        <span className="shrink-0 text-zinc-300">/</span>
        <Link to="/panduan" className="hover:text-zinc-900 transition-colors shrink-0">Panduan</Link>
        <span className="shrink-0 text-zinc-300">/</span>
        <span className="text-zinc-700 font-medium truncate max-w-[160px] sm:max-w-none">{post.title}</span>
      </nav>

      {/* Article Header */}
      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 mb-2.5">
          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 font-medium text-[10px] border border-indigo-200/60 shrink-0">
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-zinc-400 shrink-0">
            <Clock className="w-3 h-3" />
            {post.readTime}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-zinc-400 shrink-0">
            <Calendar className="w-3 h-3" />
            {post.publishedDate}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-zinc-900 mb-3 leading-snug">
          {post.title}
        </h1>

        <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed bg-zinc-50 p-3 sm:p-4 rounded-xl border border-zinc-200 italic">
          "{post.summary}"
        </p>
      </header>

      {/* Related Tool CTA */}
      {relatedTool && (
        <div className="my-6 p-4 sm:p-5 bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-2xl text-white flex items-center gap-3 sm:gap-4 border border-zinc-700/50 shadow-sm">
          <div className="shrink-0 bg-white/10 rounded-xl p-1.5 sm:p-2">
            <ToolIcon toolId={relatedTool.id} size={32} />
          </div>
          <div className="flex-1 min-w-0 space-y-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Tool Terkait
            </span>
            <h3 className="font-bold text-sm text-white truncate">{relatedTool.name}</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-1 sm:line-clamp-none">{post.content.ctaText}</p>
          </div>
          <Link
            to={`/${relatedTool.id}`}
            className="px-3.5 py-2 bg-white text-zinc-900 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1.5 hover:bg-zinc-100 transition-colors shadow-sm"
          >
            <span className="hidden sm:inline">Buka Tool</span>
            <span className="sm:hidden">Buka</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* Main Article Content */}
      <article className="space-y-5 text-zinc-700 text-xs sm:text-sm leading-relaxed bg-white p-4 sm:p-8 rounded-2xl border border-zinc-200 shadow-xs mb-8">
        <p className="font-medium text-zinc-900 text-sm sm:text-base leading-relaxed">{post.content.intro}</p>

        {post.content.sections.map((section, idx) => (
          <div key={idx} className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-sm sm:text-lg font-bold text-zinc-900 flex items-start gap-2 leading-snug">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              {section.h2}
            </h2>
            {section.paragraphs.map((p, pIdx) => (
              <p key={pIdx} className="text-zinc-600 leading-relaxed">{p}</p>
            ))}
            {section.bullets && (
              <ul className="space-y-1.5 pl-0">
                {section.bullets.map((b, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2 p-2.5 rounded-lg bg-zinc-50/80 border border-zinc-100">
                    <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {bIdx + 1}
                    </span>
                    <span className="text-xs sm:text-sm text-zinc-700">{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </article>

      {/* Related Articles */}
      <section className="border-t border-zinc-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm sm:text-base font-bold text-zinc-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            Panduan Lainnya
          </h3>
          <Link to="/panduan" className="hidden sm:flex items-center gap-1 text-xs text-indigo-600 font-medium hover:text-indigo-700 transition-colors">
            Semua
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex sm:grid sm:grid-cols-3 gap-3 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 snap-x snap-mandatory">
          {otherPosts.map((op) => (
            <Link
              key={op.id}
              to={`/panduan/${op.slug}`}
              className="w-[72vw] max-w-[260px] sm:w-auto shrink-0 snap-start precision-card p-3.5 rounded-xl flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/60 mb-2 inline-block">
                  {op.category}
                </span>
                <h4 className="font-semibold text-xs sm:text-sm text-zinc-900 group-hover:text-indigo-600 transition-colors mb-1.5 line-clamp-2 leading-snug">
                  {op.title}
                </h4>
              </div>
              <span className="text-[11px] font-medium text-zinc-400 group-hover:text-indigo-600 flex items-center gap-1 mt-2 pt-2 border-t border-zinc-100 transition-colors">
                Baca Panduan
                <ArrowRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
        {/* Mobile see all link */}
        <div className="sm:hidden mt-3">
          <Link to="/panduan" className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 text-xs font-medium transition-all">
            Lihat Semua Panduan
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
};
