import { useState, useCallback } from 'react';
import { StorageService } from '../services/StorageService';
import type { SavedRecipe, FavoriteId, CustomProportions } from '../types/Recipe';

export interface SaveRecipeData {
  name: string;
  tomatoAmount: number;
  isCustom: boolean;
  proportions: CustomProportions;
  notes?: string;
}

export const useRecipeHistory = () => {
  const storage = StorageService.getInstance();
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>(() => storage.getSavedRecipes());
  const [favoriteIds, setFavoriteIds] = useState<FavoriteId[]>(() => storage.getFavoriteIds());

  const saveRecipe = useCallback(
    (data: SaveRecipeData): SavedRecipe => {
      const saved = storage.saveRecipe(data);
      setSavedRecipes(storage.getSavedRecipes());
      return saved;
    },
    [storage]
  );

  const deleteRecipe = useCallback(
    (id: string): void => {
      storage.deleteRecipe(id);
      setSavedRecipes(storage.getSavedRecipes());
      setFavoriteIds(storage.getFavoriteIds());
    },
    [storage]
  );

  const toggleFavorite = useCallback(
    (id: FavoriteId): void => {
      storage.toggleFavorite(id);
      setFavoriteIds(storage.getFavoriteIds());
    },
    [storage]
  );

  const isFavorite = useCallback((id: string): boolean => favoriteIds.includes(id), [favoriteIds]);

  const favoriteRecipes = savedRecipes.filter((r) => favoriteIds.includes(r.id));
  const nonFavoriteRecipes = savedRecipes.filter((r) => !favoriteIds.includes(r.id));

  return {
    savedRecipes,
    favoriteRecipes,
    nonFavoriteRecipes,
    saveRecipe,
    deleteRecipe,
    toggleFavorite,
    isFavorite,
  };
};
