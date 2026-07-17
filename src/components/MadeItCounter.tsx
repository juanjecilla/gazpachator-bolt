import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { StorageService } from '../services/StorageService';
import type { TranslationKey } from '../data/translations';

interface MadeItCounterProps {
  t: (key: TranslationKey) => string;
}

export const MadeItCounter: React.FC<MadeItCounterProps> = ({ t }) => {
  const storage = StorageService.getInstance();
  const [count, setCount] = useState(() => storage.getMadeCount());
  const [hasUserMadeIt, setHasUserMadeIt] = useState(() => storage.getUserMadeIt());

  const handleMadeIt = () => {
    if (!hasUserMadeIt) {
      const newCount = storage.incrementMadeCount();
      setCount(newCount);
      setHasUserMadeIt(true);
      storage.setUserMadeIt();
    }
  };

  return (
    <div className="text-center">
      <button
        onClick={handleMadeIt}
        disabled={hasUserMadeIt}
        aria-pressed={hasUserMadeIt}
        className={`flex transform items-center gap-2 rounded-full px-6 py-3 font-semibold transition-all duration-300 hover:scale-105 ${
          hasUserMadeIt
            ? 'cursor-default bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
            : 'bg-amber-500 text-white shadow-lg hover:bg-amber-600 hover:shadow-xl'
        }`}
      >
        <Heart size={20} className={hasUserMadeIt ? 'fill-current' : ''} />
        {hasUserMadeIt ? '¡Hecho!' : t('madeIt')}
      </button>

      <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
        <span className="text-lg font-bold">{count}</span> {t('madeItCount')}
      </div>
    </div>
  );
};
