import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ApiService } from '@/services/apiClient';

export function useCoach(token: string | null) {
    const [groceryBudget, setGroceryBudget] = useState([30]);
    const [planDays, setPlanDays] = useState([3]);
    const [planMeals, setPlanMeals] = useState<string[]>(["lunch", "dinner"]);
    const [generatedPrompt, setGeneratedPrompt] = useState("");

    const generatePromptMutation = useMutation({
        mutationFn: (args: { language: string, meals: string[], currentPlanJson?: string }) =>
            ApiService.post('/smart-prompt', {
                type: "meal_plan",
                budget: groceryBudget[0],
                days: planDays[0],
                meals: args.meals,
                language: args.language,
                current_plan: args.currentPlanJson
            }, token as string),
        onSuccess: (json) => {
            if (json.error) {
                console.error("Coach Error:", json.error);
                return;
            }
            if (json.prompt) {
                const promptStr = typeof json.prompt === 'string' ? json.prompt : JSON.stringify(json.prompt);
                setGeneratedPrompt(promptStr);
            }
        },
        onError: (e) => {
            console.error("Generator Failed:", e);
        }
    });

    const generatePrompt = async (language: string, meals: string[], currentPlanJson?: string) => {
        if (!token) return;
        setGeneratedPrompt("");
        await generatePromptMutation.mutateAsync({ language, meals, currentPlanJson });
    };

    return {
        groceryBudget, setGroceryBudget,
        planDays, setPlanDays,
        planMeals, setPlanMeals,
        generatedPrompt, setGeneratedPrompt,
        generatePrompt,
        isGenerating: generatePromptMutation.isPending,
    };
}
