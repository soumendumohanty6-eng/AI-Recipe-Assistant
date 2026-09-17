import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Timer, 
  ChefHat, 
  Lightbulb,
  Clock
} from 'lucide-react';
import { Recipe } from '../types';

interface CookModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export const CookModal: React.FC<CookModalProps> = ({ recipe, onClose }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const steps = recipe.instructions;
  const currentStep = steps[currentStepIdx] || steps[0];

  // Timer state
  const defaultMinutes = currentStep.durationMinutes || 3;
  const [timeLeft, setTimeLeft] = useState(defaultMinutes * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset timer when step changes
  useEffect(() => {
    const mins = steps[currentStepIdx]?.durationMinutes || 3;
    setTimeLeft(mins * 60);
    setIsTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [currentStepIdx, steps]);

  // Timer tick
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const toggleTimer = () => {
    setIsTimerRunning(prev => !prev);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    const mins = currentStep.durationMinutes || 3;
    setTimeLeft(mins * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isLastStep = currentStepIdx === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm sm:text-base line-clamp-1">
                {recipe.name}
              </h4>
              <p className="text-xs text-stone-700">
                Step {currentStepIdx + 1} of {steps.length}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress bar */}
        <div className="w-full bg-stone-100 h-1.5">
          <div
            className="bg-amber-500 h-full transition-all duration-300"
            style={{ width: `${((currentStepIdx + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-6">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
              STEP {currentStep.stepNumber}
            </span>
            {currentStep.durationMinutes && (
              <span className="text-xs font-medium text-stone-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-700" />
                Est. {currentStep.durationMinutes} mins
              </span>
            )}
          </div>

          <div className="text-lg sm:text-2xl font-semibold text-stone-900 leading-relaxed sm:leading-snug">
            {currentStep.instruction}
          </div>

          {currentStep.tip && (
            <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-950 text-sm flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Chef Tip:</strong>
                <p className="text-amber-900/90 mt-0.5 leading-relaxed">{currentStep.tip}</p>
              </div>
            </div>
          )}

          {/* Cooking Step Timer Widget */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${timeLeft === 0 ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-700'}`}>
                <Timer className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-stone-700 uppercase font-bold tracking-wider block">
                  Kitchen Step Timer
                </span>
                <span className={`text-2xl sm:text-3xl font-mono font-bold ${timeLeft === 0 ? 'text-rose-600 animate-pulse' : 'text-stone-900'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={toggleTimer}
                className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 text-white transition-colors ${
                  isTimerRunning ? 'bg-stone-700 hover:bg-stone-800' : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>{timeLeft === 0 ? 'Restart' : 'Start Timer'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={resetTimer}
                className="p-2.5 rounded-xl border border-stone-200 bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Bottom Navigation */}
        <div className="p-4 sm:p-5 border-t border-stone-100 bg-stone-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setCurrentStepIdx(prev => Math.max(0, prev - 1))}
            disabled={currentStepIdx === 0}
            className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          {isLastStep ? (
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Finish Cooking!</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentStepIdx(prev => Math.min(steps.length - 1, prev + 1))}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
