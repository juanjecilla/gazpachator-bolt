import React, { useState } from 'react';
import { BookOpen, Star, Trash2, Download, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import type { SavedRecipe, CustomProportions } from '../types/Recipe';
import type { SaveRecipeData } from '../hooks/useRecipeHistory';

interface RecipeHistoryPanelProps {
  t: (key: string) => string;
  currentTomatoAmount: number;
  isCustom: boolean;
  currentProportions: CustomProportions;
  savedRecipes: SavedRecipe[];
  favoriteRecipes: SavedRecipe[];
  nonFavoriteRecipes: SavedRecipe[];
  isFavorite: (id: string) => boolean;
  onSave: (data: SaveRecipeData) => void;
  onLoad: (recipe: SavedRecipe) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const RecipeHistoryPanel: React.FC<RecipeHistoryPanelProps> = ({
  t,
  currentTomatoAmount,
  isCustom,
  currentProportions,
  savedRecipes,
  favoriteRecipes,
  nonFavoriteRecipes,
  isFavorite,
  onSave,
  onLoad,
  onDelete,
  onToggleFavorite,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      tomatoAmount: currentTomatoAmount,
      isCustom,
      proportions: currentProportions,
      notes: notes.trim() || undefined,
    });
    setName('');
    setNotes('');
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

  const RecipeItem = ({ recipe }: { recipe: SavedRecipe }) => (
    <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2 dark:border-amber-800 dark:bg-amber-900/20">
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-amber-900 dark:text-amber-100">
          {recipe.name}
        </div>
        <div className="text-xs text-amber-600 dark:text-amber-400">
          {recipe.tomatoAmount}g · {new Date(recipe.createdAt).toLocaleDateString()}
        </div>
        {recipe.notes && (
          <div className="mt-1 text-xs italic text-amber-700 dark:text-amber-300">
            {recipe.notes}
          </div>
        )}
      </div>
      <div className="flex shrink-0 gap-1">
        <button
          onClick={() => onToggleFavorite(recipe.id)}
          className={`rounded p-1 transition-colors ${
            isFavorite(recipe.id)
              ? 'text-amber-500 hover:text-amber-600'
              : 'text-amber-300 hover:text-amber-500'
          }`}
          title={t('favoriteRecipe')}
          aria-label={t('favoriteRecipe')}
        >
          <Star size={14} className={isFavorite(recipe.id) ? 'fill-current' : ''} />
        </button>
        <button
          onClick={() => onLoad(recipe)}
          className="rounded p-1 text-amber-600 transition-colors hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200"
          title={t('loadRecipe')}
          aria-label={t('loadRecipe')}
        >
          <Download size={14} />
        </button>
        <button
          onClick={() => handleDelete(recipe.id)}
          className={`rounded p-1 transition-colors ${
            confirmDeleteId === recipe.id
              ? 'text-red-600 dark:text-red-400'
              : 'text-amber-400 hover:text-red-500 dark:hover:text-red-400'
          }`}
          title={confirmDeleteId === recipe.id ? t('confirmDelete') : t('deleteRecipe')}
          aria-label={t('deleteRecipe')}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-xl border-2 border-amber-200 bg-amber-50/95 shadow-xl backdrop-blur-sm dark:border-amber-700 dark:bg-amber-900/95">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-amber-900 transition-colors hover:bg-amber-100 dark:text-amber-100 dark:hover:bg-amber-800/40"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <BookOpen size={18} />
          <span className="font-semibold">{t('savedRecipes')}</span>
          {savedRecipes.length > 0 && (
            <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs text-amber-800 dark:bg-amber-800 dark:text-amber-200">
              {savedRecipes.length}
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
              {t('saveRecipe')}
            </button>
          ) : (
            <div className="space-y-2 rounded-lg border border-amber-200 bg-white p-3 dark:border-amber-700 dark:bg-gray-800">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('recipeName')}
                className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:border-amber-700 dark:bg-gray-700 dark:text-gray-100"
                aria-label={t('recipeName')}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                autoFocus
              />
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('recipeNotes')}
                className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:border-amber-700 dark:bg-gray-700 dark:text-gray-100"
                aria-label={t('recipeNotes')}
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
                    setNotes('');
                  }}
                  className="rounded-lg border border-amber-300 px-3 py-1.5 text-sm text-amber-700 transition-colors hover:bg-amber-50 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/20"
                >
                  {t('cancel')}
                </button>
              </div>
            </div>
          )}

          {savedRecipes.length === 0 ? (
            <p className="py-2 text-center text-sm text-amber-600 dark:text-amber-400">
              {t('noSavedRecipes')}
            </p>
          ) : (
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {favoriteRecipes.length > 0 && (
                <>
                  <div className="flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                    <Star size={12} className="fill-current" />
                    <span>Favorites</span>
                  </div>
                  {favoriteRecipes.map((r) => (
                    <RecipeItem key={r.id} recipe={r} />
                  ))}
                  {nonFavoriteRecipes.length > 0 && (
                    <div className="border-t border-amber-200 dark:border-amber-800" />
                  )}
                </>
              )}
              {nonFavoriteRecipes.map((r) => (
                <RecipeItem key={r.id} recipe={r} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
