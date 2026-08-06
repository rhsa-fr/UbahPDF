import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import type { Tool } from '../types';
import { TOOLS } from '../data/toolsData';
import { SEO_DATA } from '../data/seoData';
import { ToolWorkspace } from './ToolWorkspace';
import { SEOHead } from './SEOHead';
import { Sparkles, ShieldCheck, Zap, Lock, CheckCircle2, HelpCircle, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

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

  const otherTools = TOOLS.filter((t) => t.id !== tool.id).slice(0, 4);

  return (
    <>
      <SEOHead toolId={tool.id} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4 sm:mb-6">
          <Link to="/" className="hover:text-slate-900 transition-colors">Beranda</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate">{tool.name}</span>
        </nav>

        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-8 px-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3.5 sm:py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-[10px] sm:text-xs font-semibold mb-2 sm:mb-3 shadow-xs">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-500" />
            <span>Fitur Online UbahPDF</span>
          </div>
          <h1 className="text-lg sm:text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 font-['Outfit'] leading-snug sm:leading-tight mb-1.5 sm:mb-3">
            {seoInfo.h1}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
            {seoInfo.subheading}
          </p>
        </div>

        {/* Interactive Workspace Area */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-8 border border-slate-200 shadow-xl shadow-slate-200/40 mb-8 sm:mb-12">
          <ToolWorkspace tool={tool} onClose={() => navigate('/')} isEmbedded={true} />
        </div>

        {/* Collapsible SEO Guide & FAQ Accordion Section */}
        <div className="max-w-4xl mx-auto mb-10 sm:mb-16">
          {/* Accordion Toggle Trigger Bar */}
          <button
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            className="w-full bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-base font-['Outfit'] group-hover:text-rose-600 transition-colors">
                  Panduan Cara Pakai & FAQ {tool.name}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  {isAccordionOpen ? 'Klik untuk menyembunyikan penjelasan' : 'Klik untuk membaca petunjuk langkah dan pertanyaan umum'}
                </p>
              </div>
            </div>

            <div className="p-1.5 sm:p-2 rounded-xl bg-slate-100 group-hover:bg-slate-200 text-slate-600 transition-colors shrink-0">
              {isAccordionOpen ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />}
            </div>
          </button>

          {/* Accordion Content */}
          <div className={`${isAccordionOpen ? 'block mt-6' : 'hidden'} space-y-8 animate-fadeIn`}>
            {/* How-to Steps */}
            <section className="bg-slate-50 rounded-2xl p-5 sm:p-8 border border-slate-200/80">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-['Outfit'] mb-4 sm:mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-rose-500" />
                Cara Menggunakan {tool.name} di UbahPDF
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {seoInfo.steps.map((step, idx) => (
                  <div key={idx} className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-2xs relative">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-rose-50 text-rose-600 font-extrabold text-xs sm:text-sm flex items-center justify-center mb-2.5">
                      {idx + 1}
                    </div>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm mb-1">{step.title}</h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Benefits Cards */}
            <section>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-['Outfit'] mb-4 text-center">
                Keunggulan Fitur {tool.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-2">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs mb-1">100% Private & Safe</h4>
                  <p className="text-[11px] text-slate-500">File diproses langsung di browser Anda.</p>
                </div>
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center mb-2">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs mb-1">Proses Serba Instan</h4>
                  <p className="text-[11px] text-slate-500">Hasil cepat tanpa antrean server.</p>
                </div>
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-2">
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs mb-1">Gratis Tanpa Batas</h4>
                  <p className="text-[11px] text-slate-500">Bebas dipakai kapan pun tanpa registrasi.</p>
                </div>
              </div>
            </section>

            {/* FAQs */}
            <section className="bg-white rounded-2xl p-5 sm:p-8 border border-slate-200">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-['Outfit'] mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-purple-600" />
                Pertanyaan Umum (FAQ)
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {seoInfo.faqs.map((faq, idx) => (
                  <div key={idx} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <h4 className="font-semibold text-slate-900 text-xs sm:text-sm mb-1">{faq.question}</h4>
                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Other Tools Internal Links - Responsive 2 Columns Grid on Mobile */}
        <section className="border-t border-slate-200 pt-6 sm:pt-10 mb-8 sm:mb-10">
          <h2 className="text-sm sm:text-lg font-bold text-slate-900 font-['Outfit'] mb-4 sm:mb-6">
            Tool PDF Lainnya di UbahPDF
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {otherTools.map((other) => {
              const IconComp = (Icons as any)[other.iconName] || Icons.FileText;
              return (
                <Link
                  key={other.id}
                  to={`/${other.id}`}
                  className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0"
                        style={{ backgroundColor: `${other.color}15`, color: other.color }}
                      >
                        <IconComp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-rose-600 transition-colors font-['Outfit'] truncate">
                        {other.name}
                      </h3>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {other.description}
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] sm:text-xs font-semibold text-rose-500 flex items-center justify-between">
                    <span>Coba Tool</span>
                    <ArrowRight className="w-3 h-3 text-rose-500 transform group-hover:translate-x-1 transition-transform" />
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
