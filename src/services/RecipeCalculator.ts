import { Ingredient, Recipe, CustomProportions } from '../types/Recipe';

// Strategy Pattern: Different calculation strategies
interface ICalculationStrategy {
  calculate(baseAmount: number, proportions: CustomProportions): Ingredient[];
}

// Default Juanje's proportions calculation strategy
export class DefaultCalculationStrategy implements ICalculationStrategy {
  calculate(tomatoAmount: number): Ingredient[] {
    return [
      {
        id: 'tomato',
        name: 'tomato',
        amount: tomatoAmount,
        unit: 'g',
        proportion: 1000 // grams per kg
      },
      {
        id: 'cucumber',
        name: 'cucumber',
        amount: (tomatoAmount * 333.33) / 1000,
        unit: 'g',
        proportion: 333.33 / 1000 // ratio per gram
      },
      {
        id: 'greenPepper',
        name: 'greenPepper',
        amount: (tomatoAmount * 166.67) / 1000,
        unit: 'g',
        proportion: 166.67 / 1000 // ratio per gram
      },
      {
        id: 'garlic',
        name: 'garlic',
        amount: (tomatoAmount * 12) / 1000,
        unit: 'g',
        proportion: 12 / 1000 // ratio per gram
      },
      {
        id: 'oliveOil',
        name: 'oliveOil',
        amount: (tomatoAmount * 15) / 1000,
        unit: 'g',
        proportion: 15 / 1000 // ratio per gram
      },
      {
        id: 'salt',
        name: 'salt',
        amount: (tomatoAmount * 6) / 1000,
        unit: 'g',
        proportion: 6 / 1000 // ratio per gram
      },
      {
        id: 'vinegar',
        name: 'vinegar',
        amount: (tomatoAmount * 18) / 1000,
        unit: 'g',
        proportion: 18 / 1000 // ratio per gram
      }
    ];
  }
}

// Custom proportions calculation strategy
export class CustomCalculationStrategy implements ICalculationStrategy {
  calculate(tomatoAmount: number, proportions: CustomProportions): Ingredient[] {
    return [
      {
        id: 'tomato',
        name: 'tomato',
        amount: tomatoAmount,
        unit: 'g',
        proportion: 1
      },
      {
        id: 'cucumber',
        name: 'cucumber',
        amount: tomatoAmount * (proportions.cucumber / 1000),
        unit: 'g',
        proportion: proportions.cucumber / 1000
      },
      {
        id: 'greenPepper',
        name: 'greenPepper',
        amount: tomatoAmount * (proportions.greenPepper / 1000),
        unit: 'g',
        proportion: proportions.greenPepper / 1000
      },
      {
        id: 'garlic',
        name: 'garlic',
        amount: tomatoAmount * (proportions.garlic / 1000),
        unit: 'g',
        proportion: proportions.garlic / 1000
      },
      {
        id: 'oliveOil',
        name: 'oliveOil',
        amount: tomatoAmount * (proportions.oliveOil / 1000),
        unit: 'g',
        proportion: proportions.oliveOil / 1000
      },
      {
        id: 'salt',
        name: 'salt',
        amount: tomatoAmount * (proportions.salt / 1000),
        unit: 'g',
        proportion: proportions.salt / 1000
      },
      {
        id: 'vinegar',
        name: 'vinegar',
        amount: tomatoAmount * (proportions.vinegar / 1000),
        unit: 'g',
        proportion: proportions.vinegar / 1000
      }
    ];
  }
}

// Context class that uses the strategy
export class RecipeCalculatorService {
  private strategy: ICalculationStrategy;

  constructor(strategy: ICalculationStrategy = new DefaultCalculationStrategy()) {
    this.strategy = strategy;
  }

  setStrategy(strategy: ICalculationStrategy): void {
    this.strategy = strategy;
  }

  calculateRecipe(tomatoAmount: number, customProportions?: CustomProportions): Recipe {
    const ingredients = customProportions 
      ? this.strategy.calculate(tomatoAmount, customProportions)
      : this.strategy.calculate(tomatoAmount);

    const totalVolume = this.estimateVolume(ingredients);

    return {
      ingredients,
      totalVolume
    };
  }

  private estimateVolume(ingredients: Ingredient[]): number {
    // Approximate densities in g/ml
    const densities = {
      tomato: 0.95,
      cucumber: 0.96,
      greenPepper: 0.93,
      garlic: 1.2,
      oliveOil: 0.91,
      salt: 2.16,
      vinegar: 1.05
    };

    let totalVolumeML = 0;

    ingredients.forEach(ingredient => {
      const weightInGrams = ingredient.amount;
      
      const density = densities[ingredient.id as keyof typeof densities] || 1;
      totalVolumeML += weightInGrams / density;
    });

    return Math.round((totalVolumeML / 1000) * 100) / 100; // Convert to liters and round to 2 decimals
  }

  // Observer Pattern: Notify when ingredient changes
  updateIngredientAmount(
    ingredients: Ingredient[], 
    changedIngredientId: string, 
    newAmount: number,
    customProportions?: CustomProportions
  ): Ingredient[] {
    const changedIngredient = ingredients.find(ing => ing.id === changedIngredientId);
    if (!changedIngredient) return ingredients;

    // Calculate base tomato amount from the changed ingredient
    let baseTomatoAmount: number;
    
    if (changedIngredientId === 'tomato') {
      baseTomatoAmount = newAmount;
    } else {
      baseTomatoAmount = newAmount / changedIngredient.proportion;
    }

    // Recalculate all ingredients based on new base amount
    return customProportions 
      ? this.strategy.calculate(baseTomatoAmount, customProportions)
      : this.strategy.calculate(baseTomatoAmount);
  }
}