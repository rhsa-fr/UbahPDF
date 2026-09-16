import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Tool } from '../types';
import { TOOLS } from '../data/toolsData';
import { SEO_DATA } from '../data/seoData';
import { ToolWorkspace } from './ToolWorkspace';
import { SEOHead } from './SEOHead';
import { ToolIcon } from './ToolIcons';
import { ShieldCheck, Zap, Lock, CheckCircle2, HelpCircle, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

interface ToolPageProps {
  tool: Tool;
}

export const ToolPage: React.FC<ToolPageProps> = ({ tool }) => {
  const navigate = useNavigate();
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

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

  const otherTools = TOOLS
    .filter((t) => t.id !== tool.id)
    .sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0))
    .slice(0, 4);

  return (
    <>
      <SEOHead toolId={tool.id} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-6">
          <Link to="/" className="hover:text-zinc-900 transition-colors">Beranda</Link>
          <span>/</span>
          <span className="text-zinc-900 font-medium truncate">{tool.name}</span>
        </nav>

        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-8 px-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 leading-tight mb-2">
            {seoInfo.h1}
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
            {seoInfo.subheading}
          </p>
        </div>

        {/* Interactive Workspace Area */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden mb-10">
          <ToolWorkspace tool={tool} onClose={() => navigate('/')} isEmbedded={true} />
        </div>

        {/* Collapsible SEO Guide & FAQ Accordion Section */}
        <div className="max-w-3xl mx-auto mb-14">
          {/* Accordion Toggle Trigger Bar */}
          <button
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            className="w-full bg-white hover:bg-zinc-50 border border-zinc-200 rounded-xl p-4 shadow-xs flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 text-xs sm:text-sm group-hover:text-indigo-600 transition-colors">
                  Panduan Cara Pakai & FAQ {tool.name}
                </h3>
                <p className="text-[11px] sm:text-xs text-zinc-400">
                  {isAccordionOpen ? 'Klik untuk menyembunyikan penjelasan' : 'Petunjuk langkah demi langkah dan tanya jawab'}
                </p>
              </div>
            </div>

            <div className="p-1.5 rounded-md bg-zinc-100 group-hover:bg-zinc-200 text-zinc-500 transition-colors shrink-0">
              {isAccordionOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {/* Accordion Content */}
          <div className={`${isAccordionOpen ? 'block mt-4' : 'hidden'} space-y-6 animate-fadeIn`}>
            {/* How-to Steps */}
            <section className="bg-zinc-50 rounded-xl p-5 border border-zinc-200">
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                Cara Menggunakan {tool.name} di UbahPDF
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {seoInfo.steps.map((step, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg border border-zinc-200 shadow-xs relative">
                    <div className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center mb-2">
                      {idx + 1}
                    </div>
                    <h3 className="font-semibold text-zinc-900 text-xs mb-1">{step.title}</h3>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Benefits Cards */}
            <section>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-2">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-zinc-900 text-xs mb-0.5">100% Private & Safe</h4>
                  <p className="text-[11px] text-zinc-400">File diproses langsung di browser.</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 mx-auto flex items-center justify-center mb-2">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-zinc-900 text-xs mb-0.5">Proses Instan</h4>
                  <p className="text-[11px] text-zinc-400">Hasil cepat tanpa antrean server.</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-2">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-zinc-900 text-xs mb-0.5">Gratis Tanpa Batas</h4>
                  <p className="text-[11px] text-zinc-400">Bebas dipakai tanpa registrasi.</p>
                </div>
              </div>
            </section>

            {/* FAQs */}
            <section className="bg-white rounded-xl p-5 border border-zinc-200">
              <h3 className="text-sm sm:text-base font-bold text-zinc-900 mb-3 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                Pertanyaan Umum (FAQ)
              </h3>
              <div className="space-y-3 divide-y divide-zinc-100">
                {seoInfo.faqs.map((faq, idx) => (
                  <div key={idx} className={idx > 0 ? "pt-3" : ""}>
                    <h4 className="font-medium text-zinc-900 text-xs sm:text-sm mb-1">{faq.question}</h4>
                    <p className="text-[11px] sm:text-xs text-zinc-500 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Other Tools Internal Links */}
        <section className="border-t border-zinc-200 pt-8 mb-8">
          <h2 className="text-sm sm:text-base font-bold text-zinc-900 mb-4">
            Tool Populer Lainnya
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {otherTools.map((other) => {
              return (
                <Link
                  key={other.id}
                  to={`/${other.id}`}
                  className="precision-card p-3.5 rounded-xl flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="shrink-0 transition-transform duration-200 group-hover:scale-105">
                        <ToolIcon toolId={other.id} size={32} />
                      </div>
                      <h3 className="font-semibold text-xs sm:text-sm text-zinc-900 group-hover:text-indigo-600 transition-colors truncate">
                        {other.name}
                      </h3>
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                      {other.description}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-zinc-100 text-[11px] font-medium text-zinc-400 group-hover:text-indigo-600 transition-colors flex items-center justify-between">
                    <span>Gunakan Tool</span>
                    <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
};
