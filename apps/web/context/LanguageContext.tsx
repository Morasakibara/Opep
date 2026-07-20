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
    document.documentElement.lang = lang;
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const dictionary: Record<string, Record<string, string>> = {
    fr: {
      'dashboard.title': 'Tableau de bord',
      'dashboard.subtitle': 'Aperçu des performances de votre plateforme.',
      'companies': 'Compagnies',
      'centres': 'Centres',
      'trips': 'Trajets',
      'buses': 'Bus',
      'employees': 'Employés',
      'drivers': 'Conducteurs',
      'payments': 'Paiements',
      'reports': 'Rapports',
      'tracking': 'Suivi GPS',
      'schedules': 'Horaires',
      'seats': 'Sièges',
      'billings': 'Factures',
      'offline_scans': 'Scans hors ligne',
      'messages': 'Messages',
      'notifications': 'Notifications',
      'incidents': 'Incidents',
      'complaints': 'Réclamations',
      'reviews': 'Avis clients',
      'subscriptions': 'Abonnements',
      'settings': 'Paramètres',
      'search': 'Rechercher...',
      'search_trip': 'Rechercher un trajet...',
      'search_employee': 'Rechercher un employé...',
      'search_invoice': 'Rechercher une facture...',
      'search_message': 'Rechercher un message...',
      'search_complaint': 'Rechercher une réclamation...',
      'loading': 'Chargement...',
      'error_retry': 'Réessayer',
      'no_data': 'Aucune donnée',
    },
    en: {
      'dashboard.title': 'Dashboard',
      'dashboard.subtitle': 'Overview of your platform performance.',
      'companies': 'Companies',
      'centres': 'Centres',
      'trips': 'Trips',
      'buses': 'Buses',
      'employees': 'Employees',
      'drivers': 'Drivers',
      'payments': 'Payments',
      'reports': 'Reports',
      'tracking': 'GPS Tracking',
      'schedules': 'Schedules',
      'seats': 'Seats',
      'billings': 'Invoices',
      'offline_scans': 'Offline Scans',
      'messages': 'Messages',
      'notifications': 'Notifications',
      'incidents': 'Incidents',
      'complaints': 'Complaints',
      'reviews': 'Reviews',
      'subscriptions': 'Subscriptions',
      'settings': 'Settings',
      'search': 'Search...',
      'search_trip': 'Search a trip...',
      'search_employee': 'Search an employee...',
      'search_invoice': 'Search an invoice...',
      'search_message': 'Search a message...',
      'search_complaint': 'Search a complaint...',
      'loading': 'Loading...',
      'error_retry': 'Retry',
      'no_data': 'No data',
    },
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
