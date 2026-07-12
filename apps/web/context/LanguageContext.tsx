'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const nextIntlT = useTranslations();
  const nextIntlLocale = useLocale() as Language;
  const [language, setLanguageState] = useState<Language>('fr');

  // Sync from next-intl locale on mount
  useEffect(() => {
    const saved = localStorage.getItem('opep-language') as Language | null;
    if (saved && (saved === 'fr' || saved === 'en')) {
      setLanguageState(saved);
    } else if (nextIntlLocale === 'en' || nextIntlLocale === 'fr') {
      setLanguageState(nextIntlLocale);
    }
  }, [nextIntlLocale]);

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('opep-language', lang);
    // Set next-intl cookie so middleware picks it up on next navigation
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    // Force a hard refresh so the server side re-renders with the new locale
    window.location.reload();
  }, []);

  const t = useCallback(
    (key: string) => {
      try {
        return nextIntlT(key);
      } catch {
        // Fallback: try to resolve the key from the inline dictionary
        const fallback: Record<string, Record<string, string>> = {
          fr: {
            'nav.dashboard': 'Tableau de bord',
            'nav.agencies': 'Agences',
            'nav.trips': 'Voyages',
            'nav.buses': 'Bus',
            'nav.staff': 'Personnel',
            'nav.reports': 'Rapports',
            'nav.settings': 'Paramètres',
            'nav.help': "Centre d'aide",
            'nav.reservations': 'Réservations',
            'nav.tickets': 'Tickets',
            'nav.payments': 'Paiements',
            'nav.subscriptions': 'Abonnements',
            'nav.incidents': 'Incidents',
            'nav.scanner': 'Scanner QR',
            'nav.tracking': 'Suivi GPS',
            'nav.notifications': 'Notifications',
            'nav.profile': 'Profil',
            'nav.admin': 'Administration',
            'nav.companies': 'Compagnies',
            'header.search': 'Rechercher...',
            'header.logout': 'Déconnexion',
            'header.notifications': 'Notifications',
            'common.view_all': 'Voir tout',
            'common.save': 'Enregistrer',
            'common.loading': 'Chargement...',
            'staff.add': "Ajouter un employé",
            'staff.title': 'Personnel',
          },
          en: {
            'nav.dashboard': 'Dashboard',
            'nav.agencies': 'Agencies',
            'nav.trips': 'Trips',
            'nav.buses': 'Buses',
            'nav.staff': 'Staff',
            'nav.reports': 'Reports',
            'nav.settings': 'Settings',
            'nav.help': 'Help Center',
            'nav.reservations': 'Reservations',
            'nav.tickets': 'Tickets',
            'nav.payments': 'Payments',
            'nav.subscriptions': 'Subscriptions',
            'nav.incidents': 'Incidents',
            'nav.scanner': 'QR Scanner',
            'nav.tracking': 'GPS Tracking',
            'nav.notifications': 'Notifications',
            'nav.profile': 'Profile',
            'nav.admin': 'Administration',
            'nav.companies': 'Companies',
            'header.search': 'Search...',
            'header.logout': 'Logout',
            'header.notifications': 'Notifications',
            'common.view_all': 'View All',
            'common.save': 'Save',
            'common.loading': 'Loading...',
            'staff.add': 'Add Employee',
            'staff.title': 'Staff',
          },
        };
        return fallback[language]?.[key] || fallback['fr']?.[key] || key;
      }
    },
    [nextIntlT, language],
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
