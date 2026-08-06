import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blogData';
import { TOOLS } from '../data/toolsData';
import { Clock, Calendar, ArrowRight, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';

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
                'url': 'https://ubahpdf.my.id/logo.svg'
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
        <h2 className="text-2xl font-bold text-slate-900 mb-2 font-['Outfit']">Artikel Tidak Ditemukan</h2>
        <p className="text-slate-500 text-sm mb-4">Artikel panduan yang Anda cari tidak tersedia.</p>
        <Link to="/panduan" className="text-rose-600 font-bold text-xs hover:underline">
          &larr; Kembali ke Daftar Panduan
        </Link>
      </div>
    );
  }

  const relatedTool = TOOLS.find((t) => t.id === post.relatedToolId);
  const otherPosts = BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 mb-4 sm:mb-6 overflow-hidden">
        <Link to="/" className="hover:text-slate-900 transition-colors shrink-0">Beranda</Link>
        <span className="shrink-0 text-slate-300">/</span>
        <Link to="/panduan" className="hover:text-slate-900 transition-colors shrink-0">Panduan</Link>
        <span className="shrink-0 text-slate-300">/</span>
        <span className="text-slate-900 font-semibold truncate max-w-[160px] sm:max-w-none">{post.title}</span>
      </nav>

      {/* Article Header */}
      <header className="mb-6 sm:mb-8">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500 mb-3 sm:mb-4">
          <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 font-bold text-[10px] sm:text-[11px] border border-rose-200 shrink-0 whitespace-nowrap">
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-500 shrink-0 whitespace-nowrap">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {post.readTime}
          </span>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-500 shrink-0 whitespace-nowrap">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {post.publishedDate}
          </span>
        </div>

        <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 font-['Outfit'] mb-3 sm:mb-4 leading-snug sm:leading-tight">
          {post.title}
        </h1>

        <p className="text-slate-600 text-xs sm:text-base leading-relaxed bg-slate-100/70 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 italic">
          "{post.summary}"
        </p>
      </header>

      {/* Primary Tool Call to Action Box at Top */}
      {relatedTool && (
        <div className="my-6 sm:my-8 p-5 sm:p-6 bg-gradient-to-r from-rose-500 to-indigo-600 rounded-2xl sm:rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full inline-block mb-1">
              Gunakan Tool Terkait
            </span>
            <h3 className="font-bold text-base sm:text-lg font-['Outfit']">{relatedTool.name}</h3>
            <p className="text-xs text-white/90 leading-relaxed max-w-lg">{post.content.ctaText}</p>
          </div>
          <Link
            to={`/${relatedTool.id}`}
            className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-slate-900 font-extrabold rounded-xl sm:rounded-2xl text-xs hover:bg-slate-100 transition-all shadow-md shrink-0 flex items-center justify-center gap-2"
          >
            Buka Tool Sekarang
            <ArrowRight className="w-4 h-4 text-rose-600" />
          </Link>
        </div>
      )}

      {/* Main Article Content */}
      <article className="prose prose-slate max-w-none space-y-6 sm:space-y-8 text-slate-700 text-xs sm:text-base leading-relaxed bg-white p-5 sm:p-10 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs mb-8 sm:mb-12">
        <p className="font-medium text-slate-800 text-sm sm:text-base">{post.content.intro}</p>

        {post.content.sections.map((section, idx) => (
          <div key={idx} className="space-y-3 sm:space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-base sm:text-2xl font-bold text-slate-900 font-['Outfit'] flex items-center gap-2 leading-snug">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 shrink-0" />
              {section.h2}
            </h2>
            {section.paragraphs.map((p, pIdx) => (
              <p key={pIdx}>{p}</p>
            ))}
            {section.bullets && (
              <ul className="space-y-2 pl-0 sm:pl-2">
                {section.bullets.map((b, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2.5 bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-200/80">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {bIdx + 1}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-800 font-medium">{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </article>

      {/* Bottom Tool CTA Box */}
      {relatedTool && (
        <div className="mb-8 sm:mb-12 p-6 sm:p-8 bg-slate-900 rounded-2xl sm:rounded-3xl text-white text-center space-y-3 sm:space-y-4 border border-slate-800 shadow-xl">
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400 mx-auto" />
          <h3 className="text-lg sm:text-2xl font-bold font-['Outfit']">Siap Memproses Dokumen Anda?</h3>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
            Proses file PDF Anda secara gratis, 100% rahasia langsung di browser tanpa instalasi aplikasi.
          </p>
          <Link
            to={`/${relatedTool.id}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-indigo-600 text-white font-extrabold rounded-xl sm:rounded-2xl text-xs hover:opacity-95 transition-all shadow-lg w-full sm:w-auto"
          >
            Gunakan {relatedTool.name} Sekarang
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Internal Link to Other Articles */}
      <section className="border-t border-slate-200 pt-6 sm:pt-10">
        <h3 className="text-base sm:text-xl font-bold text-slate-900 font-['Outfit'] mb-4 sm:mb-6 flex items-center gap-2">
          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
          Panduan Lainnya yang Mungkin Anda Butuhkan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {otherPosts.map((op) => (
            <Link
              key={op.id}
              to={`/panduan/${op.slug}`}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 mb-2 inline-block">
                  {op.category}
                </span>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-rose-600 transition-colors font-['Outfit'] mb-2 line-clamp-2 leading-snug">
                  {op.title}
                </h4>
              </div>
              <span className="text-xs font-semibold text-rose-500 flex items-center gap-1 mt-3">
                Baca Panduan &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
