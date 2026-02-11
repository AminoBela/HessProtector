import os
import json
from typing import Dict
from google import genai
from app.models import PromptRequest
from app.services.strategies import (
    EmergencyPromptStrategy,
    MealPlanPromptStrategy,
    RecipePromptStrategy,
)
from app.core.singleton import Singleton
from app.core.decorators import logged, timed, retry


class CoachService(metaclass=Singleton):
    def __init__(self):
        if hasattr(self, "_initialized"):
            return

        self._initialized = True
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not found in environment")
        self.client = genai.Client(api_key=self.api_key)
        self.model = "gemini-2.0-flash"

        self.strategies = {
            "emergency": EmergencyPromptStrategy(),
            "meal_plan": MealPlanPromptStrategy(),
            "recipe": RecipePromptStrategy(),
        }

    @logged
    @timed
    def generate_prompt(self, request: PromptRequest, context: Dict) -> Dict:
        strategy = self.strategies.get(request.type)
        if not strategy:
            return {"error": f"Invalid request type: {request.type}"}

        prompt = strategy.build_prompt(request, context)
        return self._call_gemini(prompt, request)

    @retry(max_attempts=2, delay=1.0)
    def _call_gemini(self, prompt: str, request: PromptRequest) -> Dict:
        try:
            response = self.client.models.generate_content(
                model=self.model, contents=[prompt]
            )
            text = response.text.strip()

            start = text.find("{")
            end = text.rfind("}") + 1
            if start != -1 and end != -1:
                text = text[start:end]

            parsed = json.loads(text)

            if request.current_plan:
                try:
                    user_plan = json.loads(request.current_plan)
                    if "meals" in user_plan:
                        parsed["meals"] = user_plan["meals"]
                except Exception:
                    pass

            return {"prompt": parsed}

        except Exception as e:
            return {"error": f"AI model failed: {str(e)}"}
