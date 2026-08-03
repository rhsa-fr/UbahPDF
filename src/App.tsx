import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ToolGrid } from './components/ToolGrid';
import { ToolWorkspace } from './components/ToolWorkspace';
import { Footer } from './components/Footer';
import { TOOLS } from './data/toolsData';
import type { Tool } from './types';

export const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTool, setActiveTool] = useState<Tool | null>(null);

  // Filter tools dynamically based on selected category & search input
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
    setActiveTool(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Inter'] relative selection:bg-rose-500 selection:text-white">
      {/* Background Decorative Grids & Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <Navbar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onReset={handleReset}
      />

      <main className="flex-1">
        <Hero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <ToolGrid
          tools={filteredTools}
          onSelectTool={(tool) => setActiveTool(tool)}
        />
      </main>

      <Footer />

      {/* Active Workspace Modal */}
      {activeTool && (
        <ToolWorkspace tool={activeTool} onClose={() => setActiveTool(null)} />
      )}
    </div>
  );
};

export default App;
