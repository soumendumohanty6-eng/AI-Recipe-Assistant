export interface RecipeIngredient {
  name: string;
  amount: string;
  isUserProvided: boolean;
  notes?: string;
}

export interface CookingStep {
  stepNumber: number;
  instruction: string;
  durationMinutes?: number;
  tip?: string;
}

export interface Recipe {
  id: string;
  name: string;
  tagline: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  servings: string;
  cuisine?: string;
  ingredientsRequired: RecipeIngredient[];
  instructions: CookingStep[];
  chefTip?: string;
  matchedIngredientsCount: number;
  totalIngredientsCount: number;
}

export interface RecipePreferences {
  mealType?: string; // 'any' | 'breakfast' | 'lunch' | 'dinner' | 'snack'
  dietary?: string; // 'none' | 'vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free' | 'low-carb'
  maxTime?: string; // 'any' | '15' | '30' | '45' | '60'
  pantryStaples: boolean; // assume salt, black pepper, cooking oil, and water are available
}

export interface RecipeResponse {
  recipes: Recipe[];
  notes?: string;
}
