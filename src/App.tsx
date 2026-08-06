import React, { useState, useMemo } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ToolGrid } from './components/ToolGrid';
import { HomeGuideSection } from './components/HomeGuideSection';
import { ToolPage } from './components/ToolPage';
import { BlogListPage } from './components/BlogListPage';
import { BlogPostPage } from './components/BlogPostPage';
import { Footer } from './components/Footer';
import { SEOHead } from './components/SEOHead';
import { ScrollToTop } from './components/ScrollToTop';
import { TOOLS } from './data/toolsData';

const ToolRouteHandler: React.FC = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const tool = TOOLS.find((t) => t.id === toolId);

  if (!tool) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900 mb-2 font-['Outfit'] font-extrabold">Halaman Tidak Ditemukan</h2>
        <p className="text-slate-500 text-sm">Halaman yang Anda cari tidak tersedia.</p>
      </div>
    );
  }

  return <ToolPage tool={tool} />;
};

export const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      const matchesCategory =
        selectedCategory === 'all' || tool.category === selectedCategory;
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleReset = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Inter'] relative selection:bg-rose-500 selection:text-white">
      {/* Scroll Restorer for route navigation */}
      <ScrollToTop />

      {/* Background Decorative Grids & Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e140_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e140_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <Navbar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onReset={handleReset}
      />

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <SEOHead toolId={null} />
                <Hero searchQuery={searchQuery} onSearchChange={setSearchQuery} />
                <ToolGrid tools={filteredTools} />
                <HomeGuideSection />
              </>
            }
          />
          <Route path="/panduan" element={<BlogListPage />} />
          <Route path="/panduan/:slug" element={<BlogPostPage />} />
          <Route path="/:toolId" element={<ToolRouteHandler />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
