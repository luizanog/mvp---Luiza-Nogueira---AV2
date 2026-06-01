/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, Sparkles, LayoutGrid, Settings, PlusCircle, Search, 
  Filter, Bookmark, ArrowRight, Compass, Heart, Eye, 
  Layers, Smile, MapPin, Globe, Share2, Palette, Copy, Check, LogOut
} from 'lucide-react';
import { Trend, UserProfile, ViewTab } from '../types';
import { INITIAL_TRENDS, POPULAR_TAGS } from '../data';
import TrendingView from './TrendingView';
import CollectionsView from './CollectionsView';
import SettingsView from './SettingsView';
import ContributeTrendModal from './ContributeTrendModal';

interface MainScreenProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onLogOut: () => void;
}

export default function MainScreen({ userProfile, onUpdateProfile, onLogOut }: MainScreenProps) {
  const [trends, setTrends] = useState<Trend[]>(INITIAL_TRENDS);
  const [activeTab, setActiveTab] = useState<ViewTab>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterSortBy, setFilterSortBy] = useState<'default' | 'views' | 'likes' | 'title'>('default');
  const [isContributeOpen, setIsContributeOpen] = useState(false);
  const [selectedTrendDetail, setSelectedTrendDetail] = useState<Trend | null>(null);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  // Filter trends based on search and selected tags
  const filteredTrends = useMemo(() => {
    let result = [...trends];

    // Filter by tags
    if (selectedTag) {
      const cleanTag = selectedTag.replace('#', '').toLowerCase();
      result = result.filter(
        (t) => t.category.toLowerCase() === cleanTag || t.title.toLowerCase().includes(cleanTag)
      );
    }

    // Filter by query search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
      );
    }

    // Sort order
    if (filterSortBy === 'views') {
      result.sort((a, b) => b.views - a.views);
    } else if (filterSortBy === 'likes') {
      result.sort((a, b) => b.likes - a.likes);
    } else if (filterSortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [trends, searchQuery, selectedTag, filterSortBy]);

  // Handle bookmark toggle
  const handleToggleBookmark = (id: string) => {
    setTrends((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isBookmarked: !t.isBookmarked } : t))
    );
    // synchronize if detailed modal is open
    if (selectedTrendDetail && selectedTrendDetail.id === id) {
      setSelectedTrendDetail((prev) => prev ? { ...prev, isBookmarked: !prev.isBookmarked } : null);
    }
  };

  // List of saved trends
  const bookmarkedTrends = useMemo(() => trends.filter((t) => t.isBookmarked), [trends]);

  // Adding contributed trends
  const handleAddTrend = (newTrend: Trend) => {
    setTrends((prev) => [newTrend, ...prev]);
  };

  // Helper to copy color hex representation to clipboard
  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  return (
    <div id="main-application" className="mesh-gradient min-h-screen flex flex-col font-sans text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      
      {/* 1. Header Sticky App Bar */}
      <nav className="fixed top-0 w-full z-40 flex justify-between items-center px-6 md:px-8 h-20 bg-white/90 backdrop-blur-xl border-b border-primary/10 shadow-sm">
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <span className="font-display text-2xl font-extrabold text-primary dark:text-inverse-primary tracking-tighter group-hover:scale-[1.01] transition-transform">
            TrendVision
          </span>
          <span className="hidden sm:inline-block text-[9px] uppercase tracking-widest font-extrabold text-secondary bg-secondary-fixed px-2 py-0.5 rounded-full">
            v2.4
          </span>
        </div>

        {/* Global tabs for desktop navigation */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => { setActiveTab('home'); setSelectedTag(null); }}
            className={`font-semibold text-sm transition-all pb-1 border-b-2 cursor-pointer ${
              activeTab === 'home'
                ? 'text-primary border-primary font-bold'
                : 'text-on-surface-variant border-transparent hover:text-primary hover:border-primary/40'
            }`}
          >
            Discover
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`font-semibold text-sm transition-all pb-1 border-b-2 cursor-pointer ${
              activeTab === 'trending'
                ? 'text-primary border-primary font-bold'
                : 'text-on-surface-variant border-transparent hover:text-primary hover:border-primary/40'
            }`}
          >
            Archive (Analytics)
          </button>
          <button
            onClick={() => setActiveTab('collections')}
            className={`font-semibold text-sm transition-all pb-1 border-b-2 cursor-pointer ${
              activeTab === 'collections'
                ? 'text-primary border-primary font-bold'
                : 'text-on-surface-variant border-transparent hover:text-primary hover:border-primary/40'
            }`}
          >
            Community (Saved)
          </button>
        </div>

        {/* Quick action profile triggers */}
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={() => setActiveTab('settings')}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/10 to-secondary/15 flex items-center justify-center text-primary border border-primary/10 cursor-pointer hover:scale-105 active:scale-95 transition-all"
          >
            <span className="text-xs font-extrabold uppercase">{userProfile.name.charAt(0)}</span>
          </button>
        </div>
      </nav>

      {/* 2. Side navigation and main canvas wrapper */}
      <div className="flex flex-grow pt-20">
        
        {/* Left Drawer Navigation */}
        <aside className="fixed left-0 top-20 h-[calc(100vh-80px)] z-30 flex flex-col p-6 bg-white shadow-lg w-64 border-r border-outline-variant/30 shrink-0 hidden md:flex">
          {/* Active Profile Info */}
          <div className="flex items-center gap-3 mb-8 px-1">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0 shadow-inner font-extrabold">
              <Sparkles className="w-5 h-5 text-secondary" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-[14px] text-on-surface truncate leading-tight">
                {userProfile.name}
              </p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-extrabold leading-none mt-1">
                {userProfile.memberType}
              </p>
            </div>
          </div>

          <nav className="flex flex-col gap-2 flex-grow">
            <button
              onClick={() => { setActiveTab('home'); setSelectedTag(null); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all ${
                activeTab === 'home'
                  ? 'bg-primary text-on-primary shadow-md translate-x-1'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Início</span>
            </button>

            <button
              onClick={() => setActiveTab('trending')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all ${
                activeTab === 'trending'
                  ? 'bg-primary text-on-primary shadow-md translate-x-1'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
              }`}
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Trending</span>
            </button>

            <button
              onClick={() => setActiveTab('collections')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all ${
                activeTab === 'collections'
                  ? 'bg-primary text-on-primary shadow-md translate-x-1'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Collections</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all ${
                activeTab === 'settings'
                  ? 'bg-primary text-on-primary shadow-md translate-x-1'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>

          {/* Quick Action Contribute tag trigger */}
          <button
            onClick={() => setIsContributeOpen(true)}
            className="mt-auto bg-gradient-to-r from-primary to-secondary text-on-primary py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-md active:scale-95 cursor-pointer text-xs uppercase"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span>Contribuir</span>
          </button>
        </aside>

        {/* 3. Main Content Area */}
        <main className="flex-grow md:ml-64 p-6 md:p-12 pb-24 overflow-x-hidden min-h-[calc(100vh-200px)]">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div
                key="home-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="space-y-12"
              >
                {/* Hero design search section */}
                <section className="relative">
                  <div className="hero-gradient rounded-[32px] p-8 md:p-12 flex flex-col items-center text-center text-on-primary shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(at_0%_0%,rgba(255,255,255,0.15)_0px,transparent_50%)]" />
                    
                    <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-4 max-w-3xl leading-tight tracking-tight text-white animate-in fade-in slide-in-from-top-3 duration-500">
                      Descubra o Futuro do Design Visual
                    </h2>
                    <p className="text-base md:text-[18px] text-on-primary-container max-w-2xl mb-8 leading-relaxed">
                      Explore as tendências que estão moldando a próxima geração de interfaces digitais e experiências de marca.
                    </p>

                    {/* Search Field Anchor */}
                    <div className="w-full max-w-2xl relative">
                      <div className="glass-panel rounded-full p-1.5 flex items-center shadow-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
                        <div className="pl-4 text-primary">
                          <Search className="w-5 h-5 text-primary" />
                        </div>
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Busque por palavras-chave (ex: UI, Minimalismo...)"
                          className="bg-transparent border-0 focus:outline-none focus:ring-0 w-full px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/80 font-medium"
                        />

                        {/* Search controls sorting popover */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="bg-primary hover:bg-secondary text-white px-5 py-2.5 rounded-full font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
                          >
                            <Filter className="w-3.5 h-3.5" />
                            <span>Filtrar</span>
                          </button>

                          {/* Filtering Sort Options dropdown */}
                          {isFilterOpen && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                              <div className="absolute right-0 mt-3 bg-white text-on-surface rounded-2xl p-4 shadow-2xl border border-outline-variant/60 w-52 z-50 animate-in fade-in slide-in-from-top-1">
                                <span className="text-[10px] uppercase font-bold text-outline block mb-2">ORDENAR POR</span>
                                <div className="space-y-1">
                                  <button
                                    type="button"
                                    onClick={() => { setFilterSortBy('default'); setIsFilterOpen(false); }}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                                      filterSortBy === 'default' ? 'bg-primary/10 text-primary' : 'hover:bg-surface-container'
                                    }`}
                                  >
                                    Publicação recente
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => { setFilterSortBy('views'); setIsFilterOpen(false); }}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                                      filterSortBy === 'views' ? 'bg-primary/10 text-primary' : 'hover:bg-surface-container'
                                    }`}
                                  >
                                    Crescimento (Visualizações)
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => { setFilterSortBy('likes'); setIsFilterOpen(false); }}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                                      filterSortBy === 'likes' ? 'bg-primary/10 text-primary' : 'hover:bg-surface-container'
                                    }`}
                                  >
                                    Preferidos (Likes)
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => { setFilterSortBy('title'); setIsFilterOpen(false); }}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                                      filterSortBy === 'title' ? 'bg-primary/10 text-primary' : 'hover:bg-surface-container'
                                    }`}
                                  >
                                    Nome Alfabético
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Popular Tags Capsules */}
                    <div className="mt-8 flex flex-wrap justify-center items-center gap-2">
                      <span className="text-on-primary-container text-xs font-bold mr-1 block py-1">
                        Tags Populares:
                      </span>
                      {POPULAR_TAGS.map((t) => (
                        <button
                          key={t}
                          onClick={() => setSelectedTag(selectedTag === t ? null : t)}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-tight transition-all backdrop-blur-md border ${
                            selectedTag === t
                              ? 'bg-white text-primary border-white'
                              : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                          } cursor-pointer`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                  </div>
                </section>

                {/* Grid Feed section */}
                <section className="space-y-6">
                  
                  {/* Headline content header */}
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="font-display text-2xl font-bold text-on-surface">
                        Tendências Emergentes
                      </h3>
                      <p className="text-sm text-on-surface-variant">
                        Curadoria semanal dos movimentos mais influentes.
                      </p>
                    </div>

                    <button
                      onClick={() => { setActiveTab('trending'); }}
                      className="text-sm font-bold text-primary flex items-center gap-1 hover:gap-1.5 cursor-pointer transition-all"
                    >
                      <span>Ver arquivo completo</span>
                      <ArrowRight className="w-4 h-4 ml-0.5" />
                    </button>
                  </div>

                  {filteredTrends.length === 0 ? (
                    <div className="bg-surface-container-low rounded-3xl p-12 text-center text-on-surface-variant max-w-md mx-auto">
                      <Layers className="w-12 h-12 text-outline-variant mx-auto mb-3" />
                      <p className="text-sm font-semibold">Nenhum insight correspondente para os filtros ativos.</p>
                      <button
                        onClick={() => { setSearchQuery(''); setSelectedTag(null); }}
                        className="text-xs font-bold text-primary underline mt-2 block mx-auto cursor-pointer"
                      >
                        Limpar todos os filtros
                      </button>
                    </div>
                  ) : (
                    /* Bento Grid Representation */
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[280px]">
                      {filteredTrends.map((trend) => {
                        
                        // A: Featured Card (2 columns, 2 rows span)
                        if (trend.gridSpan === 'featured') {
                          return (
                            <div
                              key={trend.id}
                              onClick={() => setSelectedTrendDetail(trend)}
                              className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-[24px] bg-surface-container shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] cursor-pointer"
                            >
                              <img
                                src={trend.coverUrl}
                                alt={trend.title}
                                referrerPolicy="no-referrer"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"></div>
                              
                              {/* Detail trigger icon */}
                              <div className="absolute top-4 right-4 z-10 flex gap-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleBookmark(trend.id);
                                  }}
                                  className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-white hover:text-red-500 transition-colors shadow-md cursor-pointer"
                                >
                                  <Bookmark className={`w-4 h-4 ${trend.isBookmarked ? 'fill-red-500 text-red-500' : ''}`} />
                                </button>
                              </div>

                              <div className="absolute bottom-0 p-6 text-white space-y-3">
                                <div className="flex flex-wrap gap-2">
                                  {trend.badgeText && (
                                    <span className="px-3 py-1 bg-secondary text-white text-[10px] uppercase font-extrabold rounded-full tracking-wider">
                                      {trend.badgeText}
                                    </span>
                                  )}
                                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] uppercase font-extrabold rounded-full tracking-wider">
                                    {trend.category}
                                  </span>
                                </div>
                                <h4 className="font-display text-2xl md:text-3xl font-bold leading-snug">
                                  {trend.title}
                                </h4>
                                <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                                  {trend.description}
                                </p>

                                {/* Authors collaborative stack */}
                                <div className="pt-2 flex items-center gap-2">
                                  <div className="flex -space-x-2">
                                    {trend.authors.map((auth, index) => (
                                      <img
                                        key={auth.name}
                                        src={auth.avatarUrl}
                                        alt={auth.name}
                                        referrerPolicy="no-referrer"
                                        className="w-7 h-7 rounded-full border-2 border-primary-container object-cover"
                                      />
                                    ))}
                                  </div>
                                  <span className="text-[11px] font-medium text-white/90">
                                    {trend.collaborationText}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        // B: Curated Palette Card (1 column, 1 row span)
                        if (trend.gridSpan === 'small-palette') {
                          return (
                            <div
                              key={trend.id}
                              className="md:col-span-1 group relative overflow-hidden rounded-[24px] bg-surface-container-high border border-outline-variant/35 hover:border-primary/20 transition-all p-5 flex flex-col justify-between"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container shrink-0">
                                  <Palette className="w-4 h-4" />
                                </div>
                                <div>
                                  <span className="text-[10px] uppercase font-extrabold tracking-wider block text-outline leading-none">
                                    Curated Palette
                                  </span>
                                  <span className="text-xs font-bold text-on-surface line-clamp-1 block">
                                    {trend.title}
                                  </span>
                                </div>
                                
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleBookmark(trend.id);
                                  }}
                                  className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-outline-variant hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer ml-auto"
                                >
                                  <Bookmark className={`w-3.5 h-3.5 ${trend.isBookmarked ? 'fill-red-500 text-red-500' : ''}`} />
                                </button>
                              </div>

                              <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed mb-4">
                                {trend.description}
                              </p>

                              {/* Colors block preview */}
                              <div className="flex gap-1.5 h-16">
                                {trend.colors?.map((col) => (
                                  <button
                                    key={col}
                                    type="button"
                                    onClick={() => handleCopyColor(col)}
                                    title={`Clique para copiar ${col}`}
                                    style={{ backgroundColor: col }}
                                    className="flex-1 rounded-lg shadow-sm border border-black/5 hover:scale-[1.05] transition-transform cursor-pointer relative"
                                  >
                                    {copiedColor === col && (
                                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] text-white rounded-lg">
                                        <Check className="w-3 h-3" />
                                      </div>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        }

                        // C: Small Briefing Card (1 column, 1 row span)
                        if (trend.gridSpan === 'small-briefing') {
                          return (
                            <div
                              key={trend.id}
                              onClick={() => setSelectedTrendDetail(trend)}
                              className="md:col-span-1 group relative overflow-hidden rounded-[24px] bg-surface-container-high border border-outline-variant/35 hover:border-primary/20 transition-all p-5 flex flex-col justify-between cursor-pointer"
                            >
                              <div className="w-full h-24 rounded-xl overflow-hidden mb-3 bg-surface-container">
                                <img
                                  src={trend.coverUrl}
                                  alt={trend.title}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>

                              <div className="space-y-1">
                                <span className="text-[9px] uppercase font-extrabold text-secondary block">
                                  {trend.category}
                                </span>
                                <h5 className="font-bold text-xs text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                                  {trend.title}
                                </h5>
                                <p className="text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed">
                                  {trend.description}
                                </p>
                              </div>
                            </div>
                          );
                        }

                        // D: Medium Content Card (2 columns, 1 row span)
                        return (
                          <div
                            key={trend.id}
                            onClick={() => setSelectedTrendDetail(trend)}
                            className="md:col-span-2 group relative overflow-hidden rounded-[24px] bg-surface-container shadow-sm hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] cursor-pointer"
                          >
                            <img
                              src={trend.coverUrl}
                              alt={trend.title}
                              referrerPolicy="no-referrer"
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-all"></div>
                            
                            <div className="absolute top-4 right-4 z-10">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleBookmark(trend.id);
                                }}
                                className="w-9 h-9 rounded-full glass-panel flex items-center justify-center text-white hover:text-red-500 hover:bg-white transition-all cursor-pointer"
                              >
                                <Bookmark className={`w-3.5 h-3.5 ${trend.isBookmarked ? 'fill-red-500 text-red-500' : ''}`} />
                              </button>
                            </div>

                            <div className="absolute bottom-4 left-4 text-white space-y-1.5">
                              <span className="text-[9px] font-bold bg-primary/80 px-2.5 py-1 rounded-lg uppercase tracking-wider inline-block">
                                {trend.category}
                              </span>
                              <h4 className="font-display text-lg font-bold">
                                {trend.title}
                              </h4>
                            </div>
                          </div>
                        );

                      })}
                    </div>
                  )}

                </section>
              </motion.div>
            )}

            {activeTab === 'trending' && (
              <motion.div
                key="trending-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <TrendingView />
              </motion.div>
            )}

            {activeTab === 'collections' && (
              <motion.div
                key="collections-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <CollectionsView 
                  bookmarkedTrends={bookmarkedTrends}
                  onToggleBookmark={handleToggleBookmark}
                  onSelectTrend={setSelectedTrendDetail}
                />
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <SettingsView 
                  userProfile={userProfile}
                  onUpdateProfile={onUpdateProfile}
                  onLogOut={onLogOut}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

      </div>

      {/* 4. Global Footer Section */}
      <footer className="w-full py-12 px-6 md:px-12 bg-surface-container-low border-t border-outline-variant/30 z-20 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span 
            onClick={() => setActiveTab('home')}
            className="font-display text-xl font-extrabold text-primary tracking-tighter cursor-pointer"
          >
            TrendVision
          </span>
          <p className="text-xs text-on-surface-variant max-w-sm text-center md:text-left leading-relaxed">
            Elevando a percepção visual e conectando mentes criativas às inovações visuais do amanhã.
          </p>
        </div>

        <div className="flex gap-8">
          <button onClick={() => { setActiveTab('home'); setSelectedTag(null); }} className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-all">Discover</button>
          <button onClick={() => setActiveTab('trending')} className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-all">Archive</button>
          <button onClick={() => setActiveTab('collections')} className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-all">Saved</button>
          <button onClick={() => setActiveTab('settings')} className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-all">Settings</button>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2 text-right">
          <p className="text-[10px] text-outline font-semibold">
            © 2024 TrendVision Platform. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Globe className="w-4 h-4 text-outline hover:text-primary cursor-pointer transition-all" />
            <Share2 className="w-4 h-4 text-outline hover:text-primary cursor-pointer transition-all" />
          </div>
        </div>
      </footer>

      {/* 5. Contribute Modal trigger */}
      <AnimatePresence>
        {isContributeOpen && (
          <ContributeTrendModal
            userName={userProfile.name}
            onClose={() => setIsContributeOpen(false)}
            onAddTrend={handleAddTrend}
          />
        )}
      </AnimatePresence>

      {/* 6. Trend Interactive Detail Drawer Modal */}
      <AnimatePresence>
        {selectedTrendDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTrendDetail(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-xl shadow-2xl relative border border-primary/10 overflow-y-auto max-h-[85vh] z-10"
            >
              <button
                onClick={() => setSelectedTrendDetail(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-outline-variant hover:bg-surface-container hover:text-primary cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                {selectedTrendDetail.category === 'Curated Palette' ? (
                  <div className="bg-surface-container-low rounded-2xl p-6 flex flex-col justify-center h-48 border border-outline-variant/30">
                    <span className="text-[10px] bg-primary/20 text-primary uppercase font-bold px-3 py-1 rounded-full w-max mb-6">
                      Paleta Criativa
                    </span>
                    <div className="flex gap-3 h-20">
                      {selectedTrendDetail.colors?.map((col) => (
                        <button
                          key={col}
                          type="button"
                          onClick={() => handleCopyColor(col)}
                          style={{ backgroundColor: col }}
                          className="flex-1 rounded-xl shadow border border-black/5 relative hover:scale-105 transition-transform"
                        >
                          {copiedColor === col && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10.5px] text-white rounded-xl">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[16/10] rounded-2xl overflow-hidden relative shadow bg-surface-container">
                    <img
                      src={selectedTrendDetail.coverUrl}
                      alt={selectedTrendDetail.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-[10px] uppercase font-bold rounded-full shadow">
                      {selectedTrendDetail.category}
                    </span>
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="font-display text-2xl font-bold text-on-surface">
                    {selectedTrendDetail.title}
                  </h3>
                  
                  {/* Views / stats details */}
                  <div className="flex items-center gap-4 text-xs text-on-surface-variant font-medium">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-primary" />
                      {selectedTrendDetail.views} visualizações
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-secondary" />
                      {selectedTrendDetail.likes} curtidas
                    </span>
                    <span className="bg-surface-container px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                      {selectedTrendDetail.date}
                    </span>
                  </div>

                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {selectedTrendDetail.description}
                  </p>
                </div>

                {/* Extended design review briefing */}
                <div className="p-4 bg-surface-container-low/60 rounded-2xl border border-primary/5 space-y-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-primary block">Análise Editorial</span>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Este conceito representa uma mudança em direção à expressividade imersiva. Através de contrastes intencionais e refinamento das camadas translucent, oferece soluções ergonômicas para interações complexas de dados digitais.
                  </p>
                </div>

                {/* Modal footer actions */}
                <div className="flex items-center justify-between pt-4 border-t border-outline-variant/50">
                  <span className="text-xs text-on-surface-variant font-semibold">
                    {selectedTrendDetail.collaborationText}
                  </span>

                  <button
                    onClick={() => handleToggleBookmark(selectedTrendDetail.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold shadow-md transition-all cursor-pointer ${
                      selectedTrendDetail.isBookmarked
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{selectedTrendDetail.isBookmarked ? 'Salvo em Collections' : 'Salvar Insight'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Simple temporary X component declaration fallback for modals
function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
