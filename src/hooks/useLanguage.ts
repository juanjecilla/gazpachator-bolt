import { useState } from 'react';
import { StorageService } from '../services/StorageService';
import { translations } from '../data/translations';
import type { TranslationKey } from '../data/translations';
import type { Language } from '../types/Recipe';

export const useLanguage = () => {
  const storage = StorageService.getInstance();
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = storage.getLanguage() as Language;
    if (savedLanguage) {
      return savedLanguage;
    }
    // Detect browser language
    const browserLang = navigator.language.split('-')[0] as Language;
    return translations[browserLang] ? browserLang : 'en';
  });

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    storage.setLanguage(newLanguage);
  };

  const t = (key: TranslationKey): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return { language, changeLanguage, t };
};
