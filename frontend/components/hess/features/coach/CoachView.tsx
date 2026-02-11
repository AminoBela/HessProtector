import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { Translations } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { CoachGenerator } from "./CoachGenerator";
import { CoachSavedPlans } from "./CoachSavedPlans";
import { CoachResults } from "./CoachResults";
import { ApiService } from "@/services/apiClient";

interface CoachViewProps {
  data: any;
  groceryBudget: number[];
  setGroceryBudget: (value: number[]) => void;
  generatePrompt: (
    language: string,
    planMeals: string[],
    currentPlanJson?: string,
  ) => Promise<void>;
  generatedPrompt: string;
  planDays: number[];
  setPlanDays: (value: number[]) => void;
  planMeals: string[];
  setPlanMeals: (value: string[]) => void;
  language: string;
  onBack: () => void;
  theme: string;
  token?: string;
}

interface CoachResponse {
  analysis: string;
  meals: { day: string; lunch: string; dinner: string }[];
  shopping_list: { item: string; price: string }[];
  total_estimated_cost?: string;
  tips: string[];
}

interface SavedPlan {
  id: number;
  name: string;
  content_json: string;
  created_at: string;
}

export function CoachView({
  data,
  groceryBudget,
  setGroceryBudget,
  generatePrompt,
  generatedPrompt,
  planDays,
  setPlanDays,
  planMeals,
  setPlanMeals,
  language,
  onBack,
  theme,
  token,
}: CoachViewProps) {
  const isLight = theme === "light";
  const t =
    Translations[language as keyof typeof Translations]?.coach ||
    Translations.fr.coach;

  const [parsedData, setParsedData] = useState<CoachResponse | null>(null);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (generatedPrompt) {
      try {
        const json = JSON.parse(generatedPrompt);
        if (json.shopping_list && typeof json.shopping_list[0] === "string") {
          json.shopping_list = json.shopping_list.map((s: string) => ({
            item: s,
            price: "?",
          }));
        }
        setParsedData(json);
        setUpdating(false);
      } catch (e) {
        console.error("Failed to parse JSON", e);
        setUpdating(false);
      }
    }
  }, [generatedPrompt]);

  const fetchSavedPlans = useCallback(async () => {
    if (!token) return;
    try {
      const json = await ApiService.get("/plans", token);
      setSavedPlans(json);
    } catch (e) {
      console.error(e);
    }
  }, [token]);

  useEffect(() => {
    if (showSaved && token) fetchSavedPlans();
  }, [showSaved, token, fetchSavedPlans]);

  const handleSavePlan = async (name: string) => {
    if (!name.trim() || !parsedData || !token) return;
    setSaving(true);
    try {
      await ApiService.post(
        "/plans",
        { name, content: JSON.stringify(parsedData) },
        token,
      );
    } catch (e) {
      console.error("Error saving", e);
    }
    setSaving(false);
  };

  const handleDeletePlan = async (id: number) => {
    if (!token) return;
    try {
      await ApiService.delete(`/plans/${id}`, token);
      fetchSavedPlans();
    } catch (e) {
      console.error("Error deleting", e);
    }
  };

  const loadPlan = (plan: SavedPlan) => {
    try {
      const content = JSON.parse(plan.content_json);
      setParsedData(content);
      setShowSaved(false);
    } catch (e) {
      console.error("Error loading plan", e);
    }
  };

  const handleUpdateAI = () => {
    if (!parsedData) return;
    setUpdating(true);

    const hasLunch = parsedData.meals.some(
      (m) => m.lunch && m.lunch.trim().length > 0,
    );
    const hasDinner = parsedData.meals.some(
      (m) => m.dinner && m.dinner.trim().length > 0,
    );

    const newPlanMeals: string[] = [];
    if (hasLunch) newPlanMeals.push("lunch");
    if (hasDinner) newPlanMeals.push("dinner");

    if (newPlanMeals.length === 0) newPlanMeals.push("lunch");

    setPlanMeals(newPlanMeals);

    const sanitizedData = JSON.parse(JSON.stringify(parsedData));
    sanitizedData.meals = sanitizedData.meals.map((m: any) => {
      const newM = { ...m };
      if (!newPlanMeals.includes("lunch")) delete newM.lunch;
      if (!newPlanMeals.includes("dinner")) delete newM.dinner;
      return newM;
    });

    generatePrompt(language, newPlanMeals, JSON.stringify(sanitizedData));
  };

  if (showSaved) {
    return (
      <CoachSavedPlans
        savedPlans={savedPlans}
        onBack={() => setShowSaved(false)}
        onLoad={loadPlan}
        onDelete={handleDeletePlan}
        language={language}
        theme={theme}
      />
    );
  }

  if (generatedPrompt && !parsedData) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-180px)]">
        <Loader2
          className={`w-12 h-12 animate-spin mb-4 ${isLight ? "text-emerald-600" : "text-emerald-400"}`}
        />
        <p
          className={`text-lg font-bold animate-pulse ${isLight ? "text-slate-600" : "text-zinc-400"}`}
        >
          {t.analysis || "Analyse en cours..."}
        </p>
      </div>
    );
  }

  if (!parsedData && !generatedPrompt) {
    return (
      <CoachGenerator
        groceryBudget={groceryBudget}
        setGroceryBudget={setGroceryBudget}
        planDays={planDays}
        setPlanDays={setPlanDays}
        planMeals={planMeals}
        setPlanMeals={setPlanMeals}
        onGenerate={() => {
          setUpdating(true);
          generatePrompt(language, planMeals);
        }}
        onShowSaved={() => setShowSaved(true)}
        updating={updating}
        language={language}
        theme={theme}
        diet={data?.profile?.diet || "Standard"}
      />
    );
  }

  return (
    <CoachResults
      parsedData={
        parsedData || { analysis: "", meals: [], shopping_list: [], tips: [] }
      }
      setParsedData={setParsedData}
      onBack={() => {
        setParsedData(null);
        onBack();
      }}
      onUpdateAI={handleUpdateAI}
      onSavePlan={handleSavePlan}
      updating={updating}
      saving={saving}
      language={language}
      theme={theme}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      planMeals={planMeals}
      token={token}
    />
  );
}
