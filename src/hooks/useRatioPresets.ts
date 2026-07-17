import { useState, useCallback, useMemo } from 'react';
import { StorageService } from '../services/StorageService';
import type { RatioPreset, CustomProportions } from '../types/Recipe';

// Stable id and proportions for the one built-in preset. It is synthesized on
// every render (never persisted) so it always exists and can never be deleted.
export const BUILT_IN_PRESET_ID = 'builtin-default';

export const DEFAULT_PROPORTIONS: CustomProportions = {
  cucumber: 333.33,
  greenPepper: 166.67,
  garlic: 12,
  oliveOil: 15,
  salt: 6,
  vinegar: 18,
};

export interface SaveRatioPresetData {
  name: string;
  proportions: CustomProportions;
}

export const useRatioPresets = () => {
  const storage = StorageService.getInstance();
  const [userPresets, setUserPresets] = useState<RatioPreset[]>(() => storage.getRatioPresets());

  const builtInPreset = useMemo<RatioPreset>(
    () => ({
      id: BUILT_IN_PRESET_ID,
      // Display name comes from t('defaultPresetName'); the stored value is a
      // language-independent fallback and is not shown while isBuiltIn is true.
      name: "Juanje's Original",
      proportions: DEFAULT_PROPORTIONS,
      isBuiltIn: true,
    }),
    []
  );

  // Built-in preset always leads the list, followed by user presets.
  const presets = useMemo<RatioPreset[]>(
    () => [builtInPreset, ...userPresets],
    [builtInPreset, userPresets]
  );

  const savePreset = useCallback(
    (data: SaveRatioPresetData): RatioPreset => {
      const saved = storage.saveRatioPreset(data);
      setUserPresets(storage.getRatioPresets());
      return saved;
    },
    [storage]
  );

  const deletePreset = useCallback(
    (id: string): void => {
      // The built-in preset is not deletable.
      if (id === BUILT_IN_PRESET_ID) return;
      storage.deleteRatioPreset(id);
      setUserPresets(storage.getRatioPresets());
    },
    [storage]
  );

  return { presets, builtInPreset, savePreset, deletePreset };
};
