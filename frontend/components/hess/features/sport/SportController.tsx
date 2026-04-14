import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/context/SettingsContext";
import { SportView } from "./SportView";
import { SportResults } from "./SportResults";
import { SportSavedPlans } from "./SportSavedPlans";
import { ApiService } from "@/services/apiClient";

export function SportController() {
  const { token } = useAuth();
  const { theme, language } = useSettings();

  const [currentView, setCurrentView] = useState<"generator" | "results" | "saved">("generator");
  const [isGenerating, setIsGenerating] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [savedPlans, setSavedPlans] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerate = useCallback(async (generateReq: any, profileParams: any) => {
    if (!token) return;
    setIsGenerating(true);
    try {
      const data = await ApiService.post("/sport/generate", generateReq, token);
      if (data.plan) {
        setParsedData(data.plan);
        setCurrentView("results");
      }
    } catch (e) {
      console.error(e);
    }
    setIsGenerating(false);
  }, [token]);

  const handleReadapt = async (checkinNotes: string, weightKg: number, fatigue: number) => {
    if (!token || !parsedData) return;
    setIsGenerating(true);
    try {
      // Create checkin
      await ApiService.post("/sport/checkin", {
         weight_kg_recorded: weightKg,
         fatigue_level: fatigue,
         notes: checkinNotes
      }, token);

      // Generate readapted plan
      const data = await ApiService.post("/sport/generate", {
         mode: "readapt",
         weeks_duration: parsedData.weeks ? parsedData.weeks.length : 4,
         current_plan_json: JSON.stringify(parsedData),
         latest_checkin_notes: checkinNotes
      }, token);
      
      if (data.plan) {
         setParsedData(data.plan);
         setCurrentView("results");
      }
    } catch (e) {
      console.error(e);
    }
    setIsGenerating(false);
  };

  const loadSavedPlans = useCallback(async () => {
    if (!token) return;
    try {
      const data = await ApiService.get("/sport/plans", token);
      setSavedPlans(data);
    } catch (e) {
      console.error(e);
    }
  }, [token]);

  const handleShowSaved = () => {
    loadSavedPlans();
    setCurrentView("saved");
  };

  const handleSavePlan = async (name: string) => {
    if (!token || !parsedData) return;
    setIsSaving(true);
    try {
      await ApiService.post("/sport/plans", { name, content_json: JSON.stringify(parsedData) }, token);
      await loadSavedPlans();
    } catch (e) {
      console.error(e);
    }
    setIsSaving(false);
  };

  const handleDeletePlan = async (id: number) => {
    if (!token) return;
    try {
      await ApiService.delete(`/sport/plans/${id}`, token);
      await loadSavedPlans();
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoadPlan = (plan: any) => {
    try {
      const data = JSON.parse(plan.content_json);
      setParsedData(data);
      setCurrentView("results");
    } catch (e) {
      console.error(e);
    }
  };

  if (currentView === "results" && parsedData) {
    return (
      <SportResults
        parsedData={parsedData}
        onBack={() => setCurrentView("generator")}
        onSavePlan={handleSavePlan}
        saving={isSaving}
        isGenerating={isGenerating}
        onReadapt={handleReadapt}
        language={language}
        theme={theme}
      />
    );
  }

  if (currentView === "saved") {
    return (
      <SportSavedPlans
        savedPlans={savedPlans}
        onBack={() => setCurrentView("generator")}
        onLoad={handleLoadPlan}
        onDelete={handleDeletePlan}
        language={language}
        theme={theme}
      />
    );
  }

  return (
    <SportView
      language={language}
      theme={theme}
      token={token || ""}
      onShowSaved={handleShowSaved}
      onGenerate={handleGenerate}
      isGenerating={isGenerating}
    />
  );
}
