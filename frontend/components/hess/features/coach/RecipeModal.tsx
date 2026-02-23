import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Flame, Dumbbell, ChefHat, Info, CheckCircle2 } from "lucide-react";
import React, { useState } from "react";
import { Recipe } from "./CoachResults";

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe | null;
  loading: boolean;
  language: string;
  theme: string;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  isOpen,
  onClose,
  recipe,
  loading,
  language,
  theme,
}) => {
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});

  const toggleIngredient = (index: number) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  if (!isOpen) return null;

  if (loading) {
    return (
      <AnimatePresence>
        <div className="fixed top-0 left-0 w-full min-h-[100dvh] z-[120] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`w-full max-w-sm rounded-[2rem] p-10 text-center shadow-2xl border ${theme === "light" ? "bg-white/90 border-slate-200" : "bg-zinc-900/90 border-white/10"}`}
          >
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${theme === "light" ? "bg-emerald-50 text-emerald-500" : "bg-emerald-500/10 text-emerald-400"}`}>
              <ChefHat className="w-12 h-12 animate-pulse" />
            </div>
            <h3 className={`text-2xl font-black mb-3 tracking-tight ${theme === "light" ? "text-slate-900" : "text-white"}`}>
              {language === "fr" ? "Le Chef cogite..." : "The Chef is cooking..."}
            </h3>
            <p className={`text-sm font-medium leading-relaxed ${theme === "light" ? "text-slate-500" : "text-zinc-400"}`}>
              {language === "fr"
                ? "Analyse de votre frigo et création d'une recette sur-mesure."
                : "Checking your fridge and crafting the perfect custom recipe."}
            </p>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  if (!recipe) return null;

  return (
    <AnimatePresence>
      <div className="fixed top-0 left-0 w-full min-h-[100dvh] z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 overflow-hidden">
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className={`w-full max-w-2xl max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden relative ${theme === "light" ? "bg-slate-50 border border-white" : "bg-zinc-950 border border-white/10"}`}
        >
          {/* Header Image/Gradient Block */}
          <div className="relative min-h-[12rem] sm:min-h-[16rem] flex-shrink-0 w-full overflow-hidden flex flex-col justify-end pt-16">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-700" />

            {/* Overlay Pattern */}
            <div className="absolute inset-0 opacity-[0.03] text-white"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}
            />

            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-3 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full transition-all text-white hover:scale-110 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative z-10 p-6 sm:p-8 mt-auto w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight drop-shadow-md pb-2">
                <span className="text-emerald-300">{recipe.title?.split(" ")[0]}</span> {recipe.title?.replace(/^[^\s]+\s/, "")}
              </h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {/* Stats Bar */}
            <div className={`flex flex-wrap items-center gap-3 p-6 sm:px-8 border-b ${theme === "light" ? "bg-white border-slate-100" : "bg-zinc-900 border-white/5"}`}>

              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${theme === "light" ? "bg-blue-50 text-blue-600" : "bg-blue-500/10 text-blue-400"}`}>
                <Clock className="w-4 h-4" /> {recipe.time || (recipe as any).prep_time || (language === "fr" ? "20-30 min" : "20-30 min")}
              </div>

              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${theme === "light" ? "bg-purple-50 text-purple-600" : "bg-purple-500/10 text-purple-400"}`}>
                <Dumbbell className="w-4 h-4" /> {recipe.difficulty || (language === "fr" ? "Facile" : "Easy")}
              </div>

              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${theme === "light" ? "bg-orange-50 text-orange-600" : "bg-orange-500/10 text-orange-400"}`}>
                <Flame className="w-4 h-4" /> {recipe.calories || (language === "fr" ? "~400 kcal" : "~400 kcal")}
              </div>

            </div>

            <div className="p-6 sm:p-8 space-y-12">
              {/* Ingredients */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2 rounded-lg ${theme === "light" ? "bg-emerald-100 text-emerald-600" : "bg-emerald-500/20 text-emerald-400"}`}>
                    <ChefHat className="w-5 h-5" />
                  </div>
                  <h3 className={`text-xl font-black uppercase tracking-widest ${theme === "light" ? "text-slate-800" : "text-zinc-100"}`}>
                    {language === "fr" ? "Ingrédients" : "Ingredients"}
                  </h3>
                </div>

                <div className="space-y-3">
                  {recipe.ingredients?.map((ing, i) => (
                    <div
                      key={i}
                      onClick={() => toggleIngredient(i)}
                      className={`group flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${checkedIngredients[i]
                        ? theme === "light" ? "bg-slate-50/50 border-slate-200 opacity-50" : "bg-zinc-900/30 border-white/5 opacity-50"
                        : theme === "light" ? "bg-white border-slate-200 shadow-sm hover:border-emerald-300" : "bg-zinc-900 border-white/5 hover:border-emerald-500/30"
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${checkedIngredients[i]
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : theme === "light" ? "border-slate-300" : "border-zinc-600"
                          }`}>
                          {checkedIngredients[i] && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <span className={`font-medium ${checkedIngredients[i]
                          ? "line-through text-slate-400 dark:text-zinc-500"
                          : theme === "light" ? "text-slate-700" : "text-zinc-200"
                          }`}>
                          {ing.item || (ing as any).name}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className={`block font-black ${checkedIngredients[i]
                          ? "text-slate-400 dark:text-zinc-500"
                          : "text-emerald-500"
                          }`}>
                          {ing.qty}
                        </span>
                        {ing.substitution && !checkedIngredients[i] && (
                          <span className={`block text-xs italic ${theme === "light" ? "text-amber-600" : "text-amber-400"}`}>
                            {language === "fr" ? "Ou :" : "Or:"} {ing.substitution}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Preparation Steps */}
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className={`p-2 rounded-lg ${theme === "light" ? "bg-indigo-100 text-indigo-600" : "bg-indigo-500/20 text-indigo-400"}`}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className={`text-xl font-black uppercase tracking-widest ${theme === "light" ? "text-slate-800" : "text-zinc-100"}`}>
                    {language === "fr" ? "Préparation" : "Preparation"}
                  </h3>
                </div>

                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[1.1rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:max-h-[90vh] before:w-0.5 before:bg-gradient-to-b before:from-emerald-500/20 before:via-emerald-500/20 before:to-transparent">
                  {recipe.steps?.map((step: string, i: number) => (
                    <div key={i} className="relative flex items-start gap-6 group">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg z-10 transition-colors ${theme === "light" ? "bg-white border-2 border-emerald-200 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white" : "bg-zinc-950 border-2 border-emerald-500/30 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white"}`}>
                        {i + 1}
                      </div>
                      <div className={`flex-1 pt-1.5 pb-4 ${theme === "light" ? "text-slate-600" : "text-zinc-300"}`}>
                        <p className="leading-relaxed text-[1.05rem] font-medium">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Chef's Tip Sticky Footer */}
          {(recipe.chef_tip || (recipe as any).tips) && (
            <div className={`flex-shrink-0 p-5 sm:p-6 border-t ${theme === "light" ? "bg-emerald-50/80 border-emerald-100" : "bg-emerald-950/30 border-emerald-900/30"}`}>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-emerald-500/20 rounded-full">
                  <Info className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest mb-1">
                    {language === "fr" ? "Le Mot du Chef" : "Chef's Tip"}
                  </h4>
                  <p className={`text-sm font-medium italic ${theme === "light" ? "text-emerald-800" : "text-emerald-200"}`}>
                    &quot;{recipe.chef_tip || (recipe as any).tips}&quot;
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
