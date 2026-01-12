from fastapi import APIRouter, UploadFile, File, Depends
from app.database import get_db_connection
from app.models import PantryItem, User
from app.routes.auth import get_current_user
from datetime import date
import google.generativeai as genai
import json
import os

router = APIRouter()

@router.post("/api/pantry")
def add_item(item: PantryItem, current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("INSERT INTO pantry (item, qty, category, expiry, added_date, user_id) VALUES (?, ?, ?, ?, ?, ?)",
              (item.item, item.qty, item.category, item.expiry, str(date.today()), current_user['id']))
    conn.commit()
    conn.close()
    return {"status": "ok"}

@router.delete("/api/pantry/{id}")
def del_item(id: int, current_user: User = Depends(get_current_user)):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("DELETE FROM pantry WHERE id=? AND user_id=?", (id, current_user['id']))
    conn.commit()
    conn.close()
    return {"status": "ok"}

@router.post("/api/scan-receipt")
async def scan_receipt(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    """Analyse REELLE du ticket avec Gemini Vision"""
    try:
        content = await file.read()
        
        # Configuration Gemini (Assuming init in main or re-init here if stateless)
        # It's safer to configure it again or rely on env being loaded in main
        GEMINI_KEY = os.getenv("GEMINI_API_KEY")
        if GEMINI_KEY:
            genai.configure(api_key=GEMINI_KEY)
            
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        prompt = """
        You are an expert Receipt Scanner. 
        Analyze this image and extract purchased items AND the total amount.
        Return ONLY a valid JSON object. No markdown.
        Structure:
        {
            "items": [
                {
                    "item": "Product Name", 
                    "qty": 1 (integer), 
                    "category": "Viandes" | "Legumes" | "Laitiers" | "Epicerie" | "Boisson" | "Surgeles" | "Hygiene" | "Maison" | "Autre", 
                    "expiry": "YYYY-MM-DD" (Estimate expiry based on type)
                }
            ],
            "total_amount": 12.50 (float, or null if not found)
        }
        """
        
        response = model.generate_content([
            {'mime_type': file.content_type, 'data': content},
            prompt
        ])
        
        text = response.text.strip()
        # Clean potential markdown
        if text.startswith("```"):
            text = text.split("\n", 1)[1]
            if text.endswith("```"):
                text = text.rsplit("\n", 1)[0]

        data = json.loads(text)
        
        # If the AI returns just a list (old format compatibility), wrap it
        if isinstance(data, list):
            data = {"items": data, "total_amount": None}

        # Add items to DB
        conn = get_db_connection()
        c = conn.cursor()
        
        for item in data.get("items", []):
            cat = item.get('category', 'Autre')
            exp = item.get('expiry', '')
            c.execute("INSERT INTO pantry (item, qty, category, expiry, added_date, user_id) VALUES (?, ?, ?, ?, ?, ?)",
                      (item['item'], item['qty'], cat, exp, str(date.today()), current_user['id']))
        conn.commit()
        conn.close()
        
        return {"items": data.get("items", []), "total_amount": data.get("total_amount")}
        
    except Exception as e:
        print(f"Error Gemini Vision: {e}")
        return {"status": "error", "message": str(e)}
