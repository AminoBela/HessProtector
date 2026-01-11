from fastapi import APIRouter
from app.database import get_db_connection
from app.models import PromptRequest, PlanItem
from app.routes.dashboard import get_dashboard # Re-using logic
from datetime import date
import google.generativeai as genai
import os

router = APIRouter()

@router.post("/api/smart-prompt")
def generate_smart_prompt(req: PromptRequest): 
    d = get_dashboard()
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
    You are the 'HessProtector Coach'. Your goal is to keep the user financially healthy and well-fed on a tight budget.
    {lang_instruction}
    Analyze the context.
    Return ONLY valid JSON in this exact structure (no markdown code blocks):
    {{
        "analysis": "Short analysis of finances and pantry.",
        "meals": [
            {{ "day": "Day 1", "lunch": "Dish Name", "dinner": "Dish Name" }}
        ],
        "shopping_list": [
            {{ "item": "Item Name", "price": "Est. Price (€)" }}
        ],
        "total_estimated_cost": "Total €",
        "tips": ["Tip 1", "Tip 2"]
    }}
    Important: "shopping_list" MUST include estimated prices for each item.
    """
    
    # Intégration des paramètres utilisateur et mode Re-Adaptation
    user_instruction = f"Plan for {req.days} days. Meals per day: {', '.join(req.meals)}."
    
    final_prompt = f"{system_prompt}\nUser Request: {user_instruction}\nContext: {db_context}"
    
    if req.current_plan:
        final_prompt += f"\n\nCURRENT PLAN (User Edited): {req.current_plan}\nINSTRUCTION: The user modified the plan above. Re-calculate the Shopping List and Total Cost to match this new plan EXACTLY. Do not change the meals unless necessary."

    response = model.generate_content(final_prompt)
    
    # Nettoyage JSON si Gemini ajoute du markdown
    clean_json = response.text.replace("```json", "").replace("```", "").strip()
    
    return {"prompt": clean_json}

@router.get("/api/plans")
def get_plans():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM plans ORDER BY id DESC")
    rows = [dict(r) for r in c.fetchall()]
    conn.close()
    return rows

@router.post("/api/plans")
def save_plan(p: PlanItem):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("INSERT INTO plans (name, content_json, created_at) VALUES (?, ?, ?)", (p.name, p.content, str(date.today())))
    conn.commit()
    conn.close()
    return {"status": "saved"}

@router.delete("/api/plans/{id}")
def del_plan(id: int):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("DELETE FROM plans WHERE id=?", (id,))
    conn.commit()
    conn.close()
    return {"status": "ok"}
