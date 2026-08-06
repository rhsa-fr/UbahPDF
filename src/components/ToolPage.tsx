import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Tool } from '../types';
import { TOOLS } from '../data/toolsData';
import { SEO_DATA } from '../data/seoData';
import { ToolWorkspace } from './ToolWorkspace';
import { SEOHead } from './SEOHead';
import { Sparkles, ShieldCheck, Zap, Lock, CheckCircle2, HelpCircle } from 'lucide-react';

interface ToolPageProps {
  tool: Tool;
}

export const ToolPage: React.FC<ToolPageProps> = ({ tool }) => {
  const navigate = useNavigate();
  const seoInfo = SEO_DATA[tool.id] || {
    h1: tool.name,
    subheading: tool.description,
    steps: [
      { title: 'Pilih Dokumen', desc: 'Unggah file dari komputer atau HP Anda.' },
      { title: 'Proses Instan', desc: 'Proses pemrosesan berjalan cepat di browser.' },
      { title: 'Unduh Hasil', desc: 'Simpan file dokumen yang telah selesai.' }
    ],
    faqs: [
      { question: 'Apakah layanan ini gratis?', answer: 'Ya, seluruh alat di UbahPDF 100% gratis tanpa batasan.' },
      { question: 'Apakah dokumen saya aman?', answer: 'Sangat aman. Seluruh file diproses lokal di dalam browser Anda.' }
    ]
  };

  // Filter other tools for internal linking
  const otherTools = TOOLS.filter((t) => t.id !== tool.id).slice(0, 4);

  return (
    <>
      <SEOHead toolId={tool.id} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-slate-900 transition-colors">Beranda</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{tool.name}</span>
        </nav>

        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Fitur Online UbahPDF</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-['Outfit'] mb-3">
            {seoInfo.h1}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {seoInfo.subheading}
          </p>
        </div>

        {/* Interactive Workspace Area */}
        <div className="bg-white rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-xl shadow-slate-200/40 mb-16">
          <ToolWorkspace tool={tool} onClose={() => navigate('/')} isEmbedded={true} />
        </div>

        {/* SEO Article & Guide Section */}
        <div className="max-w-4xl mx-auto space-y-12 mb-16">
          {/* How-to Steps */}
          <section className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200/80">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit'] mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-rose-500" />
              Cara Menggunakan {tool.name} di UbahPDF
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {seoInfo.steps.map((step, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs relative">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 font-extrabold text-sm flex items-center justify-center mb-3">
                    {idx + 1}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1.5">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Benefits Cards */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit'] mb-6 text-center">
              Keunggulan Fitur {tool.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-3">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">100% Private & Safe</h3>
                <p className="text-xs text-slate-500">File diproses langsung di memori browser Anda tanpa pernah diunggah.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center mb-3">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">Proses Serba Instan</h3>
                <p className="text-xs text-slate-500">Hasil diproses tanpa perlu menunggu antrean server.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-3">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">Gratis Tanpa Batas</h3>
                <p className="text-xs text-slate-500">Bebas digunakan kapan saja tanpa perlu mendaftar akun.</p>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit'] mb-6 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-purple-600" />
              Pertanyaan Umum (FAQ)
            </h2>
            <div className="space-y-4">
              {seoInfo.faqs.map((faq, idx) => (
                <div key={idx} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <h3 className="font-semibold text-slate-900 text-sm mb-1.5">{faq.question}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Other Tools Internal Links (Boost SEO Linking) */}
        <section className="border-t border-slate-200 pt-10 mb-10">
          <h2 className="text-lg font-bold text-slate-900 font-['Outfit'] mb-6">
            Tool PDF Lainnya di UbahPDF
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherTools.map((other) => (
              <Link
                key={other.id}
                to={`/${other.id}`}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-rose-600 transition-colors mb-1 font-['Outfit']">
                    {other.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{other.description}</p>
                </div>
                <div className="mt-3 text-xs font-semibold text-rose-500 flex items-center gap-1">
                  Coba Tool &rarr;
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};
