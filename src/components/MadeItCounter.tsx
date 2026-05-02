import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { StorageService } from '../services/StorageService';

interface MadeItCounterProps {
  t: (key: string) => string;
}

export const MadeItCounter: React.FC<MadeItCounterProps> = ({ t }) => {
  const [count, setCount] = useState(0);
  const [hasUserMadeIt, setHasUserMadeIt] = useState(false);
  const storage = StorageService.getInstance();

  useEffect(() => {
    setCount(storage.getMadeCount());
    setHasUserMadeIt(storage.getUserMadeIt());
  }, [storage]);

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
