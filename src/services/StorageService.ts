import type { SavedRecipe, FavoriteId, CustomProportions } from '../types/Recipe';

function isCustomProportions(value: unknown): value is CustomProportions {
  if (typeof value !== 'object' || value === null) return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p.cucumber === 'number' &&
    typeof p.greenPepper === 'number' &&
    typeof p.garlic === 'number' &&
    typeof p.oliveOil === 'number' &&
    typeof p.salt === 'number' &&
    typeof p.vinegar === 'number'
  );
}

function isSavedRecipe(value: unknown): value is SavedRecipe {
  if (typeof value !== 'object' || value === null) return false;
  const r = value as Record<string, unknown>;
  return (
    typeof r.id === 'string' &&
    typeof r.name === 'string' &&
    typeof r.createdAt === 'string' &&
    typeof r.tomatoAmount === 'number' &&
    typeof r.isCustom === 'boolean' &&
    isCustomProportions(r.proportions) &&
    (r.notes === undefined || typeof r.notes === 'string')
  );
}

export class StorageService {
  private static instance: StorageService;
  private readonly COUNTER_KEY = 'gazpacho-made-count';
  private readonly THEME_KEY = 'gazpacho-theme';
  private readonly LANGUAGE_KEY = 'gazpacho-language';
  private readonly USER_MADE_IT_KEY = 'user-made-it';
  private readonly SAVED_RECIPES_KEY = 'gazpacho-saved-recipes';
  private readonly FAVORITE_IDS_KEY = 'gazpacho-favorite-ids';
  private readonly STORAGE_VERSION_KEY = 'gazpacho-storage-version';
  private readonly CURRENT_VERSION = 1;

  private constructor() {}

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  initStorage(): void {
    if (!localStorage.getItem(this.STORAGE_VERSION_KEY)) {
      localStorage.setItem(this.STORAGE_VERSION_KEY, String(this.CURRENT_VERSION));
    }
  }

  getMadeCount(): number {
    const count = localStorage.getItem(this.COUNTER_KEY);
    return count ? parseInt(count, 10) : 0;
  }

  incrementMadeCount(): number {
    const newCount = this.getMadeCount() + 1;
    localStorage.setItem(this.COUNTER_KEY, newCount.toString());
    return newCount;
  }

  getTheme(): string | null {
    return localStorage.getItem(this.THEME_KEY);
  }

  setTheme(theme: string): void {
    localStorage.setItem(this.THEME_KEY, theme);
  }

  getLanguage(): string | null {
    return localStorage.getItem(this.LANGUAGE_KEY);
  }

  setLanguage(language: string): void {
    localStorage.setItem(this.LANGUAGE_KEY, language);
  }

  getUserMadeIt(): boolean {
    return localStorage.getItem(this.USER_MADE_IT_KEY) === 'true';
  }

  setUserMadeIt(): void {
    localStorage.setItem(this.USER_MADE_IT_KEY, 'true');
  }

  getSavedRecipes(): SavedRecipe[] {
    const raw = localStorage.getItem(this.SAVED_RECIPES_KEY);
    if (!raw) return [];
    try {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.every(isSavedRecipe)) {
        return parsed;
      }
      console.warn('StorageService: invalid saved-recipes payload; falling back to []');
      return [];
    } catch {
      console.warn('StorageService: corrupt saved-recipes JSON; falling back to []');
      return [];
    }
  }

  saveRecipe(data: Omit<SavedRecipe, 'id' | 'createdAt'>): SavedRecipe {
    const recipe: SavedRecipe = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const recipes = this.getSavedRecipes();
    recipes.unshift(recipe);
    localStorage.setItem(this.SAVED_RECIPES_KEY, JSON.stringify(recipes));
    return recipe;
  }

  updateRecipe(id: string, updates: Partial<Pick<SavedRecipe, 'name' | 'notes'>>): void {
    const recipes = this.getSavedRecipes();
    const idx = recipes.findIndex((r) => r.id === id);
    if (idx !== -1) {
      recipes[idx] = { ...recipes[idx], ...updates };
      localStorage.setItem(this.SAVED_RECIPES_KEY, JSON.stringify(recipes));
    }
  }

  deleteRecipe(id: string): void {
    const recipes = this.getSavedRecipes().filter((r) => r.id !== id);
    localStorage.setItem(this.SAVED_RECIPES_KEY, JSON.stringify(recipes));
    this.removeFavorite(id);
  }

  getFavoriteIds(): FavoriteId[] {
    const raw = localStorage.getItem(this.FAVORITE_IDS_KEY);
    if (!raw) return [];
    try {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.every((id) => typeof id === 'string')) {
        return parsed;
      }
      console.warn('StorageService: invalid favorite-ids payload; falling back to []');
      return [];
    } catch {
      console.warn('StorageService: corrupt favorite-ids JSON; falling back to []');
      return [];
    }
  }

  toggleFavorite(id: FavoriteId): void {
    const favorites = this.getFavoriteIds();
    const idx = favorites.indexOf(id);
    if (idx === -1) {
      favorites.push(id);
    } else {
      favorites.splice(idx, 1);
    }
    localStorage.setItem(this.FAVORITE_IDS_KEY, JSON.stringify(favorites));
  }

  private removeFavorite(id: string): void {
    const favorites = this.getFavoriteIds().filter((fid) => fid !== id);
    localStorage.setItem(this.FAVORITE_IDS_KEY, JSON.stringify(favorites));
  }
}
