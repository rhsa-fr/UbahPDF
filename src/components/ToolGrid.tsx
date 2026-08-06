import React from 'react';
import { ToolCard } from './ToolCard';
import type { Tool } from '../types';
import { FileQuestion } from 'lucide-react';

interface ToolGridProps {
  tools: Tool[];
}

export const ToolGrid: React.FC<ToolGridProps> = ({ tools }) => {
  if (tools.length === 0) {
    return (
      <div className="text-center py-16 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-4 border border-slate-200 text-slate-400">
          <FileQuestion className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Tool Tidak Ditemukan</h3>
        <p className="text-xs text-slate-500">
          Tidak ada tool yang cocok dengan kata kunci pencarian Anda. Coba gunakan kata kunci lain seperti "PDF", "Merge", atau "Image".
        </p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
};
