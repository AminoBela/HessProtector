from abc import ABC, abstractmethod
from typing import Dict


class PromptStrategy(ABC):
    
    @abstractmethod
    def build_prompt(self, request, context: Dict) -> str:
        pass
