/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, User, Sparkles, Check, ArrowRight, HelpCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onLogOut: () => void;
}

export default function SettingsView({ userProfile, onUpdateProfile, onLogOut }: SettingsViewProps) {
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [bio, setBio] = useState(userProfile.bio || 'Curador criativo apaixonado por interfaces modernas e linguagens de design que inspiram.');
  const [memberType, setMemberType] = useState(userProfile.memberType);
  const [language, setLanguage] = useState(userProfile.language || 'pt-BR');
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      email,
      bio,
      memberType,
      avatarUrl: userProfile.avatarUrl,
      language
    });
    
    setShowSavedMsg(true);
    setTimeout(() => {
      setShowSavedMsg(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 font-sans max-w-2xl animate-in fade-in duration-500">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-primary/5 pb-6">
        <div>
          <h2 className="font-display text-3xl font-bold text-on-surface">
            Configurações e Perfil
          </h2>
          <p className="text-sm text-on-surface-variant pr-2">
            Configure seu perfil de curador, tipo de assinatura, preferências de idioma e controle sua conta.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Save confirmation banner */}
        {showSavedMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-green-50 text-green-800 rounded-xl text-xs font-semibold flex items-center gap-2 border border-green-200"
          >
            <Check className="w-4 h-4 text-green-600 shrink-0" />
            <span>Suas alterações foram salvas com sucesso no banco de dados local!</span>
          </motion.div>
        )}

        {/* Profile Card Section */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-4 border-b border-outline-variant/30 pb-4">
            <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container text-2xl font-extrabold relative shadow-inner">
              {name.charAt(0).toUpperCase()}
              <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-primary border-2 border-white flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-on-surface">{name}</h3>
              <p className="text-xs text-on-surface-variant/90 font-medium capitalize">
                {memberType} • {language === 'pt-BR' ? 'Português' : 'English'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Name Input */}
            <div className="space-y-1">
              <label htmlFor="settings-name" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                Nome de Exibição
              </label>
              <input
                id="settings-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-all text-sm text-on-surface"
              />
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label htmlFor="settings-email" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                Endereço de E-mail
              </label>
              <input
                id="settings-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-all text-sm text-on-surface"
              />
            </div>

            {/* Biography Input */}
            <div className="space-y-1">
              <label htmlFor="settings-bio" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                Mini Biografia / Nota de Inspiração
              </label>
              <textarea
                id="settings-bio"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-all text-sm text-on-surface resize-none"
              />
            </div>
          </div>
        </div>

        {/* System & Languages Setup */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Language preference selection */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="font-display text-sm font-bold text-on-surface">
              Idioma de Preferência
            </h4>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setLanguage('pt-BR')}
                className={`px-4 py-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                  language === 'pt-BR'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-outline-variant hover:bg-surface-container'
                }`}
              >
                <span>Português (pt-BR)</span>
                {language === 'pt-BR' && <Check className="w-4 h-4 shrink-0" />}
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-4 py-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                  language === 'en'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-outline-variant hover:bg-surface-container'
                }`}
              >
                <span>English (US / Global)</span>
                {language === 'en' && <Check className="w-4 h-4 shrink-0" />}
              </button>
            </div>
          </div>

          {/* Premium Tier selection */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="font-display text-sm font-bold text-on-surface">
              Nível da Conta
            </h4>
            <div className="flex flex-col gap-2">
              {(['Premium Member', 'Contributor', 'Basic Member'] as const).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setMemberType(tier)}
                  className={`px-4 py-3 rounded-xl border flex items-center justify-between text-[11px] uppercase tracking-wider font-extrabold transition-all cursor-pointer ${
                    memberType === tier
                      ? 'border-secondary bg-secondary-fixed/30 text-on-secondary-fixed-variant'
                      : 'border-outline-variant hover:bg-surface-container'
                  }`}
                >
                  <span>{tier}</span>
                  {memberType === tier && <div className="w-2 h-2 rounded-full bg-secondary" />}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Form buttons + Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-outline-variant/60">
          <button
            type="button"
            onClick={onLogOut}
            className="px-6 py-3 border border-red-200 text-red-600 rounded-xl text-xs font-bold hover:bg-red-50 transition-all cursor-pointer"
          >
            Desconectar Conta
          </button>

          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-on-primary rounded-xl text-xs font-bold shadow-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer"
          >
            Salvar Alterações
          </button>
        </div>

      </form>
    </div>
  );
}
