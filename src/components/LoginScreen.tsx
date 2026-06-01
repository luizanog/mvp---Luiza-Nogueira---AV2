/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, LogIn, ArrowRight, Chrome, Apple, User, Sparkles } from 'lucide-react';
import { AuthState } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (email: string, name: string) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [authState, setAuthState] = useState<AuthState>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!email) {
      setErrorMsg('Por favor, insira seu endereço de e-mail.');
      return;
    }
    if (authState === 'login' && !password) {
      setErrorMsg('Por favor, digite sua senha.');
      return;
    }
    if (authState === 'signup' && !name) {
      setErrorMsg('Por favor, digite seu nome.');
      return;
    }

    setLoading(true);
    // Simulate a premium authentic experience
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(
        email,
        authState === 'signup' ? name : email.split('@')[0]
      );
    }, 900);
  };

  const handleSocialLogin = (platform: 'Google' | 'Apple') => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(
        platform === 'Google' ? 'design.innovator@gmail.com' : 'apple.creative@icloud.com',
        platform === 'Google' ? 'Trend Explorer' : 'Creative Director'
      );
    }, 700);
  };

  return (
    <div className="mesh-gradient min-h-screen flex flex-col justify-between font-sans selection:bg-primary-container selection:text-on-primary-container">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Placeholder Main Body */}
      <main className="flex-grow flex items-center justify-center px-4 md:px-12 py-16 z-10">
        <div id="login-container" className="w-full max-w-[440px]">
          
          {/* Branding with spring entry */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="text-center mb-10"
          >
            <h1 className="font-display text-5xl font-extrabold text-primary tracking-tighter mb-2">
              TrendVision
            </h1>
            <p className="text-base text-on-surface-variant font-medium tracking-wide">
              The future of inspiration, curated.
            </p>
          </motion.div>

          {/* Login Card Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card rounded-[24px] p-8 md:p-10 shadow-2xl relative border border-primary/10 relative"
          >
            <AnimatePresence mode="wait">
              {authState === 'login' ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.25 }}
                >
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Status/Error Alert */}
                    {errorMsg && (
                      <div className="p-3 bg-error-container/80 text-error rounded-xl text-xs font-semibold border border-error/10 text-center animate-bounce">
                        {errorMsg}
                      </div>
                    )}

                    {/* Email Field */}
                    <div className="space-y-2">
                      <label 
                        id="email-label"
                        className="font-medium text-sm text-on-surface-variant block tracking-tight" 
                        htmlFor="email"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-outline transition-all text-sm text-on-surface placeholder:text-outline/50"
                          placeholder="name@company.com"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label 
                          id="password-label"
                          className="font-medium text-sm text-on-surface-variant block tracking-tight" 
                          htmlFor="password"
                        >
                          Password
                        </label>
                        <button
                          id="forgot-password"
                          type="button"
                          onClick={() => alert('Para redefinir sua senha, entre em contato com support@trendvision.io')}
                          className="text-xs font-bold text-primary hover:text-secondary hover:underline transition-colors focus:outline-none"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                        <input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-outline transition-all text-sm text-on-surface placeholder:text-outline/50"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>

                    {/* Sign In Button */}
                    <motion.button
                      id="signin-submit-btn"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={loading}
                      className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-on-primary font-semibold text-[15px] rounded-xl shadow-lg hover:shadow-primary/25 disabled:opacity-70 transition-all cursor-pointer flex items-center justify-center gap-2"
                      type="submit"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Sign In</span>
                          <LogIn className="w-4 h-4 ml-0.5" />
                        </>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Status/Error Alert */}
                    {errorMsg && (
                      <div className="p-3 bg-error-container/80 text-error rounded-xl text-xs font-semibold border border-error/10 text-center animate-bounce">
                        {errorMsg}
                      </div>
                    )}

                    {/* Full Name Field */}
                    <div className="space-y-2">
                      <label 
                        id="signup-name-label"
                        className="font-medium text-sm text-on-surface-variant block tracking-tight" 
                        htmlFor="name"
                      >
                        Seu Nome Completo
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                        <input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-outline transition-all text-sm text-on-surface placeholder:text-outline/50"
                          placeholder="Ex: Clara Mendes"
                          required
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <label 
                        id="signup-email-label"
                        className="font-medium text-sm text-on-surface-variant block tracking-tight" 
                        htmlFor="signup-email"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                        <input
                          id="signup-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-outline transition-all text-sm text-on-surface placeholder:text-outline/50"
                          placeholder="name@company.com"
                          required
                        />
                      </div>
                    </div>

                    {/* Create Account Button */}
                    <motion.button
                      id="signup-submit-btn"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={loading}
                      className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-on-primary font-semibold text-[15px] rounded-xl shadow-lg hover:shadow-primary/20 disabled:opacity-70 transition-all cursor-pointer flex items-center justify-center gap-2"
                      type="submit"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Criar Conta</span>
                          <Sparkles className="w-4 h-4 ml-0.5" />
                        </>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Divider */}
            <div className="relative py-6 my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/60"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/80 backdrop-blur-md px-4 text-outline font-semibold tracking-wider text-[10px]">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-4">
              <button
                id="google-login-btn"
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="flex items-center justify-center gap-2 py-3 border border-outline-variant/60 rounded-xl hover:bg-surface-container-low active:bg-surface-container/60 transition-colors group cursor-pointer"
              >
                <img
                  alt="Google"
                  className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyZu_f2nZIO1dHZDrGfgn_nDMyP_eBETgXDIRG8o4QOyW67-kDvHW1aZeLM9p6VJt4EHsLG0Mu5phYKUXSTkP0sJ31Y9fSedVP6sAYRCt4TDXfjUV_3xfB5yrUKHM-nLca1x6JA_xjgwGqey_3EukVZexdZtg_32TAuidyvl3RpXFEZVEnmlqUMMHMkmiAb_jLwZ9Kh5YLpgbtMC5DG3elIQXr9lOFg8dDb2hlY2wqYR4FDzDIZM3zVtlathEupRwqd9WmgaBlAkc"
                />
                <span className="font-semibold text-sm text-on-surface-variant">Google</span>
              </button>
              <button
                id="apple-login-btn"
                type="button"
                onClick={() => handleSocialLogin('Apple')}
                className="flex items-center justify-center gap-2 py-3 border border-outline-variant/60 rounded-xl hover:bg-surface-container-low active:bg-surface-container/60 transition-colors group cursor-pointer"
              >
                <Apple className="w-5 h-5 text-on-surface-variant opacity-80 group-hover:opacity-100 transition-opacity" />
                <span className="font-semibold text-sm text-on-surface-variant">Apple</span>
              </button>
            </div>

            {/* Switch Mode Footer Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-on-surface-variant font-medium">
                {authState === 'login' ? (
                  <>
                    Don't have an account?{' '}
                    <button
                      id="toggle-signup-mode"
                      type="button"
                      onClick={() => setAuthState('signup')}
                      className="text-primary font-bold hover:underline transition-all cursor-pointer inline-block ml-1"
                    >
                      Create account
                    </button>
                  </>
                ) : (
                  <>
                    Já possui um perfil?{' '}
                    <button
                      id="toggle-login-mode"
                      type="button"
                      onClick={() => setAuthState('login')}
                      className="text-primary font-bold hover:underline transition-all cursor-pointer inline-block ml-1"
                    >
                      Realizar Login
                    </button>
                  </>
                )}
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 z-10 border-t border-primary/5 bg-white/40 backdrop-blur-md">
        <div className="text-on-surface-variant font-semibold text-xs tracking-tight">
          © 2024 TrendVision Platform. All rights reserved.
        </div>
        <nav className="flex gap-6">
          <a href="#" className="font-semibold text-xs text-on-surface-variant hover:text-primary transition-all">Terms of Service</a>
          <a href="#" className="font-semibold text-xs text-on-surface-variant hover:text-primary transition-all">Privacy Policy</a>
          <a href="#" className="font-semibold text-xs text-on-surface-variant hover:text-primary transition-all">Contact Support</a>
        </nav>
      </footer>
    </div>
  );
}
