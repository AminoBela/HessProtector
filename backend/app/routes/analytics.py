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

    try:
        num_days = calendar.monthrange(int(year), int(month))[1]
    except ValueError:
        num_days = 30

    daily_data = []

    for d in range(1, num_days + 1):
        d_str = f"{year}-{m_str}-{str(d).zfill(2)}"
        inc = session.exec(select(func.sum(Transaction.amount)).where(Transaction.type == 'revenu', Transaction.date == d_str, Transaction.user_id == current_user["id"])).first() or 0.0
        exp = session.exec(select(func.sum(Transaction.amount)).where(Transaction.type == 'depense', Transaction.date == d_str, Transaction.user_id == current_user["id"])).first() or 0.0
        daily_data.append({"day": d, "income": inc, "expense": exp})

    cat_rows = session.exec(select(Transaction.category, func.sum(Transaction.amount).label("total")).where(Transaction.type == 'depense', Transaction.date.startswith(f"{year}-{m_str}"), Transaction.user_id == current_user["id"]).group_by(Transaction.category)).all()

    budget_rows = session.exec(select(BudgetLimit.category, BudgetLimit.amount).where(BudgetLimit.user_id == current_user["id"])).all()
    limits = {row[0]: row[1] for row in budget_rows}

    cats = []
    for row in cat_rows:
        limit = limits.get(row.category, 0)
        cats.append(
            {
                "name": row.category,
                "value": row.total,
                "limit": limit,
                "percent": (row.total / limit * 100) if limit > 0 else 0,
            }
        )

    top_txs = session.exec(select(Transaction.label, Transaction.amount, Transaction.date).where(Transaction.type == 'depense', Transaction.date.startswith(f"{year}-{m_str}"), Transaction.user_id == current_user["id"]).order_by(Transaction.amount.desc()).limit(5)).all()
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
    You are a financial advisor. Analyze this monthly data:
    {json.dumps(data, default=str)}

    Identify 3 strengths and 3 weaknesses.
    {lang_instruction}
    """

    MODELS_TO_TRY = [
        "gemini-flash-latest",
        "gemini-1.5-flash",
    ]

    last_error = None
    for model_name in MODELS_TO_TRY:
        try:
            from google.genai import types
            config = types.GenerateContentConfig(tools=None)

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
