import { useState, useEffect } from 'react';
import { StorageService } from '../services/StorageService';
import type { Theme } from '../types/Recipe';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const storage = StorageService.getInstance();

  useEffect(() => {
    const savedTheme = storage.getTheme() as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [storage]);

  useEffect(() => {
    const applyTheme = () => {
      let actualTheme: 'light' | 'dark';

      if (theme === 'system') {
        actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        actualTheme = theme as 'light' | 'dark';
      }

      setResolvedTheme(actualTheme);

      // Remove existing theme classes
      document.documentElement.classList.remove('light', 'dark');
      // Add the current theme class
      document.documentElement.classList.add(actualTheme);

      // Also handle the 'dark' class for Tailwind compatibility
      if (actualTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [theme]);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    storage.setTheme(newTheme);
  };

  return { theme, resolvedTheme, changeTheme };
};
