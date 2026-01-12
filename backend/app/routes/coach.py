from fastapi import APIRouter, Depends
from app.database import get_db_connection
from app.models import PromptRequest, PlanItem, User
from app.routes.dashboard import get_dashboard # Re-using logic
from app.routes.auth import get_current_user
from datetime import date
import google.generativeai as genai
import os

router = APIRouter()

@router.post("/api/smart-prompt")
def generate_smart_prompt(req: PromptRequest, current_user: User = Depends(get_current_user)): 
    d = get_dashboard(current_user)
    transactions = d['transactions']
    recurring = d['recurring']
    p = d['profile']
    inv = ', '.join([f"{i['item']} ({i['qty']})" for i in d['pantry']])
    
    # Contexte Financier enrichi (5 dernières transactions + factures)
    recent_tx = transactions[:5]
    upcoming_bills = sum(r['amount'] for r in recurring if r['day'] > date.today().day)
    
    # Prompt optimisé Coach V2 (JSON Strict)
    db_context = f"""
    Profil: {p['supermarket']}, Régime: {p['diet']}.
    Budget Restant (Mois): {req.budget}€.
    Factures à venir: {upcoming_bills}€.
    Dernières dépenses: {', '.join([f"{t['label']} ({t['amount']}€)" for t in recent_tx])}.
    Inventaire Frigo (Ingrédients à utiliser): {inv}.
    """
    
    # Re-init Gemini key locally just in case, though main should handle it
    GEMINI_KEY = os.getenv("GEMINI_API_KEY")
    if GEMINI_KEY:
        genai.configure(api_key=GEMINI_KEY)

    model = genai.GenerativeModel('gemini-2.0-flash')
    
    lang_instruction = "Respond in French." if req.language == 'fr' else "Respond in Spanish (Español)."
    
    system_prompt = f"""
    You are the 'HessProtector Chef', an elite AI financial and nutrition coach.
    Your Mission: Create a delicious, healthy meal plan that STRICTLY fits the user's budget and inventory. 
    
    GUIDELINES:
    1. **Budget First**: The 'total_estimated_cost' MUST be <= {req.budget}€. If impossible, warn the user in the 'analysis'.
    2. **Anti-Waste**: You MUST prioritization using ingredients from the 'Inventario Frigo'.
    3. **Nutritional Balance**: Meals should be balanced (protein, veg, carbs).
    4. **Language**: {lang_instruction}
    
    RESPONSE FORMAT:
    Return ONLY valid, minified JSON. Do not include markdown formatting (like ```json).
    Structure:
    {{
        "analysis": "A brief, encouraging summary of the plan (e.g. 'This week we focus on utilizing your leftover rice...')",
        "meals": [
            {{ "day": "Lundi" (or formatted date), "lunch": "Dish Name (w/ Brief Desc)", "dinner": "Dish Name" }}
        ],
        "shopping_list": [
            {{ "item": "Exact Ingredient", "price": "1.50€" }}
        ],
        "total_estimated_cost": "Total €",
        "tips": ["Tip 1 (Money saving)", "Tip 2 (Nutrition)"]
    }}
    """
    
    # Intégration des paramètres utilisateur et mode Re-Adaptation
    user_instruction = f"CREATE A PLAN FOR {req.days} DAYS. MEALS/DAY: {', '.join(req.meals)}."
    
    final_prompt = f"{system_prompt}\n\nUSER REQUEST: {user_instruction}\n\nFINANCIAL CONTEXT:\n{db_context}"
    
    if req.current_plan:
        final_prompt += f"\n\nCURRENT PLAN (User Edited): {req.current_plan}\nINSTRUCTION: The user modified the plan above. YOU MUST RE-CALCULATE the 'shopping_list' and 'total_estimated_cost' to match this new plan EXACTLY. ALL ingredients for the new meals MUST be in the shopping list (if not in pantry). Do NOT change the meals themselves unless they are incomplete."

    response = model.generate_content(final_prompt)
    
    # Nettoyage JSON si Gemini ajoute du markdown
    clean_json = response.text.replace("```json", "").replace("```", "").strip()
    
    return {"prompt": clean_json}

@router.get("/api/plans")
def get_plans(current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM plans WHERE user_id=? ORDER BY id DESC", (current_user['id'],))
    rows = [dict(r) for r in c.fetchall()]
    conn.close()
    return rows

@router.post("/api/plans")
def save_plan(p: PlanItem, current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("INSERT INTO plans (name, content_json, created_at, user_id) VALUES (?, ?, ?, ?)", 
              (p.name, p.content, str(date.today()), current_user['id']))
    conn.commit()
    conn.close()
    return {"status": "saved"}

@router.delete("/api/plans/{id}")
def del_plan(id: int, current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("DELETE FROM plans WHERE id=? AND user_id=?", (id, current_user['id']))
    conn.commit()
    conn.close()
    return {"status": "ok"}
