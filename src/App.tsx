import React, { useState, useEffect } from 'react';
import { IngredientInput } from './components/IngredientInput';
import { ProportionEditor } from './components/ProportionEditor';
import { VolumeEstimator } from './components/VolumeEstimator';
import { ExportShare } from './components/ExportShare';
import { MadeItCounter } from './components/MadeItCounter';
import { ThemeLanguageSelector } from './components/ThemeLanguageSelector';
import { KofiButton } from './components/KofiButton';
import { RecipeHistoryPanel } from './components/RecipeHistoryPanel';
import { PwaUpdatePrompt } from './components/PwaUpdatePrompt';
import {
  RecipeCalculatorService,
  DefaultCalculationStrategy,
  CustomCalculationStrategy,
} from './services/RecipeCalculator';
import { useTheme } from './hooks/useTheme';
import { useLanguage } from './hooks/useLanguage';
import { useRecipeHistory } from './hooks/useRecipeHistory';
import type { Recipe, CustomProportions, SavedRecipe } from './types/Recipe';
import { ChefHat } from 'lucide-react';

function App() {
  const { theme, changeTheme } = useTheme();
  const { language, changeLanguage, t } = useLanguage();
  const { savedRecipes, favoriteRecipes, nonFavoriteRecipes, saveRecipe, deleteRecipe, toggleFavorite, isFavorite } =
    useRecipeHistory();

  const [recipe, setRecipe] = useState<Recipe>({ ingredients: [], totalVolume: 0 });
  const [isCustom, setIsCustom] = useState(false);
  const [customProportions, setCustomProportions] = useState<CustomProportions>({
    cucumber: 333.33,
    greenPepper: 166.67,
    garlic: 12,
    oliveOil: 15,
    salt: 6,
    vinegar: 18,
  });

  const [calculator] = useState(() => new RecipeCalculatorService());

  // Sync html[lang] with selected language
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Initialize recipe
  useEffect(() => {
    const initialRecipe = calculator.calculateRecipe(1000); // 1000g = 1kg
    setRecipe(initialRecipe);
  }, [calculator]);

  // Update calculation strategy when custom mode changes
  useEffect(() => {
    const strategy = isCustom ? new CustomCalculationStrategy() : new DefaultCalculationStrategy();
    calculator.setStrategy(strategy);

    const tomatoAmount = recipe.ingredients.find((ing) => ing.id === 'tomato')?.amount || 1000;
    const newRecipe = calculator.calculateRecipe(
      tomatoAmount,
      isCustom ? customProportions : undefined
    );
    setRecipe(newRecipe);
    // recipe.ingredients intentionally omitted — reading tomato amount is a one-way trigger,
    // not a reactive dependency; re-including it would cause infinite recalculation loops.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCustom, customProportions, calculator]);

  const handleIngredientChange = (ingredientId: string, newAmount: number) => {
    const updatedIngredients = calculator.updateIngredientAmount(
      recipe.ingredients,
      ingredientId,
      newAmount,
      isCustom ? customProportions : undefined
    );

    const newRecipe = {
      ingredients: updatedIngredients,
      totalVolume: calculator.calculateRecipe(
        updatedIngredients.find((ing) => ing.id === 'tomato')?.amount || 1000,
        isCustom ? customProportions : undefined
      ).totalVolume,
    };

    setRecipe(newRecipe);
  };

  const handleToggleCustom = () => {
    setIsCustom(!isCustom);
  };

  const handleProportionsChange = (newProportions: CustomProportions) => {
    setCustomProportions(newProportions);
  };

  const handleLoadRecipe = (saved: SavedRecipe) => {
    setIsCustom(saved.isCustom);
    setCustomProportions(saved.proportions);
    const strategy = saved.isCustom
      ? new CustomCalculationStrategy()
      : new DefaultCalculationStrategy();
    calculator.setStrategy(strategy);
    const newRecipe = calculator.calculateRecipe(
      saved.tomatoAmount,
      saved.isCustom ? saved.proportions : undefined
    );
    setRecipe(newRecipe);
  };

  const handleResetProportions = () => {
    setCustomProportions({
      cucumber: 333.33,
      greenPepper: 166.67,
      garlic: 12,
      oliveOil: 15,
      salt: 6,
      vinegar: 18,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 transition-colors duration-300 dark:from-amber-900 dark:via-yellow-900 dark:to-orange-900">
      {/* Ancient parchment texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-20 dark:opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-opacity='0.1'%3E%3Cpolygon fill='%23F59E0B' points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
        }}
      />

      <div className="container relative z-10 mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <ChefHat className="text-amber-600 dark:text-amber-400" size={48} />
            <div>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-amber-900 dark:text-amber-100 md:text-5xl">
                {t('title')}
              </h1>
              <p className="mt-2 text-lg font-medium text-amber-700 dark:text-amber-300">
                {t('subtitle')}
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-2xl border-b border-t border-amber-300 py-4 dark:border-amber-600">
            <ThemeLanguageSelector
              theme={theme}
              language={language}
              onThemeChange={changeTheme}
              onLanguageChange={changeLanguage}
              t={t}
            />
          </div>
        </header>

        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Recipe Panel */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border-2 border-amber-200 bg-amber-50/95 p-8 shadow-2xl backdrop-blur-sm dark:border-amber-700 dark:bg-amber-900/95">
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                  {recipe.ingredients.map((ingredient) => (
                    <IngredientInput
                      key={ingredient.id}
                      ingredient={ingredient}
                      label={t(ingredient.name)}
                      onChange={handleIngredientChange}
                    />
                  ))}
                </div>

                <div className="border-t border-amber-200 pt-6 dark:border-amber-700">
                  <ProportionEditor
                    isCustom={isCustom}
                    proportions={customProportions}
                    onToggleCustom={handleToggleCustom}
                    onProportionsChange={handleProportionsChange}
                    onReset={handleResetProportions}
                    t={t}
                  />
                </div>
              </div>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              <VolumeEstimator volume={recipe.totalVolume} t={t} />

              <RecipeHistoryPanel
                t={t}
                currentTomatoAmount={
                  recipe.ingredients.find((i) => i.id === 'tomato')?.amount ?? 1000
                }
                isCustom={isCustom}
                currentProportions={customProportions}
                savedRecipes={savedRecipes}
                favoriteRecipes={favoriteRecipes}
                nonFavoriteRecipes={nonFavoriteRecipes}
                isFavorite={isFavorite}
                onSave={saveRecipe}
                onLoad={handleLoadRecipe}
                onDelete={deleteRecipe}
                onToggleFavorite={toggleFavorite}
              />

              <KofiButton t={t} />

              <div className="rounded-xl border-2 border-amber-200 bg-amber-50/95 p-6 shadow-xl backdrop-blur-sm dark:border-amber-700 dark:bg-amber-900/95">
                <h3 className="mb-4 text-center font-semibold text-amber-900 dark:text-amber-100">
                  Actions
                </h3>
                <div className="space-y-4">
                  <ExportShare recipe={recipe} t={t} />
                  <div className="border-t border-amber-200 pt-4 dark:border-amber-700">
                    <MadeItCounter t={t} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-amber-600 dark:text-amber-400">
          <div className="mx-auto max-w-2xl border-t border-amber-300 pt-6 dark:border-amber-600">
            <p>Traditional Spanish Gazpacho Recipe Calculator</p>
            <p className="mt-1 opacity-75">Preserving culinary heritage through technology</p>
          </div>
        </footer>
      </div>
      <PwaUpdatePrompt />
    </div>
  );
}

export default App;
