

from app.services.strategies.prompt_strategy import PromptStrategy
from typing import Dict

class RecipePromptStrategy(PromptStrategy):

    def build_prompt(self, request, context: Dict) -> str:

        dish = request.meals[0] if request.meals else "Unknown Dish"
        inv_list = [f"{i['item']} ({i['qty']})" for i in context.get("pantry", [])]
        inv = ", ".join(inv_list) if inv_list else "EMPTY"
        lang_instruction = (
            "Respond in French."
            if request.language == "fr"
            else "Respond in Spanish (Español)."
        )

        return f"""
        You are a frugal chef. Create a detailed, low-cost recipe for "{dish}".
        
        PANTRY INVENTORY: {inv}
        
        INSTRUCTIONS:
        1. Use as many pantry ingredients as possible to reduce cost.
        2. Keep steps simple and beginner-friendly.
        3. {lang_instruction}
        
        OUTPUT JSON ONLY:
        {{
            "title": "{dish}",
            "prep_time": "10 min",
            "cook_time": "20 min",
            "servings": 2,
            "cost_per_serving": 1.50,
            "ingredients": [
                {{"name": "Rice", "qty": "200g", "source": "Pantry"}},
                {{"name": "Chicken", "qty": "100g", "source": "Buy"}}
            ],
            "steps": [
                "Boil water.",
                "Cook rice."
            ],
            "tips": "Add salt for flavor."
        }}
        """
