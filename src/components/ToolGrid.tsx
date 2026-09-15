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
      <div className="text-center py-16 max-w-md mx-auto px-4">
        <div className="w-12 h-12 rounded-xl bg-white shadow-xs flex items-center justify-center mx-auto mb-3 border border-zinc-200 text-zinc-400">
          <FileQuestion className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-zinc-900 mb-1">Tool Tidak Ditemukan</h3>
        <p className="text-xs text-zinc-500 leading-relaxed">
          Tidak ada alat yang cocok dengan pencarian Anda. Coba kata kunci lain seperti "Merge", "Compress", atau "JPG".
        </p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
};
