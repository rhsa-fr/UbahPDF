import React from 'react';
import * as Icons from 'lucide-react';
import type { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
  onClick: (tool: Tool) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick }) => {
  // Dynamically map icon name string to Lucide Icon component
  const IconComponent = (Icons as any)[tool.iconName] || Icons.FileText;

  return (
    <div
      onClick={() => onClick(tool)}
      className="group relative glass-card rounded-2xl p-6 cursor-pointer flex flex-col justify-between overflow-hidden select-none border border-slate-800/80 hover:border-slate-700 transition-all duration-300"
    >
      {/* Top Accent Gradient Line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${tool.gradient} opacity-80 group-hover:opacity-100 transition-opacity`}
      />

      {/* Card Content */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300"
            style={{ backgroundColor: `${tool.color}25`, color: tool.color }}
          >
            <IconComponent className="w-6 h-6" />
          </div>

          {tool.popular && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
              Populer
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-white group-hover:text-rose-400 transition-colors font-['Outfit'] mb-2">
          {tool.name}
        </h3>

        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
          {tool.description}
        </p>
      </div>

      {/* Bottom Action Trigger */}
      <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">
        <span>Gunakan Tool</span>
        <Icons.ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform text-rose-400" />
      </div>
    </div>
  );
};
