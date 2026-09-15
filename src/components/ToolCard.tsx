import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import type { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const IconComponent = (Icons as any)[tool.iconName] || Icons.FileText;

  return (
    <Link
      to={`/${tool.id}`}
      className="group precision-card rounded-xl p-3.5 sm:p-5 cursor-pointer flex flex-col justify-between select-none"
    >
      {/* Card Content */}
      <div>
        <div className="flex items-center justify-between mb-2.5 sm:mb-3.5">
          <div
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
            style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }}
          >
            <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
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
        <Icons.ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};
