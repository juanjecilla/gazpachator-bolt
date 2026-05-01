import React from 'react';
import { Sun, Moon, Monitor, Globe } from 'lucide-react';
import { Theme, Language } from '../types/Recipe';

interface ThemeLanguageSelectorProps {
  theme: Theme;
  language: Language;
  onThemeChange: (theme: Theme) => void;
  onLanguageChange: (language: Language) => void;
  t: (key: string) => string;
}

export const ThemeLanguageSelector: React.FC<ThemeLanguageSelectorProps> = ({
  theme,
  language,
  onThemeChange,
  onLanguageChange,
  t
}) => {
  const themes: { value: Theme; icon: React.ReactNode; label: string }[] = [
    { value: 'light', icon: <Sun size={16} />, label: t('light') },
    { value: 'dark', icon: <Moon size={16} />, label: t('dark') },
    { value: 'system', icon: <Monitor size={16} />, label: t('system') }
  ];

  const languages: { value: Language; label: string }[] = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' }
  ];

  return (
    <div className="flex flex-wrap gap-4 items-center justify-center">
      <div className="flex items-center gap-2">
        <Sun className="text-amber-600 dark:text-amber-400" size={16} />
        <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
          {t('theme')}:
        </span>
        <div className="flex rounded-md overflow-hidden border border-amber-300 dark:border-amber-600">
          {themes.map((themeOption) => (
            <button
              key={themeOption.value}
              onClick={() => onThemeChange(themeOption.value)}
              className={`px-3 py-1 text-xs flex items-center gap-1 transition-colors
                        ${theme === themeOption.value
                          ? 'bg-amber-600 text-white'
                          : 'bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-700'
                        }`}
            >
              {themeOption.icon}
              <span className="hidden sm:inline">{themeOption.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Globe className="text-amber-600 dark:text-amber-400" size={16} />
        <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
          {t('language')}:
        </span>
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value as Language)}
          className="px-3 py-1 text-xs rounded border border-amber-300 dark:border-amber-600
                   bg-amber-50 dark:bg-amber-800 text-amber-800 dark:text-amber-200
                   focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};