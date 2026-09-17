import React from 'react';
import { X, Bookmark, Trash2, Play, Clock, Flame, ChefHat } from 'lucide-react';
import { Recipe } from '../types';

interface SavedRecipesModalProps {
  savedRecipes: Recipe[];
  onClose: () => void;
  onRemove: (recipeId: string) => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

export const SavedRecipesModal: React.FC<SavedRecipesModalProps> = ({
  savedRecipes,
  onClose,
  onRemove,
  onSelectRecipe,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-600 fill-amber-500" />
            <h3 className="font-bold text-stone-900 text-base sm:text-lg">
              Saved Recipes ({savedRecipes.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {savedRecipes.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
                <Bookmark className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-800 text-base">No saved recipes yet</h4>
              <p className="text-xs sm:text-sm text-stone-700 mt-1 max-w-sm mx-auto">
                When you see a recipe suggestion you love, click the bookmark icon on the recipe card to save it for later!
              </p>
            </div>
          ) : (
            savedRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="p-4 sm:p-5 rounded-2xl border border-stone-200 bg-white hover:border-amber-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                      {recipe.difficulty}
                    </span>
                    <span className="text-[11px] text-stone-700 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-stone-700" />
                      {recipe.totalTime}
                    </span>
                  </div>

                  <h4 className="font-bold text-stone-900 text-base">
                    {recipe.name}
                  </h4>
                  <p className="text-xs text-stone-700 line-clamp-1 mt-0.5">
                    {recipe.tagline}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  <button
                    onClick={() => {
                      onSelectRecipe(recipe);
                      onClose();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Cook</span>
                  </button>

                  <button
                    onClick={() => onRemove(recipe.id)}
                    className="p-2 rounded-xl border border-stone-200 text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
