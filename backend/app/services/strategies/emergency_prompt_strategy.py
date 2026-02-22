from app.services.strategies.prompt_strategy import PromptStrategy
from typing import Dict

class EmergencyPromptStrategy(PromptStrategy):
    def build_prompt(self, request, context: Dict) -> str:
        return f
