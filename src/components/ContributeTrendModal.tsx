/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Check, Image, AlertCircle, Plus } from 'lucide-react';
import { PRESET_VERSIONS_COVERS, POPULAR_TAGS } from '../data';
import { Trend, Author } from '../types';

interface ContributeTrendModalProps {
  onClose: () => void;
  onAddTrend: (trend: Trend) => void;
  userName: string;
}

export default function ContributeTrendModal({ onClose, onAddTrend, userName }: ContributeTrendModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Minimalismo');
  const [selectedCover, setSelectedCover] = useState(PRESET_VERSIONS_COVERS[0].url);
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [useCustomCover, setUseCustomCover] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const finalCover = useCustomCover ? (customCoverUrl || PRESET_VERSIONS_COVERS[0].url) : selectedCover;

    // Build the Author object
    const mainAuthor: Author = {
      name: userName || 'Trend Discoverer',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOvSUgQynIPxIQhZqq72rFnKXDLEJfVubeHzEmyXFjsFMAkFE-JOBj6iWKug2T_bYiPiuTZnAJPl_MzEsaFtQNM261zZTXwfPxKRr-ZbTLHfbj4T_q_hEl2dvF_x1nNNYco6kTbdOXEXUB6DqOQ8EW21TF1YyptlmDFk2vg6qX2aBudGehuBXfps0xM6UXVP5wm_HKQfhIzu7EULcFwShnpqO56qwaNvTIayyUdR_9h2SL0MR4vvFCbuG_Xy5Q4sA1ZnWPQX0qy7A'
    };

    const newTrend: Trend = {
      id: `trend-${Date.now()}`,
      title,
      description,
      category,
      coverUrl: category === 'Curated Palette' ? '' : finalCover,
      authors: [mainAuthor],
      collaborationText: `Postado por ${mainAuthor.name}`,
      date: new Date().toISOString().split('T')[0],
      views: 120,
      likes: 12,
      isBookmarked: false,
      gridSpan: category === 'Curated Palette' ? 'small-palette' : (Math.random() > 0.5 ? 'medium' : 'featured'),
      colors: category === 'Curated Palette' ? ['#831ada', '#3525cd', '#e2dfff', '#f0dbff'] : undefined
    };

    onAddTrend(newTrend);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-2xl shadow-2xl relative border border-primary/10 max-h-[90vh] overflow-y-auto font-sans z-10"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-outline-variant hover:bg-surface-container-low hover:text-primary transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-display text-2xl font-bold text-on-surface mb-1">
          Contribuir com Tendência
        </h3>
        <p className="text-sm text-on-surface-variant mb-6">
          Adicione um novo movimento de design inovador à nossa curadoria global.
        </p>

        {errorMsg && (
          <div className="p-3 mb-4 bg-error-container/80 text-error rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Título da Tendência *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Minimalismo Cósmico, Brutalismo Neo-Moderno..."
              className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-all text-sm text-on-surface"
            />
          </div>

          {/* Description input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Descrição Curta *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Como essa estética ou recurso técnico está moldando a próxima geração de designs?"
              className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-all text-sm text-on-surface resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category selection */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Categoria / Tag Principal
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-all text-sm text-on-surface"
              >
                {POPULAR_TAGS.map((t) => (
                  <option key={t} value={t.replace('#', '')}>
                    {t}
                  </option>
                ))}
                <option value="Briefing Mensal">#Briefing Mensal</option>
                <option value="Curated Palette">#Curated Palette</option>
                <option value="Glassmorphism">#Glassmorphism</option>
              </select>
            </div>

            {/* Layout representation */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Quem Posta
              </label>
              <div className="px-4 py-3 bg-surface-container-high rounded-xl flex items-center gap-3 border border-outline-variant/40">
                <div className="w-6 h-6 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs text-on-surface font-semibold">{userName}</span>
                <span className="ml-auto text-[9px] uppercase tracking-wider font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Contributor
                </span>
              </div>
            </div>
          </div>

          {/* Cover option (only visible for non-Palette types) */}
          {category !== 'Curated Palette' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Foto de Capa
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setUseCustomCover(false)}
                    className={`text-xs font-bold transition-all ${
                      !useCustomCover ? 'text-primary' : 'text-outline hover:text-primary'
                    }`}
                  >
                    Usar Presets
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseCustomCover(true)}
                    className={`text-xs font-bold transition-all ${
                      useCustomCover ? 'text-primary' : 'text-outline hover:text-primary'
                    }`}
                  >
                    Custom URL
                  </button>
                </div>
              </div>

              {!useCustomCover ? (
                <div className="grid grid-cols-3 gap-3">
                  {PRESET_VERSIONS_COVERS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setSelectedCover(preset.url)}
                      className={`relative aspect-[3/2] rounded-xl overflow-hidden border-2 transition-all group ${
                        selectedCover === preset.url ? 'border-primary shadow-lg ring-2 ring-primary-fixed-dim/50' : 'border-transparent hover:border-outline-variant'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-end p-2">
                        <span className="text-[10px] text-white font-semibold truncate leading-none">
                          {preset.name}
                        </span>
                      </div>
                      {selectedCover === preset.url && (
                        <div className="absolute top-1 right-1 bg-primary text-white p-0.5 rounded-full">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="relative">
                  <Image className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                  <input
                    type="url"
                    value={customCoverUrl}
                    onChange={(e) => setCustomCoverUrl(e.target.value)}
                    placeholder="https://exemplo.com/sua-imagem.jpg"
                    className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-all text-sm text-on-surface"
                  />
                </div>
              )}
            </div>
          )}

          {/* Submit and cancel */}
          <div className="flex gap-4 pt-4 border-t border-outline-variant/60">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-outline-variant rounded-xl text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-primary to-secondary text-on-primary rounded-xl text-sm font-semibold shadow-lg hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Publicar</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
