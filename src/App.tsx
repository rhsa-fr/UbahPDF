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
import { ROUTES } from './config/routes';

const ToolRouteHandler: React.FC = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const tool = TOOLS.find((t) => t.id === toolId);

  if (!tool) {
    return (
      <div className="text-center py-24 px-4">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Halaman Tidak Ditemukan</h2>
        <p className="text-zinc-500 text-sm">Alat yang Anda cari tidak tersedia atau URL salah.</p>
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

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  const handleReset = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 flex flex-col font-['Inter'] relative selection:bg-indigo-600 selection:text-white">
      {/* Scroll Restorer */}
      <ScrollToTop />

      <Navbar
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onReset={handleReset}
      />

      <main className="flex-1">
        <Routes>
          <Route
            path={ROUTES.HOME}
            element={
              <>
                <SEOHead toolId={null} />
                <Hero searchQuery={searchQuery} onSearchChange={setSearchQuery} />
                <ToolGrid tools={filteredTools} />
                <HomeGuideSection />
              </>
            }
          />
          <Route path={ROUTES.BLOG_LIST} element={<BlogListPage />} />
          <Route path="/panduan/:slug" element={<BlogPostPage />} />
          <Route path="/:toolId" element={<ToolRouteHandler />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
