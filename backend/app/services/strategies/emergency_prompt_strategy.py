from app.services.strategies.prompt_strategy import PromptStrategy
from typing import Dict

class EmergencyPromptStrategy(PromptStrategy):
    def build_prompt(self, request, context: Dict) -> str:
        return f"""
Tu es un conseiller financier et nutritionniste d'urgence (HessProtector).
Je suis dans une situation financière hyper critique. Il me reste {request.budget}€ pour survivre {request.days} jours.
Mon régime strict: {context.get('profile', {}).get('diet', 'Aucun')}.
Voici ce que j'ai dans mon frigo: {context.get('pantry', [])}.
Mes prélèvements à venir: {context.get('recurring', [])}.

Génère un plan de SURVIE EXTRÊME pour tenir jusqu'à la fin.
Sois direct, brutalement honnête, mais donne de l'espoir.

Renvoie UNIQUEMENT un JSON avec cette structure:
{{
    "motivational_speech": "Une phrase choc pour me réveiller",
    "steps": [
        {{"icon": "🛑", "action": "Action immédiate 1"}},
        {{"icon": "💡", "action": "Action immédiate 2"}},
        {{"icon": "🍽️", "action": "Que manger aujourd'hui avec ce qu'il reste"}}
    ]
}}
"""
