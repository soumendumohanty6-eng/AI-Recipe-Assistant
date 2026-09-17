import React, { useState } from 'react';
import { 
  Clock, 
  Flame, 
  ChefHat, 
  Bookmark, 
  BookmarkCheck, 
  Check, 
  Copy, 
  Play, 
  Lightbulb, 
  Users, 
  Share2,
  CheckCircle2,
  ListOrdered
} from 'lucide-react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  isSaved: boolean;
  onToggleSave: (recipe: Recipe) => void;
  onStartCooking: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isSaved,
  onToggleSave,
  onStartCooking,
}) => {
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);

  const toggleIngredient = (idx: number) => {
    setCheckedIngredients(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleStep = (idx: number) => {
    setCompletedSteps(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleCopyRecipe = async () => {
    const text = `🍳 ${recipe.name}\n${recipe.tagline}\n\n⏱️ Total Time: ${recipe.totalTime} (Prep: ${recipe.prepTime}, Cook: ${recipe.cookTime})\n📊 Difficulty: ${recipe.difficulty} | Servings: ${recipe.servings}\n\n🛒 INGREDIENTS:\n${recipe.ingredientsRequired
      .map(i => `- ${i.amount} ${i.name}${i.notes ? ` (${i.notes})` : ''}`)
      .join('\n')}\n\n📋 INSTRUCTIONS:\n${recipe.instructions
      .map(s => `${s.stepNumber}. ${s.instruction}${s.tip ? ` (Tip: ${s.tip})` : ''}`)
      .join('\n')}\n\n💡 CHEF TIP: ${recipe.chefTip || 'Enjoy your homemade meal!'}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
    }
  };

  const difficultyColors = {
    Easy: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    Medium: 'bg-amber-50 text-amber-800 border-amber-200',
    Hard: 'bg-rose-50 text-rose-800 border-rose-200',
  };

  const completedStepsCount = Object.values(completedSteps).filter(Boolean).length;
  const totalStepsCount = recipe.instructions.length;
  const progressPercent = totalStepsCount > 0 ? Math.round((completedStepsCount / totalStepsCount) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      {/* Recipe Header Banner */}
      <div className="p-6 sm:p-7 border-b border-stone-100 bg-gradient-to-b from-stone-50/70 to-white">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  difficultyColors[recipe.difficulty] || difficultyColors.Easy
                }`}
              >
                {recipe.difficulty} Difficulty
              </span>

              {recipe.cuisine && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                  {recipe.cuisine}
                </span>
              )}

              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/70">
                ✨ Uses {recipe.matchedIngredientsCount} of your ingredients
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight leading-snug">
              {recipe.name}
            </h3>
            <p className="text-sm text-stone-700 mt-1 leading-relaxed">
              {recipe.tagline}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onToggleSave(recipe)}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-amber-50 border-amber-300 text-amber-600'
                  : 'bg-white border-stone-200 text-stone-500 hover:text-stone-800 hover:bg-stone-50'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save recipe'}
              type="button"
            >
              {isSaved ? <BookmarkCheck className="w-5 h-5 fill-amber-500 text-amber-600" /> : <Bookmark className="w-5 h-5" />}
            </button>

            <button
              onClick={handleCopyRecipe}
              className="p-2.5 rounded-xl border border-stone-200 bg-white text-stone-500 hover:text-stone-800 hover:bg-stone-50 transition-colors cursor-pointer"
              title="Copy recipe text"
              type="button"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Time and Servings Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-stone-200/60 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-stone-700">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="text-[11px] text-stone-700 block uppercase font-medium">Prep Time</span>
              <span className="font-semibold text-stone-900">{recipe.prepTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-stone-700">
            <Flame className="w-4 h-4 text-orange-600 shrink-0" />
            <div>
              <span className="text-[11px] text-stone-700 block uppercase font-medium">Cooking Time</span>
              <span className="font-semibold text-stone-900">{recipe.cookTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-stone-700">
            <Clock className="w-4 h-4 text-stone-700 shrink-0" />
            <div>
              <span className="text-[11px] text-stone-700 block uppercase font-medium">Total Time</span>
              <span className="font-bold text-stone-900">{recipe.totalTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-stone-700">
            <Users className="w-4 h-4 text-stone-700 shrink-0" />
            <div>
              <span className="text-[11px] text-stone-700 block uppercase font-medium">Servings</span>
              <span className="font-semibold text-stone-900">{recipe.servings}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Ingredients and Instructions */}
      <div className="p-6 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-7 flex-1">
        {/* Ingredients Column (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-amber-600" />
              <h4 className="font-bold text-stone-900 text-base">
                Ingredients Required
              </h4>
            </div>
            <span className="text-xs text-stone-700">
              {recipe.ingredientsRequired.length} items
            </span>
          </div>

          <p className="text-xs text-stone-700 mb-3">
            Click an item to check it off as you assemble your mise-en-place:
          </p>

          <ul className="space-y-2 flex-1">
            {recipe.ingredientsRequired.map((ing, idx) => {
              const isChecked = !!checkedIngredients[idx];
              return (
                <li
                  key={`${ing.name}-${idx}`}
                  onClick={() => toggleIngredient(idx)}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition-colors select-none ${
                    isChecked
                      ? 'bg-stone-50 border-stone-200 text-stone-400 line-through'
                      : 'bg-stone-50/60 hover:bg-stone-100/80 border-stone-200 text-stone-800'
                  }`}
                >
                  <div
                    className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                      isChecked
                        ? 'bg-amber-600 border-amber-600 text-white'
                        : 'border-stone-300 bg-white'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>

                  <div className="flex-1 flex items-baseline justify-between gap-2">
                    <span className="font-medium text-stone-900">
                      {ing.name}
                    </span>
                    <span className="text-xs text-stone-700 shrink-0 font-mono">
                      {ing.amount}
                    </span>
                  </div>

                  {ing.isUserProvided ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200/80 shrink-0">
                      From your list
                    </span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-200/70 text-stone-700 shrink-0">
                      Pantry staple
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          {recipe.chefTip && (
            <div className="mt-5 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/70 text-xs text-amber-900 flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-amber-950">Chef Tip:</strong>
                <p className="mt-0.5 leading-relaxed text-amber-900/90">{recipe.chefTip}</p>
              </div>
            </div>
          )}
        </div>

        {/* Step-by-Step Instructions Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col border-t lg:border-t-0 lg:border-l border-stone-100 pt-6 lg:pt-0 lg:pl-7">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-orange-600" />
              <h4 className="font-bold text-stone-900 text-base">
                Step-by-Step Cooking Instructions
              </h4>
            </div>

            {completedStepsCount > 0 && (
              <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {completedStepsCount}/{totalStepsCount} completed ({progressPercent}%)
              </span>
            )}
          </div>

          <ol className="space-y-3.5 flex-1">
            {recipe.instructions.map((step, idx) => {
              const isDone = !!completedSteps[idx];
              return (
                <li
                  key={step.stepNumber}
                  onClick={() => toggleStep(idx)}
                  className={`p-3.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all flex items-start gap-3 select-none ${
                    isDone
                      ? 'bg-stone-50/80 border-stone-200 text-stone-400 opacity-75'
                      : 'bg-white hover:bg-stone-50/80 border-stone-200/90 text-stone-800 shadow-2xs'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 transition-colors ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-100 text-stone-700 border border-stone-200'
                    }`}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.stepNumber}
                  </div>

                  <div className="flex-1 space-y-1">
                    <p className={`leading-relaxed ${isDone ? 'line-through text-stone-500' : 'text-stone-800 font-normal'}`}>
                      {step.instruction}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {step.durationMinutes && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md font-medium">
                          <Clock className="w-3 h-3 text-stone-700" />
                          ~{step.durationMinutes} min{step.durationMinutes > 1 ? 's' : ''}
                        </span>
                      )}

                      {step.tip && (
                        <span className="text-[11px] text-amber-900 bg-amber-50/90 px-2 py-0.5 rounded-md border border-amber-200/60">
                          Tip: {step.tip}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Cooking Mode CTA */}
          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
            <button
              onClick={() => onStartCooking(recipe)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              type="button"
            >
              <Play className="w-4 h-4 fill-white text-white" />
              <span>Enter Focused Cook Mode with Timer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
