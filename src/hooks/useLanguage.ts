import { useState, useEffect } from 'react';
import { StorageService } from '../services/StorageService';
import { translations } from '../data/translations';
import type { Language } from '../types/Recipe';

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>('en');
  const storage = StorageService.getInstance();

  useEffect(() => {
    const savedLanguage = storage.getLanguage() as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0] as Language;
      if (translations[browserLang]) {
        setLanguage(browserLang);
      }
    }
  }, [storage]);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    storage.setLanguage(newLanguage);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return { language, changeLanguage, t };
};
