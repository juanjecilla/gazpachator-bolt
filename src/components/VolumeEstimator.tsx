import React from 'react';
import { Beaker } from 'lucide-react';

interface VolumeEstimatorProps {
  volume: number;
  t: (key: string) => string;
}

export const VolumeEstimator: React.FC<VolumeEstimatorProps> = ({ volume, t }) => {
  return (
    <div className="rounded-lg border border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50 p-4 shadow-md dark:border-yellow-600 dark:from-yellow-900/20 dark:to-amber-900/20">
      <div className="flex items-center gap-3">
        <Beaker className="text-yellow-600 dark:text-yellow-400" size={24} />
        <div>
          <div className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
            {t('estimatedVolume')}
          </div>
          <div className="text-xl font-bold text-yellow-800 dark:text-yellow-200">
            {volume} {t('liters')}
          </div>
        </div>
      </div>
    </div>
  );
};
