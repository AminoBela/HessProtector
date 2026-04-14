import json
from typing import Dict
from .prompt_strategy import PromptStrategy

class SportPromptStrategy(PromptStrategy):
    def build_prompt(self, request, context: Dict) -> str:
        sport_profile = context.get("sport_profile", {})
        height = sport_profile.get("height_cm", "Non spécifié")
        weight = sport_profile.get("weight_kg", "Non spécifié")
        goal = sport_profile.get("fitness_goal", "maintain")
        preferred = sport_profile.get("preferred_sports", "Salles de sport")
        experience = sport_profile.get("experience_level", "intermediaire")
        injuries = sport_profile.get("injuries", "Aucune")
        equipment = sport_profile.get("equipment", "Standard")

        mode = context.get("mode", "new")
        weeks_duration = context.get("weeks_duration", 4)
        current_plan = context.get("current_plan", "")
        latest_checkin = context.get("latest_checkin_notes", "")

        language = context.get("language", "fr")
        lang_instruction = "You must respond in FRENCH." if language == "fr" else "You must respond in SPANISH."

        base_prompt = f'''Act as a world-class AI Fitness Coach.
{lang_instruction}

User Context:
- Height: {height} cm
- Weight: {weight} kg
- Primary Goal: {goal}
- Preferred Sports/Activities: {preferred}
- Experience Level: {experience}
- Injuries/Limitations: {injuries}
- Available Equipment: {equipment}
- Plan Duration: {weeks_duration} weeks (Macro-cycle)
'''

        if mode == "readapt" and current_plan:
            base_prompt += f'''
RE-ADAPTATION MODE:
The user has provided a check-in and wants to adjust their current plan.
Check-in Feedback / Notes: "{latest_checkin}"
Current Plan JSON: {current_plan}

Your task: Analyze the Check-in Feedback. Maintain the overall structure of the current plan but adjust the volume, intensity, or exercises for the remaining weeks to address the user's fatigue, progress, or new weight.
'''
        else:
            base_prompt += '''
NEW PLAN MODE:
Your task is to create a fully customized, generative workout plan from scratch. Incorporate progressive overload week by week.
'''

        base_prompt += '''
JSON Format Requirements:
{
  "title": "Title of the plan (e.g., Mesocycle 1: Perte de Poids)",
  "analysis": "Short professional assessment of their profile (or readaptation) and how this plan helps.",
  "weeks": [
    {
      "week_number": 1,
      "focus": "Adaptation & Technique",
      "workouts": [
        {
          "day": "Jour 1",
          "focus": "Upper Body / Swim... e.g. Split description",
          "duration": "Duration in minutes",
          "exercises": [
            {
              "name": "Exercise Name",
              "sets": 3,
              "reps": "10-12",
              "rest": "90s",
              "notes": "Specific tip for this user"
            }
          ]
        }
      ]
    }
  ]
}

Generate the JSON plan perfectly aligned with the user profile, nothing else. Avoid using markdown formatting outside of the JSON block. Return ONLY the JSON object.
'''
        return base_prompt
