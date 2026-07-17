import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Trash2,
  Download,
  ChevronDown,
  ChevronUp,
  Plus,
  Lock,
} from 'lucide-react';
import type { RatioPreset, CustomProportions } from '../types/Recipe';
import type { SaveRatioPresetData } from '../hooks/useRatioPresets';
import type { TranslationKey } from '../data/translations';

interface RatioPresetsPanelProps {
  t: (key: TranslationKey) => string;
  currentProportions: CustomProportions;
  presets: RatioPreset[];
  onSave: (data: SaveRatioPresetData) => void;
  onLoad: (preset: RatioPreset) => void;
  onDelete: (id: string) => void;
}

export const RatioPresetsPanel: React.FC<RatioPresetsPanelProps> = ({
  t,
  currentProportions,
  presets,
  onSave,
  onLoad,
  onDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [name, setName] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), proportions: currentProportions });
    setName('');
    setShowSaveForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirmDeleteId === id) {
      onDelete(id);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
    }
  };

  const userPresetCount = presets.filter((p) => !p.isBuiltIn).length;

  const PresetItem = ({ preset }: { preset: RatioPreset }) => (
    <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2 dark:border-amber-800 dark:bg-amber-900/20">
      <div className="flex min-w-0 flex-1 items-center gap-1.5">
        {preset.isBuiltIn && (
          <Lock size={12} className="shrink-0 text-amber-500 dark:text-amber-400" />
        )}
        <span className="truncate text-sm font-medium text-amber-900 dark:text-amber-100">
          {preset.isBuiltIn ? t('defaultPresetName') : preset.name}
        </span>
      </div>
      <div className="flex shrink-0 gap-1">
        <button
          onClick={() => onLoad(preset)}
          className="rounded p-1 text-amber-600 transition-colors hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200"
          title={t('loadPreset')}
          aria-label={t('loadPreset')}
        >
          <Download size={14} />
        </button>
        {!preset.isBuiltIn && (
          <button
            onClick={() => handleDelete(preset.id)}
            className={`rounded p-1 transition-colors ${
              confirmDeleteId === preset.id
                ? 'text-red-600 dark:text-red-400'
                : 'text-amber-400 hover:text-red-500 dark:hover:text-red-400'
            }`}
            title={confirmDeleteId === preset.id ? t('confirmDeletePreset') : t('deletePreset')}
            aria-label={t('deletePreset')}
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-xl border-2 border-amber-200 bg-amber-50/95 shadow-xl backdrop-blur-sm dark:border-amber-700 dark:bg-amber-900/95 print:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-amber-900 transition-colors hover:bg-amber-100 dark:text-amber-100 dark:hover:bg-amber-800/40"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} />
          <span className="font-semibold">{t('ratioPresets')}</span>
          {userPresetCount > 0 && (
            <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs text-amber-800 dark:bg-amber-800 dark:text-amber-200">
              {userPresetCount}
            </span>
          )}
        </div>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div className="space-y-3 border-t border-amber-200 p-4 dark:border-amber-700">
          {!showSaveForm ? (
            <button
              onClick={() => setShowSaveForm(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-amber-300 px-4 py-2 text-sm text-amber-600 transition-colors hover:border-amber-400 hover:text-amber-700 dark:border-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
            >
              <Plus size={14} />
              {t('savePreset')}
            </button>
          ) : (
            <div className="space-y-2 rounded-lg border border-amber-200 bg-white p-3 dark:border-amber-700 dark:bg-gray-800">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('presetName')}
                className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:border-amber-700 dark:bg-gray-700 dark:text-gray-100"
                aria-label={t('presetName')}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={!name.trim()}
                  className="flex-1 rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-amber-600 disabled:bg-amber-200 disabled:dark:bg-amber-900/30"
                >
                  {t('save')}
                </button>
                <button
                  onClick={() => {
                    setShowSaveForm(false);
                    setName('');
                  }}
                  className="rounded-lg border border-amber-300 px-3 py-1.5 text-sm text-amber-700 transition-colors hover:bg-amber-50 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/20"
                >
                  {t('cancel')}
                </button>
              </div>
            </div>
          )}

          <div className="max-h-64 space-y-2 overflow-y-auto">
            {presets.map((preset) => (
              <PresetItem key={preset.id} preset={preset} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
