/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { IngredientInput } from './components/IngredientInput';
import { SampleBaskets } from './components/SampleBaskets';
import { RecipeCard } from './components/RecipeCard';
import { CookModal } from './components/CookModal';
import { SavedRecipesModal } from './components/SavedRecipesModal';
import { Recipe, RecipePreferences } from './types';
import { Sparkles, Utensils, AlertCircle, RefreshCw, ChefHat, Leaf } from 'lucide-react';

const LOCAL_STORAGE_SAVED_KEY = 'ai_recipe_assistant_saved';

export default function App() {
  // Pre-seed with prompt's exact example ingredients: rice, tomato, onion, potato, eggs
  const [ingredients, setIngredients] = useState<string[]>([
    'rice',
    'tomato',
    'onion',
    'potato',
    'eggs'
  ]);

  const [preferences, setPreferences] = useState<RecipePreferences>({
    mealType: 'any',
    dietary: 'none',
    maxTime: 'any',
    pantryStaples: true,
  });

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  // Saved recipes in local storage
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_SAVED_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activeCookingRecipe, setActiveCookingRecipe] = useState<Recipe | null>(null);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Sync saved recipes with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_SAVED_KEY, JSON.stringify(savedRecipes));
    } catch {
      // LocalStorage quota or unavailable
    }
  }, [savedRecipes]);

  const handleAddIngredient = (item: string) => {
    const trimmed = item.trim();
    if (!trimmed) return;
    if (!ingredients.some(i => i.toLowerCase() === trimmed.toLowerCase())) {
      setIngredients(prev => [...prev, trimmed]);
    }
  };

  const handleAddMultipleIngredients = (items: string[]) => {
    setIngredients(prev => {
      const next = [...prev];
      for (const item of items) {
        const trimmed = item.trim();
        if (trimmed && !next.some(i => i.toLowerCase() === trimmed.toLowerCase())) {
          next.push(trimmed);
        }
      }
      return next;
    });
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const handleClearIngredients = () => {
    setIngredients([]);
  };

  const handleToggleSaveRecipe = (recipe: Recipe) => {
    setSavedRecipes(prev => {
      const exists = prev.some(r => r.id === recipe.id || r.name === recipe.name);
      if (exists) {
        return prev.filter(r => r.id !== recipe.id && r.name !== recipe.name);
      } else {
        return [...prev, recipe];
      }
    });
  };

  const isRecipeSaved = (recipe: Recipe) => {
    return savedRecipes.some(r => r.id === recipe.id || r.name === recipe.name);
  };

  const handleSuggestRecipes = async () => {
    if (ingredients.length === 0) return;

    setIsLoading(true);
    setError(null);
    setWarning(null);

    try {
      const response = await fetch('/api/suggest-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients,
          preferences,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to suggest recipes.');
      }

      if (data.recipes && data.recipes.length > 0) {
        setRecipes(data.recipes);
        if (data.warning) {
          setWarning(data.warning);
        }
        // Smooth scroll to results
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        setError('No recipes could be generated with the given ingredients. Try adding another staple ingredient.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      <Header
        savedCount={savedRecipes.length}
        onOpenSaved={() => setIsSavedModalOpen(true)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        {/* Hero Banner / Introduction */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/70 text-amber-950 text-xs font-semibold">
            <Leaf className="w-3.5 h-3.5 text-amber-700" />
            <span>Zero Food Waste • Smart Kitchen Planning</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Cook Great Meals With What You Have
          </h2>
          <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
            Never wonder what to cook again. List your ingredients and let AI craft complete, tested recipes with exact steps and cooking times.
          </p>
        </div>

        {/* Ingredients input Card */}
        <section aria-label="Ingredient Input Section">
          <IngredientInput
            ingredients={ingredients}
            onAddIngredient={handleAddIngredient}
            onAddMultipleIngredients={handleAddMultipleIngredients}
            onRemoveIngredient={handleRemoveIngredient}
            onClearIngredients={handleClearIngredients}
            preferences={preferences}
            onUpdatePreferences={setPreferences}
            onSuggestRecipes={handleSuggestRecipes}
            isLoading={isLoading}
          />

          <SampleBaskets
            onSelectBasket={(sample) => {
              setIngredients(sample);
            }}
            disabled={isLoading}
          />
        </section>

        {/* Warning notification banner (e.g. fallback mode) */}
        {warning && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p>{warning}</p>
            </div>
          </div>
        )}

        {/* Error notification banner */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block">Generation Error</strong>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
            <button
              onClick={handleSuggestRecipes}
              className="px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && (
          <div ref={resultsRef} className="space-y-6 pt-4">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-amber-950">
              <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin shrink-0" />
              <div>
                <p className="font-semibold text-sm">
                  Chef AI is formulating recipes with {ingredients.slice(0, 4).join(', ')}...
                </p>
                <p className="text-xs text-amber-900/80 mt-0.5">
                  Calculating preparation steps, cooking times, and flavor pairings to minimize waste.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 animate-pulse space-y-4"
                >
                  <div className="h-6 bg-stone-200 rounded-md w-1/3" />
                  <div className="h-4 bg-stone-100 rounded-md w-2/3" />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-100">
                    <div className="h-10 bg-stone-100 rounded-lg" />
                    <div className="h-10 bg-stone-100 rounded-lg" />
                    <div className="h-10 bg-stone-100 rounded-lg" />
                    <div className="h-10 bg-stone-100 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Section */}
        {recipes.length > 0 && !isLoading && (
          <div ref={resultsRef} className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-200">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-amber-600" />
                  <span>Suggested Recipes ({recipes.length})</span>
                </h3>
                <p className="text-xs sm:text-sm text-stone-700">
                  Custom-tailored recipes featuring your available ingredients
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-stone-700">
                <span>Ingredients used:</span>
                <span className="font-semibold text-stone-900 capitalize">
                  {ingredients.slice(0, 3).join(', ')}
                  {ingredients.length > 3 ? ` +${ingredients.length - 3} more` : ''}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isSaved={isRecipeSaved(recipe)}
                  onToggleSave={handleToggleSaveRecipe}
                  onStartCooking={setActiveCookingRecipe}
                />
              ))}
            </div>
          </div>
        )}

        {/* Initial Prompt State (before generating) */}
        {recipes.length === 0 && !isLoading && (
          <div className="py-12 px-6 rounded-2xl bg-white border border-stone-200 text-center max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
              <ChefHat className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-stone-900 text-lg">
                Ready to find your next meal?
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                We've pre-filled a classic home pantry basket ({ingredients.join(', ')}). Click <strong className="text-stone-800">"Suggest Recipes"</strong> above to see instant AI recipes!
              </p>
            </div>
            <button
              onClick={handleSuggestRecipes}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm transition-colors cursor-pointer shadow-sm"
              type="button"
            >
              <Sparkles className="w-4 h-4 text-amber-100" />
              <span>Suggest Recipes Now</span>
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-stone-200 bg-white text-center text-xs text-stone-700">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AI Recipe Assistant • Powered by Google Gemini</span>
          <span>Helping home cooks reduce food waste & cook delicious everyday meals</span>
        </div>
      </footer>

      {/* Full-Screen Kitchen Cook Mode with Timer Modal */}
      {activeCookingRecipe && (
        <CookModal
          recipe={activeCookingRecipe}
          onClose={() => setActiveCookingRecipe(null)}
        />
      )}

      {/* Saved Recipes Modal */}
      {isSavedModalOpen && (
        <SavedRecipesModal
          savedRecipes={savedRecipes}
          onClose={() => setIsSavedModalOpen(false)}
          onRemove={(id) =>
            setSavedRecipes(prev => prev.filter(r => r.id !== id))
          }
          onSelectRecipe={(recipe) => {
            setActiveCookingRecipe(recipe);
            setIsSavedModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
