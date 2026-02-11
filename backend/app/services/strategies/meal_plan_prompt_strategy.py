from app.services.strategies.prompt_strategy import PromptStrategy
from typing import Dict


class MealPlanPromptStrategy(PromptStrategy):
    def build_prompt(self, request, context: Dict) -> str:
        p = context.get("profile", {})
        inv = ", ".join(
            [f"{i['item']} ({i['qty']})" for i in context.get("pantry", [])]
        )
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
        You are the 'HessProtector Chef', an elite AI financial and nutrition coach.
        Your Mission: Create a delicious, healthy meal plan that STRICTLY fits the user's budget and inventory.
        
        GUIDELINES:
        1. **Budget First**: The 'total_estimated_cost' MUST be <= {request.budget}€.
        2. **Anti-Waste (CRITICAL)**: MUST prioritize using ingredients from 'Inventario Frigo': {inv}
        3. **Financial Context**: User is saving for: {goals_str}
        4. **Nutritional Balance**: Meals should be balanced but cheap (Student/Survivor style).
        5. **Language**: {lang_instruction}
        6. **Style**: Professional, encouraging, but financially strict. STRICTLY NO EMOJIS in JSON values.
        7. **Meal Frequency**: STRICTLY generate ONLY the meals requested: {meals_str}
        
        RESPONSE FORMAT (JSON ONLY):
        {{
            "analysis": "Brief analysis of how this plan saves money and uses the fridge...",
            "meals": [
                {{ "day": "Lundi", "lunch": "Dish Name" (ONLY IF REQUESTED), "dinner": "Dish Name" (ONLY IF REQUESTED) }}
            ],
            "shopping_list": [
                {{ "item": "Exact Ingredient", "price": "1.50€" }}
            ],
            "total_estimated_cost": "Total €",
            "tips": ["Tip 1", "Tip 2"]
        }}
        
        USER REQUEST: CREATE A PLAN FOR {request.days} DAYS. MEALS PER DAY: {meals_str}.
        Profile: {p.get("supermarket", "N/A")}, Diet: {p.get("diet", "N/A")}
        """

        if request.current_plan:
            prompt += f"\n\nCURRENT PLAN (USER EDITED): {request.current_plan}\nCRITICAL INSTRUCTION: The user has manually modified the meals. You MUST IGNORE the 'shopping_list' in the provided JSON. You MUST GENERATE A NEW 'shopping_list' and 'total_estimated_cost' that matches the NEW meals. DO NOT change the meals, they are fixed."

        return prompt
