import React from 'react';
import { Heart, Coffee } from 'lucide-react';

interface KofiButtonProps {
  t: (key: string) => string;
}

export const KofiButton: React.FC<KofiButtonProps> = ({ t }) => {
  const handleKofiClick = () => {
    window.open('https://ko-fi.com/juanjecilla', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="rounded-lg border border-pink-200 bg-gradient-to-r from-pink-50 to-red-50 p-4 dark:border-pink-700 dark:from-pink-900/20 dark:to-red-900/20">
      <div className="mb-3 text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <Heart className="text-pink-600 dark:text-pink-400" size={20} />
          <span className="text-sm font-medium text-pink-800 dark:text-pink-200">
            {t('supportJuanje')}
          </span>
        </div>
        <p className="mb-3 text-xs text-pink-600 dark:text-pink-400">{t('helpImprove')}</p>
      </div>

      <button
        onClick={handleKofiClick}
        className="flex w-full transform items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-red-500 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-pink-600 hover:to-red-600 hover:shadow-xl focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
      >
        <Coffee size={18} />
        <span>{t('buyJuanjeCoffee')}</span>
      </button>

      <div className="mt-2 text-center">
        <span className="text-xs text-pink-600 dark:text-pink-400">{t('supportKofi')}</span>
      </div>
    </div>
  );
};
