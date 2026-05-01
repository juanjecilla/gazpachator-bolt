import React, { useState } from 'react';
import { CustomProportions } from '../types/Recipe';
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
  t
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
      [key]: value
    });
  };

  const handleReset = () => {
    const defaultProportions = {
      cucumber: 333.33,
      greenPepper: 166.67,
      garlic: 12,
      oliveOil: 15,
      salt: 6,
      vinegar: 18
    };
    setTempProportions(defaultProportions);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 
                      rounded-lg p-6 border border-amber-300 dark:border-amber-600 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
            <Settings size={20} />
            <span className="font-semibold">{t('customProportions')}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenPopup}
              className="px-3 py-1 text-sm bg-amber-600 hover:bg-amber-700 text-white 
                       rounded-md transition-colors duration-200 shadow-sm"
            >
              Edit Recipe
            </button>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isCustom}
                onChange={onToggleCustom}
                className="rounded border-amber-300 text-amber-600 
                         focus:ring-amber-500 focus:ring-offset-0"
              />
              <span className="text-sm text-amber-700 dark:text-amber-300">
                {t('useCustom')}
              </span>
            </label>
            
            {isCustom && (
              <button
                onClick={onReset}
                className="flex items-center gap-1 px-2 py-1 text-xs text-amber-600 
                         hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200
                         hover:bg-amber-200 dark:hover:bg-amber-800 rounded transition-colors"
              >
                <RotateCcw size={12} />
                {t('resetDefault')}
              </button>
            )}
          </div>
        </div>

        {isCustom && (
          <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 
                          rounded p-3 border border-amber-200 dark:border-amber-700">
            Using custom proportions. Click "Edit Recipe" to modify.
          </div>
        )}
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-amber-50 dark:bg-amber-900 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border-2 border-amber-300 dark:border-amber-600">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
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

              <div className="text-sm text-amber-600 dark:text-amber-400 mb-4 p-3 bg-amber-100 dark:bg-amber-800/50 rounded border border-amber-200 dark:border-amber-700">
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
                        onChange={(e) => handleTempProportionChange(
                          key as keyof CustomProportions, 
                          parseFloat(e.target.value) || 0
                        )}
                        className="w-20 px-3 py-2 border border-amber-300 dark:border-amber-600 
                                 rounded-md bg-amber-50 dark:bg-amber-800/50
                                 text-amber-900 dark:text-amber-100
                                 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                      <span className="text-sm text-amber-500 dark:text-amber-400">g</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-amber-200 dark:border-amber-600">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 text-amber-600 dark:text-amber-400
                           hover:text-amber-800 dark:hover:text-amber-200 hover:bg-amber-100 
                           dark:hover:bg-amber-700 rounded-md transition-colors"
                >
                  <RotateCcw size={16} />
                  Reset to Default
                </button>
                
                <div className="flex-1"></div>
                
                <button
                  onClick={() => setShowPopup(false)}
                  className="px-4 py-2 text-amber-600 dark:text-amber-400 hover:text-amber-800 
                           dark:hover:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-700 
                           rounded-md transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleSaveProportions}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 
                           text-white rounded-md transition-colors shadow-sm"
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