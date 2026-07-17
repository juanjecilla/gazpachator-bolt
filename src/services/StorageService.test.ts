import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { StorageService } from './StorageService';

// jsdom needs a URL to support localStorage; stub it if not available
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
})();

vi.stubGlobal('localStorage', localStorageMock);

describe('StorageService', () => {
  let storage: StorageService;

  beforeEach(() => {
    localStorage.clear();
    // Reset singleton for each test
    // @ts-expect-error reset singleton
    StorageService.instance = undefined;
    storage = StorageService.getInstance();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('getInstance returns same instance (singleton)', () => {
    const a = StorageService.getInstance();
    const b = StorageService.getInstance();
    expect(a).toBe(b);
  });

  describe('made count', () => {
    it('getMadeCount returns 0 when no key set', () => {
      expect(storage.getMadeCount()).toBe(0);
    });

    it('incrementMadeCount increments and persists', () => {
      expect(storage.incrementMadeCount()).toBe(1);
      expect(storage.incrementMadeCount()).toBe(2);
      expect(storage.getMadeCount()).toBe(2);
    });
  });

  describe('user made it', () => {
    it('getUserMadeIt returns false when not set', () => {
      expect(storage.getUserMadeIt()).toBe(false);
    });

    it('setUserMadeIt persists true', () => {
      storage.setUserMadeIt();
      expect(storage.getUserMadeIt()).toBe(true);
    });
  });

  describe('theme', () => {
    it('getTheme returns null when not set', () => {
      expect(storage.getTheme()).toBeNull();
    });

    it('setTheme and getTheme round-trip', () => {
      storage.setTheme('dark');
      expect(storage.getTheme()).toBe('dark');
    });
  });

  describe('language', () => {
    it('getLanguage returns null when not set', () => {
      expect(storage.getLanguage()).toBeNull();
    });

    it('setLanguage and getLanguage round-trip', () => {
      storage.setLanguage('es');
      expect(storage.getLanguage()).toBe('es');
    });
  });

  describe('initStorage', () => {
    it('sets storage version when not present', () => {
      storage.initStorage();
      expect(localStorage.getItem('gazpacho-storage-version')).toBe('1');
    });

    it('does not overwrite existing version', () => {
      localStorage.setItem('gazpacho-storage-version', '99');
      storage.initStorage();
      expect(localStorage.getItem('gazpacho-storage-version')).toBe('99');
    });
  });

  describe('saved recipes', () => {
    it('getSavedRecipes returns empty array when not set', () => {
      expect(storage.getSavedRecipes()).toEqual([]);
    });

    it('getSavedRecipes returns empty array on corrupt data', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      localStorage.setItem('gazpacho-saved-recipes', 'not-json');
      expect(storage.getSavedRecipes()).toEqual([]);
      expect(warn).toHaveBeenCalled();
      warn.mockRestore();
    });

    it('getSavedRecipes rejects a payload that is not an array', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      localStorage.setItem('gazpacho-saved-recipes', JSON.stringify({ id: 'x' }));
      expect(storage.getSavedRecipes()).toEqual([]);
      expect(warn).toHaveBeenCalled();
      warn.mockRestore();
    });

    it('getSavedRecipes rejects entries with the wrong shape', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      // Missing required fields and a non-object proportions value.
      localStorage.setItem(
        'gazpacho-saved-recipes',
        JSON.stringify([{ id: 'x', name: 'no-proportions', tomatoAmount: 'lots' }])
      );
      expect(storage.getSavedRecipes()).toEqual([]);
      expect(warn).toHaveBeenCalled();
      warn.mockRestore();
    });

    it('getSavedRecipes accepts a well-formed payload', () => {
      const valid = [
        {
          id: 'abc',
          name: 'Valid',
          createdAt: new Date().toISOString(),
          tomatoAmount: 1000,
          isCustom: false,
          proportions: {
            cucumber: 333.33,
            greenPepper: 166.67,
            garlic: 12,
            oliveOil: 15,
            salt: 6,
            vinegar: 18,
          },
        },
      ];
      localStorage.setItem('gazpacho-saved-recipes', JSON.stringify(valid));
      expect(storage.getSavedRecipes()).toEqual(valid);
    });

    it('saveRecipe persists and returns recipe with id and createdAt', () => {
      const data = {
        name: 'Test',
        tomatoAmount: 1000,
        isCustom: false,
        proportions: {
          cucumber: 500,
          greenPepper: 100,
          garlic: 10,
          oliveOil: 50,
          salt: 8,
          vinegar: 20,
        },
      };
      const saved = storage.saveRecipe(data);
      expect(saved.id).toBeDefined();
      expect(saved.createdAt).toBeDefined();
      expect(saved.name).toBe('Test');
      expect(storage.getSavedRecipes()).toHaveLength(1);
    });

    it('saveRecipe prepends (newest first)', () => {
      const base = {
        tomatoAmount: 1000,
        isCustom: false,
        proportions: {
          cucumber: 500,
          greenPepper: 100,
          garlic: 10,
          oliveOil: 50,
          salt: 8,
          vinegar: 20,
        },
      };
      storage.saveRecipe({ ...base, name: 'First' });
      storage.saveRecipe({ ...base, name: 'Second' });
      expect(storage.getSavedRecipes()[0].name).toBe('Second');
    });

    it('updateRecipe updates name and notes', () => {
      const base = {
        name: 'Original',
        tomatoAmount: 1000,
        isCustom: false,
        proportions: {
          cucumber: 500,
          greenPepper: 100,
          garlic: 10,
          oliveOil: 50,
          salt: 8,
          vinegar: 20,
        },
      };
      const saved = storage.saveRecipe(base);
      storage.updateRecipe(saved.id, { name: 'Updated', notes: 'tasty' });
      const recipes = storage.getSavedRecipes();
      expect(recipes[0].name).toBe('Updated');
      expect(recipes[0].notes).toBe('tasty');
    });

    it('updateRecipe is no-op for unknown id', () => {
      storage.updateRecipe('nonexistent', { name: 'X' });
      expect(storage.getSavedRecipes()).toHaveLength(0);
    });

    it('deleteRecipe removes recipe and its favorite', () => {
      const saved = storage.saveRecipe({
        name: 'Del',
        tomatoAmount: 500,
        isCustom: false,
        proportions: {
          cucumber: 500,
          greenPepper: 100,
          garlic: 10,
          oliveOil: 50,
          salt: 8,
          vinegar: 20,
        },
      });
      storage.toggleFavorite(saved.id);
      expect(storage.getFavoriteIds()).toContain(saved.id);
      storage.deleteRecipe(saved.id);
      expect(storage.getSavedRecipes()).toHaveLength(0);
      expect(storage.getFavoriteIds()).not.toContain(saved.id);
    });
  });

  describe('favorites', () => {
    it('getFavoriteIds returns empty array when not set', () => {
      expect(storage.getFavoriteIds()).toEqual([]);
    });

    it('getFavoriteIds returns empty array on corrupt data', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      localStorage.setItem('gazpacho-favorite-ids', 'bad');
      expect(storage.getFavoriteIds()).toEqual([]);
      expect(warn).toHaveBeenCalled();
      warn.mockRestore();
    });

    it('getFavoriteIds rejects non-string entries', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      localStorage.setItem('gazpacho-favorite-ids', JSON.stringify(['ok', 42, { a: 1 }]));
      expect(storage.getFavoriteIds()).toEqual([]);
      expect(warn).toHaveBeenCalled();
      warn.mockRestore();
    });

    it('getFavoriteIds rejects a payload that is not an array', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      localStorage.setItem('gazpacho-favorite-ids', JSON.stringify({ nope: true }));
      expect(storage.getFavoriteIds()).toEqual([]);
      expect(warn).toHaveBeenCalled();
      warn.mockRestore();
    });

    it('getFavoriteIds accepts a valid string array', () => {
      localStorage.setItem('gazpacho-favorite-ids', JSON.stringify(['a', 'b']));
      expect(storage.getFavoriteIds()).toEqual(['a', 'b']);
    });

    it('toggleFavorite adds id', () => {
      storage.toggleFavorite('abc');
      expect(storage.getFavoriteIds()).toContain('abc');
    });

    it('toggleFavorite removes id when already present', () => {
      storage.toggleFavorite('abc');
      storage.toggleFavorite('abc');
      expect(storage.getFavoriteIds()).not.toContain('abc');
    });
  });

  describe('ratio presets', () => {
    const proportions = {
      cucumber: 400,
      greenPepper: 200,
      garlic: 15,
      oliveOil: 20,
      salt: 7,
      vinegar: 22,
    };

    it('getRatioPresets returns empty array when not set', () => {
      expect(storage.getRatioPresets()).toEqual([]);
    });

    it('getRatioPresets returns empty array on corrupt JSON', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      localStorage.setItem('gazpacho-ratio-presets', 'not-json');
      expect(storage.getRatioPresets()).toEqual([]);
      expect(warn).toHaveBeenCalled();
      warn.mockRestore();
    });

    it('getRatioPresets rejects a payload that is not an array', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      localStorage.setItem('gazpacho-ratio-presets', JSON.stringify({ id: 'x' }));
      expect(storage.getRatioPresets()).toEqual([]);
      expect(warn).toHaveBeenCalled();
      warn.mockRestore();
    });

    it('getRatioPresets rejects entries with the wrong shape', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      localStorage.setItem(
        'gazpacho-ratio-presets',
        JSON.stringify([{ id: 'x', name: 'no-proportions', isBuiltIn: false }])
      );
      expect(storage.getRatioPresets()).toEqual([]);
      expect(warn).toHaveBeenCalled();
      warn.mockRestore();
    });

    it('getRatioPresets accepts a well-formed payload', () => {
      const valid = [{ id: 'p1', name: 'Mine', proportions, isBuiltIn: false }];
      localStorage.setItem('gazpacho-ratio-presets', JSON.stringify(valid));
      expect(storage.getRatioPresets()).toEqual(valid);
    });

    it('saveRatioPreset persists and returns a preset with id and isBuiltIn=false', () => {
      const saved = storage.saveRatioPreset({ name: 'Spicy', proportions });
      expect(saved.id).toBeDefined();
      expect(saved.name).toBe('Spicy');
      expect(saved.isBuiltIn).toBe(false);
      expect(saved.proportions).toEqual(proportions);
      expect(storage.getRatioPresets()).toHaveLength(1);
    });

    it('saveRatioPreset appends (preserves insertion order)', () => {
      storage.saveRatioPreset({ name: 'First', proportions });
      storage.saveRatioPreset({ name: 'Second', proportions });
      const presets = storage.getRatioPresets();
      expect(presets[0].name).toBe('First');
      expect(presets[1].name).toBe('Second');
    });

    it('deleteRatioPreset removes the matching preset', () => {
      const saved = storage.saveRatioPreset({ name: 'Del', proportions });
      storage.deleteRatioPreset(saved.id);
      expect(storage.getRatioPresets()).toHaveLength(0);
    });

    it('deleteRatioPreset is a no-op for an unknown id', () => {
      storage.saveRatioPreset({ name: 'Keep', proportions });
      storage.deleteRatioPreset('nonexistent');
      expect(storage.getRatioPresets()).toHaveLength(1);
    });
  });
});
