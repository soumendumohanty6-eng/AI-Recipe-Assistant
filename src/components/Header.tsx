import React from 'react';
import { ChefHat, Bookmark, Sparkles } from 'lucide-react';

interface HeaderProps {
  savedCount: number;
  onOpenSaved: () => void;
}

export const Header: React.FC<HeaderProps> = ({ savedCount, onOpenSaved }) => {
  return (
    <header className="w-full bg-white/95 border-b border-stone-200 backdrop-blur-sm sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-sm">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-lg sm:text-xl text-stone-900 tracking-tight">
                AI Recipe Assistant
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-amber-50 text-amber-800 rounded-full border border-amber-200/80">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Smart Chef
              </span>
            </div>
            <p className="text-xs text-stone-700 hidden sm:block">
              Turn what is in your fridge and pantry into easy, delicious meals
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="open-saved-recipes-btn"
            onClick={onOpenSaved}
            className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-colors border border-stone-200"
            title="View saved recipes"
          >
            <Bookmark className="w-4 h-4 text-amber-600" />
            <span>Saved Recipes</span>
            {savedCount > 0 && (
              <span className="bg-amber-600 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
