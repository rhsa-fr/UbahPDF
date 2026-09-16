import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ToolIcon } from './ToolIcons';
import type { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  return (
    <Link
      to={`/${tool.id}`}
      className="group precision-card rounded-xl p-3.5 sm:p-5 cursor-pointer flex flex-col justify-between select-none bg-white hover:border-zinc-300 transition-all"
    >
      {/* Card Content */}
      <div>
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          {/* Custom Visual Document Icon */}
          <div className="transition-transform duration-200 group-hover:scale-105">
            <ToolIcon toolId={tool.id} size={38} className="sm:hidden" />
            <ToolIcon toolId={tool.id} size={44} className="hidden sm:block" />
          </div>

          {tool.popular && (
            <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 sm:px-2 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-200/80">
              Populer
            </span>
          )}
        </div>

        <h3 className="text-xs sm:text-sm font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors mb-1 sm:mb-1.5 leading-snug line-clamp-1 sm:line-clamp-none">
          {tool.name}
        </h3>

        <p className="text-[11px] sm:text-xs text-zinc-500 leading-relaxed line-clamp-2">
          {tool.description}
        </p>
      </div>

      {/* Bottom Action */}
      <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] sm:text-xs font-medium text-zinc-400 group-hover:text-indigo-600 transition-colors">
        <span className="hidden sm:inline">Gunakan Tool</span>
        <span className="sm:hidden">Pakai</span>
        <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};
