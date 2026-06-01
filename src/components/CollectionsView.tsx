/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bookmark, LayoutGrid, Sparkles, FolderOpen, Heart, MessageSquare } from 'lucide-react';
import { Trend } from '../types';

interface CollectionsViewProps {
  bookmarkedTrends: Trend[];
  onToggleBookmark: (trendId: string) => void;
  onSelectTrend: (trend: Trend) => void;
}

export default function CollectionsView({ bookmarkedTrends, onToggleBookmark, onSelectTrend }: CollectionsViewProps) {
  return (
    <div className="space-y-8 font-sans animate-in fade-in duration-500">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-primary/5 pb-6">
        <div>
          <h2 className="font-display text-3xl font-bold text-on-surface">
            Minha Coleção Privada
          </h2>
          <p className="text-sm text-on-surface-variant pr-2">
            Seus insights salvos, paletas de cores e conceitos estéticos em um único espaço integrado.
          </p>
        </div>
        <div className="text-xs font-bold text-on-surface-variant uppercase tracking-widest bg-surface-container px-3 py-1.5 rounded-full shrink-0 self-start md:self-end">
          {bookmarkedTrends.length} {bookmarkedTrends.length === 1 ? 'Insight Salvo' : 'Insights Salvos'}
        </div>
      </div>

      {bookmarkedTrends.length === 0 ? (
        /* Expanded empty state */
        <div className="bg-surface-container-lowest border border-dashed border-outline-variant rounded-3xl p-12 text-center max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center text-outline-variant mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h4 className="font-display text-lg font-bold text-on-surface">
              Nenhum insight favoritado ainda
            </h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Explore o feed principal de tendências e clique no ícone de marcador para salvar seus movimentos visuais preferidos aqui!
            </p>
          </div>
          <div className="pt-2">
            <div className="text-[10px] uppercase font-bold tracking-widest text-outline mb-3">
              Filtragem Popular recomendada
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {['#Minimalismo', '#BentoGrid', '#Glassmorphism', '#NeoBrutalism'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-primary rounded-full transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* List of saved trends */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedTrends.map((trend) => (
            <div
              key={trend.id}
              className="group bg-surface-container-lowest border border-outline-variant/40 rounded-2xl overflow-hidden hover:border-primary/20 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header Image */}
                {trend.category === 'Curated Palette' ? (
                  <div className="aspect-[3/2] bg-surface-container p-6 flex flex-col justify-between">
                    <span className="text-[10px] uppercase font-bold text-secondary bg-secondary-fixed px-2.5 py-1 rounded-full w-max">
                      {trend.category}
                    </span>
                    <div className="flex gap-2 flex-grow mt-6 mb-4">
                      {trend.colors?.map((col) => (
                        <div
                          key={col}
                          style={{ backgroundColor: col }}
                          className="flex-1 rounded-md shadow-sm border border-black/5"
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <img
                      src={trend.coverUrl}
                      alt={trend.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-primary text-white text-[10px] uppercase font-semibold rounded-full shadow-sm">
                        {trend.category}
                      </span>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-5 space-y-2">
                  <h4 className="font-display text-base font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                    {trend.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                    {trend.description}
                  </p>
                </div>
              </div>

              {/* Action row */}
              <div className="px-5 py-4 border-t border-outline-variant/30 bg-surface-container-low/30 flex items-center justify-between">
                <button
                  onClick={() => onSelectTrend(trend)}
                  className="text-xs font-bold text-primary hover:text-secondary hover:underline cursor-pointer flex items-center gap-1"
                >
                  Ver mais detalhes →
                </button>

                <button
                  onClick={() => onToggleBookmark(trend.id)}
                  className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Bookmark className="w-3.5 h-3.5 fill-red-600" />
                  <span>Remover</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
