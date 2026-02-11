from fastapi import APIRouter, Depends
from pydantic import BaseModel
from google import genai
import os
import calendar
import logging
from app.database import get_db_connection
from app.auth_utils import get_current_user
from app.models import User

logger = logging.getLogger(__name__)

router = APIRouter()


class AuditRequest(BaseModel):
    year: str
    month: str
    language: str


@router.get("/api/analytics/monthly")
def get_monthly_analytics(
    year: str, month: str, current_user: User = Depends(get_current_user)
):
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
        c.execute(
            "SELECT SUM(amount) FROM transactions WHERE type='revenu' AND date=? AND user_id=?",
            (d_str, current_user["id"]),
        )
        inc = c.fetchone()[0] or 0.0
        c.execute(
            "SELECT SUM(amount) FROM transactions WHERE type='depense' AND date=? AND user_id=?",
            (d_str, current_user["id"]),
        )
        exp = c.fetchone()[0] or 0.0
        daily_data.append({"day": d, "income": inc, "expense": exp})

    c.execute(
        "SELECT category, SUM(amount) as total FROM transactions WHERE type='depense' AND strftime('%Y', date)=? AND strftime('%m', date)=? AND user_id=? GROUP BY category",
        (year, m_str, current_user["id"]),
    )
    cat_rows = c.fetchall()

    c.execute(
        "SELECT category, amount FROM budget_limits WHERE user_id=?",
        (current_user["id"],),
    )
    limits = {row["category"]: row["amount"] for row in c.fetchall()}

    cats = []
    for row in cat_rows:
        limit = limits.get(row["category"], 0)
        cats.append(
            {
                "name": row["category"],
                "value": row["total"],
                "limit": limit,
                "percent": (row["total"] / limit * 100) if limit > 0 else 0,
            }
        )

    c.execute(
        "SELECT label, amount, date FROM transactions WHERE type='depense' AND strftime('%Y', date)=? AND strftime('%m', date)=? AND user_id=? ORDER BY amount DESC LIMIT 5",
        (year, m_str, current_user["id"]),
    )
    top = [dict(row) for row in c.fetchall()]

    total_inc = sum(d["income"] for d in daily_data)
    total_exp = sum(d["expense"] for d in daily_data)

    conn.close()

    return {
        "daily_data": daily_data,
        "category_data": cats,
        "top_expenses": top,
        "stats": {
            "income": total_inc,
            "expense": total_exp,
            "net": total_inc - total_exp,
            "savings_rate": (total_inc - total_exp) / total_inc * 100
            if total_inc > 0
            else 0,
        },
    }


@router.post("/api/analytics/audit")
def generate_audit(req: AuditRequest, current_user: User = Depends(get_current_user)):
    data = get_monthly_analytics(req.year, req.month, current_user)

    GEMINI_KEY = os.getenv("GEMINI_API_KEY")
    if not GEMINI_KEY:
        return {"analysis": "Error: GEMINI_API_KEY not found."}

    client = genai.Client(api_key=GEMINI_KEY)

    lang_instruction = (
        "Respond in French." if req.language == "fr" else "Respond in English."
    )

    prompt = f"""
    You are a brutally honest but helpful Financial Auditor.
    
    CONTEXT:
    Date: {req.month}/{req.year}
    Total Income: {data["stats"]["income"]}€
    Total Expense: {data["stats"]["expense"]}€
    Net Result: {data["stats"]["net"]}€
    Savings Rate: {data["stats"]["savings_rate"]:.1f}%.
    
    Top Expenses:
    {", ".join([f"{t['label']} ({t['amount']}€)" for t in data["top_expenses"]])}
    
    Spending Categories:
    {", ".join([f"{c['name']} ({c['value']}€)" for c in data["category_data"]])}
    
    TASK:
    Analyze this month's finances and return a JSON object.
    
    GUIDELINES:
    1. **Score**: Integer 0-10 based on savings and waste.
    2. **Title**: Short, punchy (e.g., "Financial Disaster" or "Wealth Builder").
    3. **Roast**: A short paragraph roasting (or congratulating) the user.
    4. **Pros/Cons**: 3 bullet points for each.
    5. **Tips**: 3 actionable tips with an emoji icon.
    6. **Language**: {lang_instruction}
    7. **Format**: JSON ONLY. No Markdown formatting.

    RESPONSE STRUCTURE:
    {{
        "score": 8,
        "title": "Solid Month",
        "roast": "You bought too much coffee, but your savings are decent.",
        "pros": ["High Savings Rate", "Low Subscriptions", "Food budget under control"],
        "cons": ["Too many Uber Eats", " impulse buy on Amazon"],
        "tips": [
            {{ "icon": "Coffee", "tip": "Make coffee at home." }},
            {{ "icon": "Trend", "tip": "Cancel Netflix if you don't watch it." }},
             {{ "icon": "Money", "tip": "Put 50€ in savings immediately." }}
        ]
    }}
    """

    MODELS_TO_TRY = [
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-flash-001",
        "gemini-1.5-pro",
        "gemini-pro",
    ]

    import json

    last_error = None
    for model_name in MODELS_TO_TRY:
        try:
            logger.info(f"Trying Gemini model: {model_name}...")
            response = client.models.generate_content(
                model=model_name, contents=[prompt]
            )
            text = response.text.strip()

            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()

            start = text.find("{")
            end = text.rfind("}") + 1
            if start != -1 and end != -1:
                text = text[start:end]

            parsed = json.loads(text)
            return {"analysis": parsed}

        except Exception as e:
            logger.error(f"Failed with {model_name}: {e}")
            last_error = e
            continue

    return {"error": f"All AI models failed. Last error: {last_error}"}
