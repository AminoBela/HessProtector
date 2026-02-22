from app.services.strategies.prompt_strategy import PromptStrategy
from typing import Dict

class MealPlanPromptStrategy(PromptStrategy):
    def build_prompt(self, request, context: Dict) -> str:
        p = context.get("profile", {})
        inv_list = [f"{i['item']} ({i['qty']})" for i in context.get("pantry", [])]
        inv = ", ".join(inv_list) if inv_list else "EMPTY (You must buy EVERYTHING)"

        goals_str = (
            ", ".join(
                [
                    f"{g['label']} (Target: {g['target']}€)"
                    for g in context.get("goals", [])
                ]
            )
            or "Aucun objectif défini"
        )

        lang_instruction = (
            "Respond in French."
            if request.language == "fr"
            else "Respond in Spanish (Español)."
        )
        meals_str = ", ".join(request.meals).upper()

        prompt = f"""
        You are a frugal financial coach.
        Goal: Sustain the user for {request.days} days with {request.budget}€.
        
        CONTEXT:
        - Pantry: {inv}
        - Goals: {goals_str}
        - Diet: {p.get('diet', 'Standard')}
        
        INSTRUCTIONS:
        1. Create a strictly budget-compliant meal plan.
        2. Use pantry items first.
        3. Recipes must be cheap and simple.
        4. {lang_instruction}
        
        OUTPUT JSON ONLY:
        {{
            "analysis": "Brief comment on budget vs duration (1 sentence).",
            "total_estimated_cost": "Cost string",
            "shopping_list": [{{"item": "Name", "price": "Cost"}}],
            "meals": [
                {{
                    "day": "Day X",
                    "lunch": "Recipe Name",
                    "dinner": "Recipe Name"
                }}
            ],
            "tips": ["Short tip 1", "Short tip 2"]
        }}
        
        CONSTRAINTS:
        - "meals" keys: "day", "lunch", "dinner".
        - If {meals_str} excludes LUNCH/DINNER, set value to "Skip".
        - NO markdown formatting. NO code blocks. JUST JSON.
        """

        if request.current_plan:
            prompt += f"\n\nCURRENT PLAN (USER EDITED): {request.current_plan}\nCRITICAL INSTRUCTION: The user has manually modified the meals. You MUST IGNORE the 'shopping_list' in the provided JSON. You MUST GENERATE A NEW 'shopping_list' and 'total_estimated_cost' that matches the NEW meals. DO NOT change the meals, they are fixed."

        return prompt
