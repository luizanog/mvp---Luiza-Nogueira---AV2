/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Author {
  name: string;
  avatarUrl: string;
}

export interface Trend {
  id: string;
  title: string;
  description: string;
  category: string;
  coverUrl: string;
  authors: Author[];
  collaborationText: string;
  date: string;
  views: number;
  likes: number;
  isBookmarked: boolean;
  gridSpan: 'featured' | 'medium' | 'small-briefing' | 'small-palette';
  colors?: string[]; // for palette cards
  badgeText?: string; // e.g., "Destaque"
}

export interface CuratedPalette {
  id: string;
  name: string;
  colors: string[];
}

export interface UserProfile {
  name: string;
  email: string;
  memberType: 'Premium Member' | 'Basic Member' | 'Contributor';
  avatarUrl: string;
  bio?: string;
  language?: 'pt-BR' | 'en';
}

export type ViewTab = 'home' | 'trending' | 'collections' | 'settings';
export type AuthState = 'login' | 'signup' | 'authenticated';
