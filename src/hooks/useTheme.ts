import { useState, useEffect } from 'react';
import { StorageService } from '../services/StorageService';
import type { Theme } from '../types/Recipe';

export const useTheme = () => {
  const storage = StorageService.getInstance();
  const [theme, setTheme] = useState<Theme>(() => (storage.getTheme() as Theme) || 'system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

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

  // The printed recipe sheet is always light/ink-friendly, regardless of the
  // active theme: dark backgrounds and pale text waste ink and read poorly on
  // paper. Drop the `dark` class only for the duration of printing (covers
  // both the in-app print button and the browser's native Ctrl+P / File >
  // Print), then restore whatever the resolved theme actually is.
  useEffect(() => {
    const handleBeforePrint = () => {
      document.documentElement.classList.remove('dark');
    };
    const handleAfterPrint = () => {
      document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [resolvedTheme]);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    storage.setTheme(newTheme);
  };

  return { theme, resolvedTheme, changeTheme };
};
