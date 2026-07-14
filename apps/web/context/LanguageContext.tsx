'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr');

  useEffect(() => {
    const saved = localStorage.getItem('opep-language') as Language | null;
    if (saved && (saved === 'fr' || saved === 'en')) {
      setLanguageState(saved);
    }
  }, []);

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('opep-language', lang);
    window.location.reload();
  }, []);

  const dictionary: Record<string, Record<string, string>> = {
  };

  const t = useCallback(
    (key: string) => {
      return dictionary[language]?.[key] || dictionary['fr']?.[key] || key;
    },
    [language],
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    if (typeof window === 'undefined') {
      return {
        language: 'fr' as Language,
        setLanguage: () => {},
        t: (key: string) => key,
      };
    }
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
