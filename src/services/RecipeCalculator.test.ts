import { describe, it, expect, beforeEach } from 'vitest';
import {
  RecipeCalculatorService,
  DefaultCalculationStrategy,
  CustomCalculationStrategy,
} from './RecipeCalculator';
import type { CustomProportions } from '../types/Recipe';

const DEFAULT_PROPORTIONS: CustomProportions = {
  cucumber: 333.33,
  greenPepper: 166.67,
  garlic: 12,
  oliveOil: 15,
  salt: 6,
  vinegar: 18,
};

describe('DefaultCalculationStrategy', () => {
  it('calculates correct amounts for 1000g tomato', () => {
    const strategy = new DefaultCalculationStrategy();
    const ingredients = strategy.calculate(1000);

    expect(ingredients).toHaveLength(7);
    expect(ingredients.find((i) => i.id === 'tomato')?.amount).toBe(1000);
    expect(ingredients.find((i) => i.id === 'cucumber')?.amount).toBeCloseTo(333.33, 1);
    expect(ingredients.find((i) => i.id === 'greenPepper')?.amount).toBeCloseTo(166.67, 1);
    expect(ingredients.find((i) => i.id === 'garlic')?.amount).toBe(12);
    expect(ingredients.find((i) => i.id === 'oliveOil')?.amount).toBe(15);
    expect(ingredients.find((i) => i.id === 'salt')?.amount).toBe(6);
    expect(ingredients.find((i) => i.id === 'vinegar')?.amount).toBe(18);
  });

  it('scales linearly for 500g tomato', () => {
    const strategy = new DefaultCalculationStrategy();
    const result1000 = strategy.calculate(1000);
    const result500 = strategy.calculate(500);

    result1000.forEach((ing, idx) => {
      expect(result500[idx].amount).toBeCloseTo(ing.amount / 2, 5);
    });
  });

  it('all ingredients have correct units', () => {
    const strategy = new DefaultCalculationStrategy();
    const ingredients = strategy.calculate(1000);
    ingredients.forEach((ing) => expect(ing.unit).toBe('g'));
  });
});

describe('CustomCalculationStrategy', () => {
  it('uses provided proportions', () => {
    const strategy = new CustomCalculationStrategy();
    const customProps: CustomProportions = {
      cucumber: 500,
      greenPepper: 200,
      garlic: 20,
      oliveOil: 30,
      salt: 10,
      vinegar: 25,
    };
    const ingredients = strategy.calculate(1000, customProps);

    expect(ingredients.find((i) => i.id === 'cucumber')?.amount).toBe(500);
    expect(ingredients.find((i) => i.id === 'garlic')?.amount).toBe(20);
  });
});

describe('RecipeCalculatorService', () => {
  let service: RecipeCalculatorService;

  beforeEach(() => {
    service = new RecipeCalculatorService();
  });

  it('calculateRecipe returns ingredients and totalVolume', () => {
    const recipe = service.calculateRecipe(1000);

    expect(recipe.ingredients).toHaveLength(7);
    expect(recipe.totalVolume).toBeGreaterThan(0);
    expect(recipe.totalVolume).toBeLessThan(5); // 1kg tomato shouldn't be > 5 liters
  });

  it('estimateVolume is reasonable for 1kg tomato', () => {
    const recipe = service.calculateRecipe(1000);
    // ~1000g tomato / 0.95 density = ~1052ml + other ingredients ≈ 1.5L
    expect(recipe.totalVolume).toBeGreaterThan(0.5);
    expect(recipe.totalVolume).toBeLessThan(3);
  });

  it('updateIngredientAmount: changing tomato updates all', () => {
    const recipe = service.calculateRecipe(1000);
    const updated = service.updateIngredientAmount(recipe.ingredients, 'tomato', 500);

    const tomato = updated.find((i) => i.id === 'tomato');
    const cucumber = updated.find((i) => i.id === 'cucumber');

    expect(tomato?.amount).toBe(500);
    expect(cucumber?.amount).toBeCloseTo(333.33 / 2, 0);
  });

  it('updateIngredientAmount: changing cucumber recalculates tomato proportionally', () => {
    const recipe = service.calculateRecipe(1000);
    const cucumberProportion = recipe.ingredients.find((i) => i.id === 'cucumber')!.proportion;
    const newCucumberAmount = 200;
    const expectedTomato = newCucumberAmount / cucumberProportion;

    const updated = service.updateIngredientAmount(
      recipe.ingredients,
      'cucumber',
      newCucumberAmount
    );
    const newTomato = updated.find((i) => i.id === 'tomato')?.amount;

    expect(newTomato).toBeCloseTo(expectedTomato, 1);
  });

  it('setStrategy switches calculation mode', () => {
    const customStrategy = new CustomCalculationStrategy();
    service.setStrategy(customStrategy);

    const customProportions: CustomProportions = {
      cucumber: 600,
      greenPepper: 100,
      garlic: 5,
      oliveOil: 20,
      salt: 8,
      vinegar: 15,
    };

    const recipe = service.calculateRecipe(1000, customProportions);
    expect(recipe.ingredients.find((i) => i.id === 'cucumber')?.amount).toBe(600);
  });
});

// Suppress unused variable warning for DEFAULT_PROPORTIONS
void DEFAULT_PROPORTIONS;
