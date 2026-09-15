import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blogData';
import { TOOLS } from '../data/toolsData';
import { Clock, Calendar, ArrowRight, CheckCircle2, BookOpen } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[11px] sm:text-xs text-zinc-400 mb-6 overflow-hidden">
        <Link to="/" className="hover:text-zinc-900 transition-colors shrink-0">Beranda</Link>
        <span className="shrink-0 text-zinc-300">/</span>
        <Link to="/panduan" className="hover:text-zinc-900 transition-colors shrink-0">Panduan</Link>
        <span className="shrink-0 text-zinc-300">/</span>
        <span className="text-zinc-900 font-medium truncate max-w-[160px] sm:max-w-none">{post.title}</span>
      </nav>

      {/* Article Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-zinc-500 mb-3">
          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 font-medium text-[10px] sm:text-[11px] border border-indigo-200/60 shrink-0 whitespace-nowrap">
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-[11px] sm:text-xs text-zinc-400 shrink-0 whitespace-nowrap">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime}
          </span>
          <span className="text-zinc-300 hidden sm:inline">•</span>
          <span className="flex items-center gap-1 text-[11px] sm:text-xs text-zinc-400 shrink-0 whitespace-nowrap">
            <Calendar className="w-3.5 h-3.5" />
            {post.publishedDate}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 mb-3 leading-tight">
          {post.title}
        </h1>

        <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed bg-zinc-50 p-4 rounded-xl border border-zinc-200">
          "{post.summary}"
        </p>
      </header>

      {/* Primary Tool Call to Action Box at Top */}
      {relatedTool && (
        <div className="my-6 p-5 sm:p-6 bg-zinc-900 rounded-xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-zinc-800">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-md inline-block text-zinc-300">
              Tool Terkait
            </span>
            <h3 className="font-bold text-base text-white">{relatedTool.name}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-lg">{post.content.ctaText}</p>
          </div>
          <Link
            to={`/${relatedTool.id}`}
            className="w-full sm:w-auto px-5 py-2.5 btn-primary rounded-lg text-xs font-semibold shrink-0 flex items-center justify-center gap-2"
          >
            Buka Tool Sekarang
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Main Article Content */}
      <article className="prose prose-zinc max-w-none space-y-6 text-zinc-700 text-xs sm:text-sm leading-relaxed bg-white p-6 sm:p-10 rounded-xl border border-zinc-200 shadow-xs mb-10">
        <p className="font-medium text-zinc-900 text-sm sm:text-base">{post.content.intro}</p>

        {post.content.sections.map((section, idx) => (
          <div key={idx} className="space-y-3 pt-4 border-t border-zinc-100">
            <h2 className="text-base sm:text-xl font-bold text-zinc-900 flex items-center gap-2 leading-snug">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
              {section.h2}
            </h2>
            {section.paragraphs.map((p, pIdx) => (
              <p key={pIdx} className="text-zinc-600">{p}</p>
            ))}
            {section.bullets && (
              <ul className="space-y-2 pl-0 sm:pl-2">
                {section.bullets.map((b, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2.5 bg-zinc-50 p-3 rounded-lg border border-zinc-200">
                    <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {bIdx + 1}
                    </span>
                    <span className="text-xs sm:text-sm text-zinc-800 font-medium">{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </article>

      {/* Internal Link to Other Articles */}
      <section className="border-t border-zinc-200 pt-8">
        <h3 className="text-sm sm:text-base font-bold text-zinc-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          Panduan Lainnya yang Mungkin Anda Butuhkan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {otherPosts.map((op) => (
            <Link
              key={op.id}
              to={`/panduan/${op.slug}`}
              className="precision-card p-4 rounded-xl flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/60 mb-2 inline-block">
                  {op.category}
                </span>
                <h4 className="font-semibold text-xs sm:text-sm text-zinc-900 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2 leading-snug">
                  {op.title}
                </h4>
              </div>
              <span className="text-xs font-medium text-indigo-600 flex items-center gap-1 mt-3">
                Baca Panduan &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
