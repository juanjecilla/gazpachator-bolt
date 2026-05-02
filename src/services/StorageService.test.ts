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
      localStorage.setItem('gazpacho-saved-recipes', 'not-json');
      expect(storage.getSavedRecipes()).toEqual([]);
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
      localStorage.setItem('gazpacho-favorite-ids', 'bad');
      expect(storage.getFavoriteIds()).toEqual([]);
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
});
