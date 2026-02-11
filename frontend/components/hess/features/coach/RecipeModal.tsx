import { motion } from "framer-motion";
import { X, Clock, Flame, Dumbbell, ChefHat, Info } from "lucide-react";
import React from "react";
import { Recipe } from "./CoachResults";

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe | null;
  loading: boolean;
  language: string;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  isOpen,
  onClose,
  recipe,
  loading,
  language,
}) => {
  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md bg-zinc-900 border border-emerald-500/30 rounded-3xl p-8 text-center shadow-2xl"
        >
          <ChefHat className="w-16 h-16 text-emerald-400 mx-auto mb-4 animate-bounce" />
          <h3 className="text-xl font-bold text-white mb-2">
            {language === "fr"
              ? "Le Chef réfléchit..."
              : "The Chef is cooking..."}
          </h3>
          <p className="text-zinc-400 text-sm">
            {language === "fr"
              ? "Analyse du frigo et création de la recette parfaite."
              : "Checking the fridge and crafting the perfect recipe."}
          </p>
        </motion.div>
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overscroll-none">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex justify-between items-start bg-zinc-900 z-10">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="text-4xl">{recipe.title?.split(" ")[0]}</span>{" "}
              {/* Emoji assumption */}
              <span>{recipe.title?.replace(/^[^\s]+\s/, "") || "Recette"}</span>
            </h2>
            <div className="flex gap-4 mt-3 text-sm font-medium text-emerald-400">
              {recipe.time && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {recipe.time}
                </div>
              )}
              {recipe.difficulty && (
                <div className="flex items-center gap-1">
                  <Dumbbell className="w-4 h-4" /> {recipe.difficulty}
                </div>
              )}
              {recipe.calories && (
                <div className="flex items-center gap-1">
                  <Flame className="w-4 h-4" /> {recipe.calories}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors text-foreground"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 overflow-y-auto space-y-8 scrollbar-hide">
          {/* Ingredients */}
          <div>
            <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2 uppercase tracking-widest">
              {language === "fr" ? "Ingrédients" : "Ingredients"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recipe.ingredients?.map((ing, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-zinc-800"
                >
                  <span className="text-zinc-200 font-medium">{ing.item}</span>
                  <div className="text-right">
                    <span className="block text-emerald-400 text-sm font-bold">
                      {ing.qty}
                    </span>
                    {ing.substitution && (
                      <span className="block text-xs text-amber-500 italic">
                        Example: {ing.substitution}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div>
            <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2 uppercase tracking-widest">
              {language === "fr" ? "Préparation" : "Preparation"}
            </h3>
            <div className="space-y-4">
              {recipe.steps?.map((step: string, i: number) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-900/30 text-emerald-400 rounded-full flex items-center justify-center font-bold border border-emerald-500/20">
                    {i + 1}
                  </div>
                  <p className="text-zinc-300 leading-relaxed pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer - Tip */}
        {recipe.chef_tip && (
          <div className="p-4 bg-emerald-900/10 border-t border-emerald-500/20">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-emerald-400 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1">
                  Chef&apos;s Tip
                </h4>
                <p className="text-emerald-300 text-sm italic">
                  &quot;{recipe.chef_tip}&quot;
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
