from fastapi import APIRouter, UploadFile, File
from app.database import get_db_connection
from app.models import PantryItem
from datetime import date
import google.generativeai as genai
import json
import os

router = APIRouter()

@router.post("/api/pantry")
def add_pantry(p: PantryItem):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("INSERT INTO pantry (item, qty, category, expiry, added_date) VALUES (?, ?, ?, ?, ?)", (p.item, p.qty, p.category, p.expiry, str(date.today())))
    conn.commit()
    conn.close()
    return {"status": "ok"}

@router.delete("/api/pantry/{id}")
def del_pantry(id: int):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("DELETE FROM pantry WHERE id=?", (id,))
    conn.commit()
    conn.close()
    return {"status": "ok"}

@router.post("/api/scan-receipt")
async def scan_receipt(file: UploadFile = File(...)):
    """Analyse REELLE du ticket avec Gemini Vision"""
    try:
        content = await file.read()
        
        # Configuration Gemini (Assuming init in main or re-init here if stateless)
        # It's safer to configure it again or rely on env being loaded in main
        GEMINI_KEY = os.getenv("GEMINI_API_KEY")
        if GEMINI_KEY:
            genai.configure(api_key=GEMINI_KEY)
            
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        prompt = "Analyze this receipt image. Extract items in this VALID JSON format ONLY: [{'item': 'Name', 'qty': 'Quantity', 'category': 'Category (Frais, Sec, Boisson, Hygiène)', 'expiry': 'YYYY-MM-DD (estimate)'}]. Return ONLY the JSON list."
        
        response = model.generate_content([
            {'mime_type': file.content_type, 'data': content},
            prompt
        ])
        
        # Nettoyage
        json_text = response.text.replace("```json", "").replace("```", "").strip()
        detected_items = json.loads(json_text)
        
        # Sauvegarde
        conn = get_db_connection()
        c = conn.cursor()
        for item in detected_items:
            cat = item.get('category', 'Autre')
            exp = item.get('expiry', '')
            c.execute("INSERT INTO pantry (item, qty, category, expiry, added_date) VALUES (?, ?, ?, ?, ?)",
                      (item['item'], item['qty'], cat, exp, str(date.today())))
        conn.commit()
        conn.close()
        
        return {"status": "scanned", "items": detected_items}
        
    except Exception as e:
        print(f"Error Gemini Vision: {e}")
        return {"status": "error", "message": str(e)}
