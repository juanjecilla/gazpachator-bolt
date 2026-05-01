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
    <div className="bg-gradient-to-r from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20 
                    rounded-lg p-4 border border-pink-200 dark:border-pink-700">
      <div className="text-center mb-3">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="text-pink-600 dark:text-pink-400" size={20} />
          <span className="text-sm font-medium text-pink-800 dark:text-pink-200">
            {t('supportJuanje')}
          </span>
        </div>
        <p className="text-xs text-pink-600 dark:text-pink-400 mb-3">
          {t('helpImprove')}
        </p>
      </div>
      
      <button
        onClick={handleKofiClick}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 
                   bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600
                   text-white font-semibold rounded-lg shadow-lg hover:shadow-xl
                   transform hover:scale-105 transition-all duration-200
                   focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
      >
        <Coffee size={18} />
        <span>{t('buyJuanjeCoffee')}</span>
      </button>
      
      <div className="mt-2 text-center">
        <span className="text-xs text-pink-600 dark:text-pink-400">
          {t('supportKofi')}
        </span>
      </div>
    </div>
  );
};