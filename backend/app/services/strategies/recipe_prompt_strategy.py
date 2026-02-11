"""
Recipe Prompt Strategy
"""

from app.services.strategies.prompt_strategy import PromptStrategy
from typing import Dict


class RecipePromptStrategy(PromptStrategy):
    """Strategy for building recipe prompts"""

    def build_prompt(self, request, context: Dict) -> str:
        """Build recipe prompt"""
        dish = request.meals[0] if request.meals else "Unknown Dish"
        inv = ", ".join(
            [f"{i['item']} ({i['qty']})" for i in context.get("pantry", [])]
        )
        lang_instruction = (
            "Respond in French."
            if request.language == "fr"
            else "Respond in Spanish (Español)."
        )

        return f"""
        You are a Michelin Star Chef compatible with a student budget.
        TASK: Generate a detailed, easy-to-follow recipe for: "{dish}".
        
        Inventory: {inv}
        
        GUIDELINES:
        1. **Ingredients**: Check inventory for substitutions
        2. **Simplicity**: Max 5-6 main steps
        3. **Language**: {lang_instruction}
        4. **Format**: JSON ONLY. STRICTLY NO EMOJIS. STRICTLY NO MARKDOWN formatting.
        
        RESPONSE STRUCTURE:
        {{
            "title": "Recipe Title",
            "time": "20 min",
            "difficulty": "Easy/Medium/Hard",
            "calories": "500 kcal",
            "ingredients": [
                {{ "item": "Pasta", "qty": "200g", "substitution": "Rice (if in pantry)" }}
            ],
            "steps": [
                "Boil water...",
                "Fry the onions..."
            ],
            "chef_tip": "Add a splash of pasta water to the sauce for creaminess."
        }}
        """
