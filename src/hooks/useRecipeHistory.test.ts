import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRecipeHistory } from './useRecipeHistory';
import { StorageService } from '../services/StorageService';

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

const baseProportions = {
  cucumber: 500,
  greenPepper: 100,
  garlic: 10,
  oliveOil: 50,
  salt: 8,
  vinegar: 20,
};

describe('useRecipeHistory', () => {
  beforeEach(() => {
    localStorage.clear();
    // @ts-expect-error reset singleton
    StorageService.instance = undefined;
  });

  it('starts with empty savedRecipes and favoriteIds', () => {
    const { result } = renderHook(() => useRecipeHistory());
    expect(result.current.savedRecipes).toEqual([]);
    expect(result.current.favoriteRecipes).toEqual([]);
    expect(result.current.nonFavoriteRecipes).toEqual([]);
  });

  it('saveRecipe adds to savedRecipes', () => {
    const { result } = renderHook(() => useRecipeHistory());
    act(() => {
      result.current.saveRecipe({
        name: 'A',
        tomatoAmount: 1000,
        isCustom: false,
        proportions: baseProportions,
      });
    });
    expect(result.current.savedRecipes).toHaveLength(1);
    expect(result.current.savedRecipes[0].name).toBe('A');
  });

  it('deleteRecipe removes from savedRecipes', () => {
    const { result } = renderHook(() => useRecipeHistory());
    let id: string;
    act(() => {
      const saved = result.current.saveRecipe({
        name: 'Del',
        tomatoAmount: 500,
        isCustom: false,
        proportions: baseProportions,
      });
      id = saved.id;
    });
    act(() => {
      result.current.deleteRecipe(id);
    });
    expect(result.current.savedRecipes).toHaveLength(0);
  });

  it('toggleFavorite marks recipe as favorite', () => {
    const { result } = renderHook(() => useRecipeHistory());
    let id: string;
    act(() => {
      const saved = result.current.saveRecipe({
        name: 'Fav',
        tomatoAmount: 800,
        isCustom: false,
        proportions: baseProportions,
      });
      id = saved.id;
    });
    act(() => {
      result.current.toggleFavorite(id);
    });
    expect(result.current.isFavorite(id)).toBe(true);
    expect(result.current.favoriteRecipes).toHaveLength(1);
    expect(result.current.nonFavoriteRecipes).toHaveLength(0);
  });

  it('toggleFavorite removes favorite on second call', () => {
    const { result } = renderHook(() => useRecipeHistory());
    let id: string;
    act(() => {
      const saved = result.current.saveRecipe({
        name: 'Unfav',
        tomatoAmount: 300,
        isCustom: true,
        proportions: baseProportions,
      });
      id = saved.id;
    });
    act(() => {
      result.current.toggleFavorite(id);
    });
    act(() => {
      result.current.toggleFavorite(id);
    });
    expect(result.current.isFavorite(id)).toBe(false);
    expect(result.current.favoriteRecipes).toHaveLength(0);
    expect(result.current.nonFavoriteRecipes).toHaveLength(1);
  });

  it('deleteRecipe also removes from favorites', () => {
    const { result } = renderHook(() => useRecipeHistory());
    let id: string;
    act(() => {
      const saved = result.current.saveRecipe({
        name: 'Both',
        tomatoAmount: 600,
        isCustom: false,
        proportions: baseProportions,
      });
      id = saved.id;
    });
    act(() => {
      result.current.toggleFavorite(id);
    });
    act(() => {
      result.current.deleteRecipe(id);
    });
    expect(result.current.savedRecipes).toHaveLength(0);
    expect(result.current.favoriteRecipes).toHaveLength(0);
  });

  it('isFavorite returns false for unknown id', () => {
    const { result } = renderHook(() => useRecipeHistory());
    expect(result.current.isFavorite('unknown')).toBe(false);
  });
});
