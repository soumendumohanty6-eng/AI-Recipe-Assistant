import React from 'react';
import { Sparkles, Utensils } from 'lucide-react';

interface SampleBasketsProps {
  onSelectBasket: (ingredients: string[]) => void;
  disabled?: boolean;
}

const SAMPLE_BASKETS = [
  {
    title: 'Pantry Classics (From Prompt)',
    description: 'Rice, Tomato, Onion, Potato, Eggs',
    ingredients: ['rice', 'tomato', 'onion', 'potato', 'eggs'],
    badge: 'Popular'
  },
  {
    title: 'Savory Quick Pasta',
    description: 'Pasta, Garlic, Tomato, Cheese, Onion',
    ingredients: ['pasta', 'garlic', 'tomato', 'cheese', 'onion'],
    badge: 'Quick'
  },
  {
    title: 'Hearty Protein Bowl',
    description: 'Chicken, Rice, Bell Pepper, Onion, Garlic',
    ingredients: ['chicken', 'rice', 'bell pepper', 'onion', 'garlic'],
    badge: 'High Protein'
  }
];

export const SampleBaskets: React.FC<SampleBasketsProps> = ({ onSelectBasket, disabled }) => {
  return (
    <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-amber-50/50 border border-amber-200/70">
      <div className="flex items-center gap-2 mb-2.5">
        <Sparkles className="w-4 h-4 text-amber-700" />
        <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
          Or try a sample ingredient basket:
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {SAMPLE_BASKETS.map((basket) => (
          <button
            key={basket.title}
            type="button"
            disabled={disabled}
            onClick={() => onSelectBasket(basket.ingredients)}
            className="p-3 rounded-xl bg-white border border-amber-200 hover:border-amber-400 hover:shadow-xs text-left transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                {basket.title}
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100/70 text-amber-900">
                {basket.badge}
              </span>
            </div>
            <p className="text-[11px] text-stone-700">
              {basket.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
