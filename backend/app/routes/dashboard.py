from fastapi import APIRouter, Depends
from app.database import get_db_connection
from app.models import User
from app.routes.auth import get_current_user
from datetime import date

router = APIRouter()

@router.get("/api/dashboard")
def get_dashboard(current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM transactions WHERE user_id=? ORDER BY date DESC, id DESC", (current_user['id'],))
    transactions = [dict(row) for row in c.fetchall()]
    
    c.execute("SELECT * FROM pantry WHERE user_id=? ORDER BY expiry ASC", (current_user['id'],))
    pantry = [dict(row) for row in c.fetchall()]
    
    c.execute("SELECT * FROM recurring WHERE user_id=? ORDER BY day ASC", (current_user['id'],))
    recurring = [dict(row) for row in c.fetchall()]
    
    c.execute("SELECT * FROM goals WHERE user_id=? ORDER BY priority DESC", (current_user['id'],))
    goals = [dict(row) for row in c.fetchall()]
    
    c.execute("SELECT * FROM profile WHERE user_id=?", (current_user['id'],))
    profile = c.fetchone()
    conn.close()

    balance = sum(t['amount'] if t['type'] == 'revenu' else -t['amount'] for t in transactions)
    today_day = date.today().day
    upcoming_bills = sum(r['amount'] for r in recurring if r['day'] > today_day)
    categories = {}
    for t in transactions:
        if t['type'] == 'depense':
            categories[t['category']] = categories.get(t['category'], 0) + t['amount']

    # HessXP Logic
    raw_xp = int(balance)
    goals_completed = len([g for g in goals if g['saved'] >= g['target']])
    total_xp = max(0, raw_xp + (goals_completed * 100))

    def get_rank(xp):
        if xp < 500:
            return "La Hess", 500
        if xp < 2000:
            return "Débrouillard", 2000
        if xp < 5000:
            return "Économe", 5000
        if xp < 10000:
            return "Investisseur", 10000
        return "Rentier", 999999

    rank_name, next_rank_xp = get_rank(total_xp)

    monthly_burn = sum(r['amount'] for r in recurring)

    return { "is_setup": profile is not None, "balance": balance, "safe_balance": balance - upcoming_bills, "upcoming_bills": upcoming_bills, "monthly_burn": monthly_burn, "transactions": transactions, "pantry": pantry, "recurring": recurring, "goals": goals, "categories": categories, "profile": dict(profile) if profile else None,
             "xp": total_xp, "rank": rank_name, "next_rank_xp": next_rank_xp }


@router.get("/api/ai-export")
def get_ai(current_user: User = Depends(get_current_user)): 
    d = get_dashboard(current_user)
    return {"role":"Coach", "profile":d['profile'], "balance":d['balance'], "pantry":d['pantry']}

@router.get("/api/dashboard/years")
def get_years(current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT DISTINCT strftime('%Y', date) as year FROM transactions WHERE user_id=? ORDER BY year DESC", (current_user['id'],))
    years = [row[0] for row in c.fetchall() if row[0] is not None]
    conn.close()
    if not years:
        years = [str(date.today().year)]
    return years

@router.get("/api/dashboard/stats")
def get_stats(year: str = str(date.today().year), current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    c = conn.cursor()
    
    # Yearly Totals
    c.execute("SELECT SUM(amount) FROM transactions WHERE type='revenu' AND strftime('%Y', date) = ? AND user_id=?", (year, current_user['id']))
    total_income = c.fetchone()[0] or 0.0
    
    c.execute("SELECT SUM(amount) FROM transactions WHERE type != 'revenu' AND strftime('%Y', date) = ? AND user_id=?", (year, current_user['id']))
    total_expense = c.fetchone()[0] or 0.0
    
    # Monthly Breakdown
    months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
    monthly_data = []
    
    for m in months:
        c.execute("SELECT SUM(amount) FROM transactions WHERE type='revenu' AND strftime('%Y', date) = ? AND strftime('%m', date) = ? AND user_id=?", (year, m, current_user['id']))
        inc = c.fetchone()[0] or 0.0
        c.execute("SELECT SUM(amount) FROM transactions WHERE type != 'revenu' AND strftime('%Y', date) = ? AND strftime('%m', date) = ? AND user_id=?", (year, m, current_user['id']))
        exp = c.fetchone()[0] or 0.0
        monthly_data.append({"month": m, "income": inc, "expense": exp, "net": inc - exp})
        
    conn.close()
    
    return {
        "year": year,
        "total_income": total_income,
        "total_expense": total_expense,
        "net_result": total_income - total_expense,
        "monthly_data": monthly_data
    }
