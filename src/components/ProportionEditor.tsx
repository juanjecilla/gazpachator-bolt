import React, { useState } from 'react';
import type { CustomProportions } from '../types/Recipe';
import { Settings, RotateCcw, Save, X } from 'lucide-react';

interface ProportionEditorProps {
  isCustom: boolean;
  proportions: CustomProportions;
  onToggleCustom: () => void;
  onProportionsChange: (proportions: CustomProportions) => void;
  onReset: () => void;
  t: (key: string) => string;
}

export const ProportionEditor: React.FC<ProportionEditorProps> = ({
  isCustom,
  proportions,
  onToggleCustom,
  onProportionsChange,
  onReset,
  t,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [tempProportions, setTempProportions] = useState<CustomProportions>(proportions);

  const handleOpenPopup = () => {
    setTempProportions(proportions);
    setShowPopup(true);
  };

  const handleSaveProportions = () => {
    onProportionsChange(tempProportions);
    setShowPopup(false);
    if (!isCustom) {
      onToggleCustom();
    }
  };

  const handleTempProportionChange = (key: keyof CustomProportions, value: number) => {
    setTempProportions({
      ...tempProportions,
      [key]: value,
    });
  };

  const handleReset = () => {
    const defaultProportions = {
      cucumber: 333.33,
      greenPepper: 166.67,
      garlic: 12,
      oliveOil: 15,
      salt: 6,
      vinegar: 18,
    };
    setTempProportions(defaultProportions);
  };

  return (
    <>
      <div className="rounded-lg border border-amber-300 bg-gradient-to-br from-amber-100 to-yellow-100 p-6 shadow-lg dark:border-amber-600 dark:from-amber-900/30 dark:to-yellow-900/30">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
            <Settings size={20} />
            <span className="font-semibold">{t('customProportions')}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenPopup}
              className="rounded-md bg-amber-600 px-3 py-1 text-sm text-white shadow-sm transition-colors duration-200 hover:bg-amber-700"
            >
              Edit Recipe
            </button>

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={isCustom}
                onChange={onToggleCustom}
                className="rounded border-amber-300 text-amber-600 focus:ring-amber-500 focus:ring-offset-0"
              />
              <span className="text-sm text-amber-700 dark:text-amber-300">{t('useCustom')}</span>
            </label>

            {isCustom && (
              <button
                onClick={onReset}
                className="flex items-center gap-1 rounded px-2 py-1 text-xs text-amber-600 transition-colors hover:bg-amber-200 hover:text-amber-800 dark:text-amber-400 dark:hover:bg-amber-800 dark:hover:text-amber-200"
              >
                <RotateCcw size={12} />
                {t('resetDefault')}
              </button>
            )}
          </div>
        </div>

        {isCustom && (
          <div className="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-600 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
            Using custom proportions. Click "Edit Recipe" to modify.
          </div>
        )}
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border-2 border-amber-300 bg-amber-50 shadow-2xl dark:border-amber-600 dark:bg-amber-900">
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100">
                  Custom Recipe Proportions
                </h3>
                <button
                  onClick={() => setShowPopup(false)}
                  className="text-amber-400 hover:text-amber-600 dark:hover:text-amber-300"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-4 rounded border border-amber-200 bg-amber-100 p-3 text-sm text-amber-600 dark:border-amber-700 dark:bg-amber-800/50 dark:text-amber-400">
                {t('proportionHelper')}
              </div>

              <div className="space-y-4">
                {Object.entries(tempProportions).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <label className="text-sm font-medium text-amber-700 dark:text-amber-300">
                      {t(key)}:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={value}
                        onChange={(e) =>
                          handleTempProportionChange(
                            key as keyof CustomProportions,
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-20 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-amber-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 dark:border-amber-600 dark:bg-amber-800/50 dark:text-amber-100"
                      />
                      <span className="text-sm text-amber-500 dark:text-amber-400">g</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3 border-t border-amber-200 pt-4 dark:border-amber-600">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 rounded-md px-4 py-2 text-amber-600 transition-colors hover:bg-amber-100 hover:text-amber-800 dark:text-amber-400 dark:hover:bg-amber-700 dark:hover:text-amber-200"
                >
                  <RotateCcw size={16} />
                  Reset to Default
                </button>

                <div className="flex-1"></div>

                <button
                  onClick={() => setShowPopup(false)}
                  className="rounded-md px-4 py-2 text-amber-600 transition-colors hover:bg-amber-100 hover:text-amber-800 dark:text-amber-400 dark:hover:bg-amber-700 dark:hover:text-amber-200"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveProportions}
                  className="flex items-center gap-2 rounded-md bg-amber-600 px-4 py-2 text-white shadow-sm transition-colors hover:bg-amber-700"
                >
                  <Save size={16} />
                  Save & Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
