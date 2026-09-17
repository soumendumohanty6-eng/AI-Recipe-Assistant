import React, { useState, KeyboardEvent } from 'react';
import { Plus, X, Sparkles, SlidersHorizontal, Trash2, CheckCircle2 } from 'lucide-react';
import { RecipePreferences } from '../types';

interface IngredientInputProps {
  ingredients: string[];
  onAddIngredient: (item: string) => void;
  onAddMultipleIngredients: (items: string[]) => void;
  onRemoveIngredient: (index: number) => void;
  onClearIngredients: () => void;
  preferences: RecipePreferences;
  onUpdatePreferences: (prefs: RecipePreferences) => void;
  onSuggestRecipes: () => void;
  isLoading: boolean;
}

const COMMON_SUGGESTIONS = [
  'rice',
  'tomato',
  'onion',
  'potato',
  'eggs',
  'garlic',
  'chicken',
  'pasta',
  'cheese',
  'bell pepper',
  'carrots',
  'flour'
];

export const IngredientInput: React.FC<IngredientInputProps> = ({
  ingredients,
  onAddIngredient,
  onAddMultipleIngredients,
  onRemoveIngredient,
  onClearIngredients,
  preferences,
  onUpdatePreferences,
  onSuggestRecipes,
  isLoading,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);

  const handleAdd = () => {
    if (!inputValue.trim()) return;

    // Support comma-separated or multi-ingredient text
    const parts = inputValue
      .split(/[,;\n]+/)
      .map(s => s.trim().replace(/^and\s+/i, ''))
      .filter(s => s.length > 0);

    if (parts.length > 1) {
      onAddMultipleIngredients(parts);
    } else if (parts.length === 1) {
      onAddIngredient(parts[0]);
    }
    setInputValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    } else if (e.key === ',') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!ingredients.some(i => i.toLowerCase() === suggestion.toLowerCase())) {
      onAddIngredient(suggestion);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-5 sm:p-7">
      <div className="flex flex-col gap-1 mb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
          What ingredients do you have at home?
        </h2>
        <p className="text-sm text-stone-700">
          Enter whatever is in your fridge or pantry (e.g. <span className="font-semibold text-stone-800">rice, tomato, onion, potato, eggs</span>) and get chef-crafted recipe ideas.
        </p>
      </div>

      {/* Main text input bar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <input
            id="ingredient-input-field"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type ingredient (e.g. rice, tomato, eggs) and press Enter..."
            className="w-full h-12 px-4 pr-12 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm sm:text-base transition-all"
            disabled={isLoading}
          />
          {inputValue && (
            <button
              onClick={() => setInputValue('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          id="add-ingredient-btn"
          onClick={handleAdd}
          disabled={!inputValue.trim() || isLoading}
          className="h-12 px-5 rounded-xl bg-stone-800 hover:bg-stone-900 disabled:bg-stone-200 disabled:text-stone-400 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed"
          type="button"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      {/* Quick suggestions pills */}
      <div className="mt-3.5">
        <div className="flex items-center justify-between text-xs text-stone-700 mb-2">
          <span>Quick add popular ingredients:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_SUGGESTIONS.map((item) => {
            const isAdded = ingredients.some(i => i.toLowerCase() === item.toLowerCase());
            return (
              <button
                key={item}
                type="button"
                onClick={() => handleSuggestionClick(item)}
                disabled={isAdded || isLoading}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                  isAdded
                    ? 'bg-amber-50 text-amber-800 border-amber-200 cursor-default opacity-70'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200 hover:border-stone-300 cursor-pointer active:scale-95'
                }`}
              >
                {isAdded ? (
                  <CheckCircle2 className="w-3 h-3 text-amber-700" />
                ) : (
                  <Plus className="w-3 h-3 text-stone-700" />
                )}
                <span className="capitalize">{item}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active ingredients basket */}
      <div className="mt-5 pt-4 border-t border-stone-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-800 uppercase tracking-wider">
              Your Available Ingredients ({ingredients.length})
            </span>
          </div>
          {ingredients.length > 0 && (
            <button
              id="clear-all-ingredients-btn"
              onClick={onClearIngredients}
              disabled={isLoading}
              className="text-xs text-stone-700 hover:text-rose-600 flex items-center gap-1 transition-colors"
              type="button"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear all</span>
            </button>
          )}
        </div>

        {ingredients.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-stone-200 text-center bg-stone-50/50">
            <p className="text-xs sm:text-sm text-stone-700">
              No ingredients added yet. Add at least 1 or 2 ingredients above to start generating recipes!
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {ingredients.map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/90 text-xs sm:text-sm font-medium shadow-2xs"
              >
                <span className="capitalize">{item}</span>
                <button
                  type="button"
                  onClick={() => onRemoveIngredient(index)}
                  disabled={isLoading}
                  className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-amber-200 text-amber-800 transition-colors"
                  aria-label={`Remove ${item}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Preferences & Dietary Filters Collapsible */}
      <div className="mt-5 pt-4 border-t border-stone-100">
        <button
          id="toggle-preferences-btn"
          type="button"
          onClick={() => setShowPreferences(!showPreferences)}
          className="flex items-center gap-2 text-xs sm:text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4 text-stone-700" />
          <span>Cooking Preferences & Dietary Filters</span>
          <span className="text-xs text-stone-700 font-normal">
            ({showPreferences ? 'Hide' : 'Optional'})
          </span>
        </button>

        {showPreferences && (
          <div className="mt-4 p-4 rounded-xl bg-stone-50/80 border border-stone-200/80 space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Dietary */}
              <div>
                <label className="block font-medium text-stone-700 mb-1.5">
                  Dietary Choice
                </label>
                <select
                  value={preferences.dietary || 'none'}
                  onChange={(e) =>
                    onUpdatePreferences({ ...preferences, dietary: e.target.value })
                  }
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs sm:text-sm"
                >
                  <option value="none">No Restrictions</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="gluten-free">Gluten-Free</option>
                  <option value="dairy-free">Dairy-Free</option>
                  <option value="low-carb">Low Carb</option>
                </select>
              </div>

              {/* Meal Type */}
              <div>
                <label className="block font-medium text-stone-700 mb-1.5">
                  Meal Category
                </label>
                <select
                  value={preferences.mealType || 'any'}
                  onChange={(e) =>
                    onUpdatePreferences({ ...preferences, mealType: e.target.value })
                  }
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs sm:text-sm"
                >
                  <option value="any">Any Meal</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="quick snack">Quick Snack / Light</option>
                </select>
              </div>

              {/* Max Cooking Time */}
              <div>
                <label className="block font-medium text-stone-700 mb-1.5">
                  Max Cooking Time
                </label>
                <select
                  value={preferences.maxTime || 'any'}
                  onChange={(e) =>
                    onUpdatePreferences({ ...preferences, maxTime: e.target.value })
                  }
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-xs sm:text-sm"
                >
                  <option value="any">Any Time</option>
                  <option value="15">Under 15 minutes</option>
                  <option value="30">Under 30 minutes</option>
                  <option value="45">Under 45 minutes</option>
                  <option value="60">Under 1 hour</option>
                </select>
              </div>
            </div>

            {/* Pantry Staples Toggle */}
            <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between">
              <div>
                <span className="font-medium text-stone-800">Assume Basic Pantry Staples</span>
                <p className="text-xs text-stone-700">
                  Allows small amounts of cooking oil, salt, black pepper, and water without needing to list them.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.pantryStaples}
                onChange={(e) =>
                  onUpdatePreferences({
                    ...preferences,
                    pantryStaples: e.target.checked,
                  })
                }
                className="w-4 h-4 text-amber-600 rounded-sm border-stone-300 focus:ring-amber-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Suggest Recipes Primary CTA */}
      <div className="mt-6 pt-5 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-stone-700 order-2 sm:order-1 text-center sm:text-left">
          {ingredients.length > 0 ? (
            <span>Ready to generate recipes with <strong className="text-stone-800">{ingredients.length} ingredient{ingredients.length > 1 ? 's' : ''}</strong></span>
          ) : (
            <span>Add your ingredients above to get started</span>
          )}
        </div>

        <button
          id="suggest-recipes-btn"
          type="button"
          onClick={onSuggestRecipes}
          disabled={ingredients.length === 0 || isLoading}
          className="w-full sm:w-auto h-13 px-8 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer order-1 sm:order-2 active:scale-98"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Cooking up recipes with AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-100" />
              <span>Suggest Recipes</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
