from fastapi import APIRouter, Depends
from pydantic import BaseModel
from google import genai
import os
import calendar
import logging
import json
from app.database import get_session
from sqlmodel import Session, select, func
from app.auth_utils import get_current_user
from app.models.domain import Transaction, BudgetLimit

logger = logging.getLogger(__name__)

router = APIRouter()

class AuditRequest(BaseModel):
    year: str
    month: str
    language: str

@router.get("/analytics/monthly")
def get_monthly_analytics(
    year: str, month: str, current_user: dict = Depends(get_current_user), session: Session = Depends(get_session)
):
    m_str = month.zfill(2)
    month_prefix = f"{year}-{m_str}"

    try:
        num_days = calendar.monthrange(int(year), int(month))[1]
    except ValueError:
        num_days = 30

    # Single query: group by date and type for the whole month
    daily_rows = session.exec(
        select(
            Transaction.date,
            Transaction.type,
            func.sum(Transaction.amount).label("total")
        ).where(
            Transaction.date.startswith(month_prefix),
            Transaction.user_id == current_user["id"]
        ).group_by(Transaction.date, Transaction.type)
    ).all()

    # Build a lookup dict: {day_number: {"income": x, "expense": y}}
    daily_lookup = {}
    for row in daily_rows:
        try:
            day_num = int(row.date.split("-")[2])
        except (IndexError, ValueError):
            continue
        if day_num not in daily_lookup:
            daily_lookup[day_num] = {"income": 0.0, "expense": 0.0}
        if row.type == "revenu":
            daily_lookup[day_num]["income"] = row.total or 0.0
        else:
            daily_lookup[day_num]["expense"] = row.total or 0.0

    daily_data = []
    for d in range(1, num_days + 1):
        entry = daily_lookup.get(d, {"income": 0.0, "expense": 0.0})
        daily_data.append({"day": d, "income": entry["income"], "expense": entry["expense"]})

    # Category breakdown (single query)
    cat_rows = session.exec(
        select(
            Transaction.category,
            func.sum(Transaction.amount).label("total")
        ).where(
            Transaction.type == "depense",
            Transaction.date.startswith(month_prefix),
            Transaction.user_id == current_user["id"]
        ).group_by(Transaction.category)
    ).all()

    budget_rows = session.exec(
        select(BudgetLimit.category, BudgetLimit.amount).where(
            BudgetLimit.user_id == current_user["id"]
        )
    ).all()
    limits = {row[0]: row[1] for row in budget_rows}

    cats = []
    for row in cat_rows:
        limit = limits.get(row.category, 0)
        cats.append({
            "name": row.category,
            "value": row.total,
            "limit": limit,
            "percent": (row.total / limit * 100) if limit > 0 else 0,
        })

    # Top expenses (single query)
    top_txs = session.exec(
        select(Transaction.label, Transaction.amount, Transaction.date).where(
            Transaction.type == "depense",
            Transaction.date.startswith(month_prefix),
            Transaction.user_id == current_user["id"]
        ).order_by(Transaction.amount.desc()).limit(5)
    ).all()
    top = [{"label": tx.label, "amount": tx.amount, "date": tx.date} for tx in top_txs]

    total_inc = sum(d["income"] for d in daily_data)
    total_exp = sum(d["expense"] for d in daily_data)

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

@router.post("/analytics/audit")
def generate_audit(req: AuditRequest, current_user: dict = Depends(get_current_user), session: Session = Depends(get_session)):
    data = get_monthly_analytics(req.year, req.month, current_user, session)

    GEMINI_KEY = os.getenv("GEMINI_API_KEY")
    if not GEMINI_KEY:
        return {"analysis": "Error: GEMINI_API_KEY not found."}

    client = genai.Client(api_key=GEMINI_KEY)

    lang_instruction = (
        "Respond in French." if req.language == "fr" else "Respond in English."
    )

    prompt = f"""
    You are a brutally honest but helpful financial advisor. Analyze this monthly data:
    {json.dumps(data, default=str)}

    {lang_instruction}
    Return ONLY a raw JSON object with this exact structure (no markdown, no backticks):
    {{
      "score": <number 0-10 based on financial health>,
      "title": "<short dramatic title for their performance>",
      "roast": "<a witty, spicy, slightly roasting but ultimately helpful 1-sentence comment on their spending habits>",
      "pros": ["<strength 1>", "<strength 2>", "<strength 3>"],
      "cons": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
      "tips": [
        {{"icon": "<emoji>", "tip": "<actionable advice 1>"}},
        {{"icon": "<emoji>", "tip": "<actionable advice 2>"}},
        {{"icon": "<emoji>", "tip": "<actionable advice 3>"}}
      ]
    }}
    """

    MODELS_TO_TRY = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-flash-latest",
    ]

    last_error = None
    for model_name in MODELS_TO_TRY:
        try:
            from google.genai import types
            config = types.GenerateContentConfig(
                response_mime_type="application/json"
            )

            response = client.models.generate_content(
                model=model_name, 
                contents=[prompt],
                config=config
            )
            text = response.text.strip()
            logger.info(f"AI Response ({model_name}): {text}")

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
