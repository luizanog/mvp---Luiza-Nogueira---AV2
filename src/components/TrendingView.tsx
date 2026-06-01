/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Users, Eye, Sparkles, Award, Zap, ChevronUp, Clock } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

function MetricCard({ title, value, change, isPositive, icon }: MetricCardProps) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/50 p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block">
          {title}
        </span>
        <h4 className="font-display text-2xl font-bold text-on-surface">
          {value}
        </h4>
        <div className="flex items-center gap-1">
          <span className={`text-xs font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
          <span className="text-[10px] text-outline">v.s. semana anterior</span>
        </div>
      </div>
      <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
        {icon}
      </div>
    </div>
  );
}

export default function TrendingView() {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const hotKeywords = [
    { tag: '#Glassmorphism', score: 98, trend: '+24%', count: '2.4k posts' },
    { tag: '#BentoGrid', score: 92, trend: '+15%', count: '1.9k posts' },
    { tag: '#NeoBrutalism', score: 85, trend: '+8%', count: '1.2k posts' },
    { tag: '#Minimalismo', score: 78, trend: '+3%', count: '3.1k posts' },
    { tag: '#Abstract3D', score: 75, trend: '+12%', count: '920 posts' },
    { tag: '#Skeuomorphism', score: 45, trend: '-4%', count: '350 posts' }
  ];

  return (
    <div className="space-y-8 font-sans animate-in fade-in duration-500">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/5 pb-6">
        <div>
          <h2 className="font-display text-3xl font-bold text-on-surface">
            Movimentos em Alta
          </h2>
          <p className="text-sm text-on-surface-variant pr-2">
            Análise em tempo real de interesse criativo, busca consolidada e adoção do design system.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-surface-container rounded-xl p-1 shrink-0 self-start">
          {(['daily', 'weekly', 'monthly'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all capitalize cursor-pointer ${
                selectedPeriod === period
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {period === 'daily' ? 'Diário' : period === 'weekly' ? 'Semanal' : 'Mensal'}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Inspirations Indexed"
          value="4,820"
          change="+12.4%"
          isPositive={true}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <MetricCard
          title="Curators Online"
          value="142"
          change="+8.3%"
          isPositive={true}
          icon={<Users className="w-5 h-5" />}
        />
        <MetricCard
          title="Weekly Trend Clicks"
          value="24.8k"
          change="+18.5%"
          isPositive={true}
          icon={<Eye className="w-5 h-5" />}
        />
        <MetricCard
          title="Design Pulse Eco"
          value="98.2%"
          change="+0.4%"
          isPositive={true}
          icon={<Zap className="w-5 h-5" />}
        />
      </div>

      {/* Layout Grid For Tag Growth & Pulse Wave */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Hot trends rating */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/50 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            <h3 className="font-display text-lg font-bold text-on-surface">
              Curadoria de Crescimento de Tags
            </h3>
          </div>

          <div className="space-y-4">
            {hotKeywords.map((item, index) => (
              <div key={item.tag} className="flex items-center justify-between py-2 border-b border-outline-variant/30 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-outline w-5">
                    #{index + 1}
                  </span>
                  <div>
                    <span className="text-sm font-semibold text-primary hover:underline cursor-pointer block">
                      {item.tag}
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      {item.count}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  {/* Visual Bar representation */}
                  <div className="hidden sm:block w-32 bg-surface-container-low rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="bg-gradient-to-r from-primary to-secondary h-full rounded-full"
                    />
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-on-surface block flex items-center justify-end gap-1">
                      <ChevronUp className="w-3.5 h-3.5 text-green-600 inline shrink-0" />
                      {item.trend}
                    </span>
                    <span className="text-[10px] text-outline uppercase tracking-wider font-extrabold">
                      Score: {item.score}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Highlight Card */}
        <div className="flex flex-col justify-between bg-gradient-to-br from-primary to-secondary text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
          {/* Overlay glow */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-white/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-[-10px] left-[-10px] w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] uppercase font-bold tracking-widest inline-block">
              Predição IA
            </span>
            <div className="space-y-1">
              <h4 className="font-display text-xl font-bold tracking-tight">
                Explosão do Glassmorphism 3D
              </h4>
              <p className="text-xs text-white/80 leading-relaxed">
                Nossos modelos preditivos indicam uma alta de 42% no interesse de camadas translúcidas sobrepostas com iluminação neon focalizada nas próximas seis semanas.
              </p>
            </div>
          </div>

          <div className="pt-6 relative z-10 space-y-4">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl space-y-2 border border-white/10">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/70 flex items-center gap-1 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-white/95" />
                  Próxima Janela
                </span>
                <span className="font-bold text-[#ffd0d2]">Em Andamento</span>
              </div>
              <div className="text-sm font-bold">
                Q3 Creative Briefings
              </div>
            </div>

            <button
              onClick={() => alert('Briefing premium agendado para o seu e-mail!')}
              className="w-full bg-white text-primary py-3 rounded-xl text-xs font-bold text-center hover:bg-opacity-95 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              Receber Briefing Premium
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
