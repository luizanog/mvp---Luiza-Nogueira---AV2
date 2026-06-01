/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import MainScreen from './components/MainScreen';
import { UserProfile } from './types';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Trend Discoverer',
    email: 'name@company.com',
    memberType: 'Premium Member',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOvSUgQynIPxIQhZqq72rFnKXDLEJfVubeHzEmyXFjsFMAkFE-JOBj6iWKug2T_bYiPiuTZnAJPl_MzEsaFtQNM261zZTXwfPxKRr-ZbTLHfbj4T_q_hEl2dvF_x1nNNYco6kTbdOXEXUB6DqOQ8EW21TF1YyptlmDFk2vg6qX2aBudGehuBXfps0xM6UXVP5wm_HKQfhIzu7EULcFwShnpqO56qwaNvTIayyUdR_9h2SL0MR4vvFCbuG_Xy5Q4sA1ZnWPQX0qy7A',
    bio: 'Curador criativo apaixonado por interfaces modernas e linguagens de design que inspiram.',
    language: 'pt-BR'
  });

  const handleLoginSuccess = (email: string, name: string) => {
    setUserProfile((prev) => ({
      ...prev,
      email,
      name: name || prev.name
    }));
    setIsAuthenticated(true);
  };

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
  };

  const handleLogOut = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {!isAuthenticated ? (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      ) : (
        <MainScreen 
          userProfile={userProfile} 
          onUpdateProfile={handleUpdateProfile} 
          onLogOut={handleLogOut} 
        />
      )}
    </div>
  );
}

