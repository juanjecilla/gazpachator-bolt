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
    setHasUserMadeIt(localStorage.getItem('user-made-it') === 'true');
  }, [storage]);

  const handleMadeIt = () => {
    if (!hasUserMadeIt) {
      const newCount = storage.incrementMadeCount();
      setCount(newCount);
      setHasUserMadeIt(true);
      localStorage.setItem('user-made-it', 'true');
    }
  };

  return (
    <div className="text-center">
      <button
        onClick={handleMadeIt}
        disabled={hasUserMadeIt}
        className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold
                   transition-all duration-300 transform hover:scale-105
                   ${hasUserMadeIt 
                     ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 cursor-default' 
                     : 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg hover:shadow-xl'
                   }`}
      >
        <Heart 
          size={20} 
          className={hasUserMadeIt ? 'fill-current' : ''} 
        />
        {hasUserMadeIt ? '¡Hecho!' : t('madeIt')}
      </button>
      
      <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
        <span className="font-bold text-lg">{count}</span> {t('madeItCount')}
      </div>
    </div>
  );
};