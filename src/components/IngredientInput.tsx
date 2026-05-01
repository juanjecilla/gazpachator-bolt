import React from 'react';
import { Ingredient } from '../types/Recipe';

interface IngredientInputProps {
  ingredient: Ingredient;
  label: string;
  onChange: (id: string, value: number) => void;
  disabled?: boolean;
}

export const IngredientInput: React.FC<IngredientInputProps> = ({
  ingredient,
  label,
  onChange,
  disabled = false
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onChange(ingredient.id, value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const step = e.shiftKey ? 10 : 1;
    
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      onChange(ingredient.id, ingredient.amount + step);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      onChange(ingredient.id, Math.max(0, ingredient.amount - step));
    }
  };

  return (
    <div className="ingredient-input">
      <label 
        htmlFor={ingredient.id}
        className="block text-sm font-medium text-amber-900 dark:text-amber-100 mb-2"
      >
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={ingredient.id}
          type="number"
          step="1"
          min="0"
          value={Math.round(ingredient.amount)}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="flex-1 px-3 py-2 border border-amber-300 dark:border-amber-600 
                   rounded-md shadow-sm bg-amber-50 dark:bg-amber-900/30
                   text-amber-900 dark:text-amber-100
                   focus:ring-2 focus:ring-amber-500 focus:border-amber-500
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors duration-200"
        />
        <span className="text-sm text-amber-700 dark:text-amber-300 font-medium min-w-[24px]">
          {ingredient.unit}
        </span>
      </div>
    </div>
  );
};