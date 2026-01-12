from fastapi import APIRouter, Depends
from app.database import get_db_connection
from app.models import BaseModel, User
from app.routes.auth import get_current_user

import google.generativeai as genai
import os
import calendar

router = APIRouter()

class AuditRequest(BaseModel):
    year: str
    month: str
    language: str

@router.get("/api/analytics/monthly")
def get_monthly_analytics(year: str, month: str, current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    c = conn.cursor()


    m_str = month.zfill(2)
    

    try:
        num_days = calendar.monthrange(int(year), int(month))[1]
    except ValueError:
        num_days = 30
        
    daily_data = []
    
    for d in range(1, num_days + 1):
        d_str = f"{year}-{m_str}-{str(d).zfill(2)}"
        c.execute("SELECT SUM(amount) FROM transactions WHERE type='revenu' AND date=? AND user_id=?", (d_str, current_user['id']))
        inc = c.fetchone()[0] or 0.0
        c.execute("SELECT SUM(amount) FROM transactions WHERE type='depense' AND date=? AND user_id=?", (d_str, current_user['id']))
        exp = c.fetchone()[0] or 0.0
        daily_data.append({"day": d, "income": inc, "expense": exp})


    c.execute("SELECT category, SUM(amount) as total FROM transactions WHERE type='depense' AND strftime('%Y', date)=? AND strftime('%m', date)=? AND user_id=? GROUP BY category", 
              (year, m_str, current_user['id']))
    cats = [{"name": row['category'], "value": row['total']} for row in c.fetchall()]
    

    c.execute("SELECT label, amount, date FROM transactions WHERE type='depense' AND strftime('%Y', date)=? AND strftime('%m', date)=? AND user_id=? ORDER BY amount DESC LIMIT 5", 
              (year, m_str, current_user['id']))
    top = [dict(row) for row in c.fetchall()]
    

    total_inc = sum(d['income'] for d in daily_data)
    total_exp = sum(d['expense'] for d in daily_data)
    
    conn.close()
    
    return {
        "daily_data": daily_data,
        "category_data": cats,
        "top_expenses": top,
        "stats": {
            "income": total_inc,
            "expense": total_exp,
            "net": total_inc - total_exp,
            "savings_rate": (total_inc - total_exp) / total_inc * 100 if total_inc > 0 else 0
        }
    }

@router.post("/api/analytics/audit")
def generate_audit(req: AuditRequest, current_user: User = Depends(get_current_user)):

    data = get_monthly_analytics(req.year, req.month, current_user)
    

    GEMINI_KEY = os.getenv("GEMINI_API_KEY")
    if GEMINI_KEY:
        genai.configure(api_key=GEMINI_KEY)
    model = genai.GenerativeModel('gemini-2.0-flash')
    
    lang_instruction = "Respond in French." if req.language == 'fr' else "Respond in Spanish."
    
    prompt = f"""
    You are a brutally honest but helpful Financial Auditor.
    
    CONTEXT:
    Date: {req.month}/{req.year}
    Total Income: {data['stats']['income']}€
    Total Expense: {data['stats']['expense']}€
    Net Result: {data['stats']['net']}€
    Savings Rate: {data['stats']['savings_rate']:.1f}%.
    
    Top Expenses:
    {', '.join([f"{t['label']} ({t['amount']}€)" for t in data['top_expenses']])}
    
    Spending Categories:
    {', '.join([f"{c['name']} ({c['value']}€)" for c in data['category_data']])}
    
    TASK:
    Analyze this month's finances.
    1. Give a 'Score' /10.
    2. Roast the user if they spent too much on non-essentials.
    3. Congratulate good behavior (high savings).
    4. Give 3 specific actionable tips.
    
    FORMAT:
    Markdown (Use bolding, lists, emojis).
    Structure:
    ## 📊 Audit du Mois
    **Score**: X/10
    
    ### 🧐 Analyse
    ...
    
    ### 🔥 Le Roast (Or Compliment)
    ...
    
    ### 💡 Conseils
    ...
    
    INSTRUCTION: {lang_instruction}
    """
    
    response = model.generate_content(prompt)
    return {"analysis": response.text}
