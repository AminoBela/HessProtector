from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from app.models import PantryItem, User
from app.auth_utils import get_current_user
from app.core.dependencies import get_pantry_repository
from app.repositories import PantryRepository
import os
import tempfile
from google import genai
import json

router = APIRouter()

@router.post("/pantry")
def add_pantry(
    item: PantryItem,
    current_user: User = Depends(get_current_user),
    repo: PantryRepository = Depends(get_pantry_repository),
):

    repo.create(item, current_user["id"])
    return {"status": "added"}

@router.delete("/pantry/{id}")
def delete_pantry(
    id: int,
    current_user: User = Depends(get_current_user),
    repo: PantryRepository = Depends(get_pantry_repository),
):

    success = repo.delete(id, current_user["id"])
    return {"status": "deleted" if success else "not_found"}

@router.post("/scan-receipt")
async def scan_receipt(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    repo: PantryRepository = Depends(get_pantry_repository),
):

    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")

        client = genai.Client(api_key=api_key)

        fd, temp_path = tempfile.mkstemp(suffix=os.path.splitext(file.filename)[1])
        try:
            with os.fdopen(fd, 'wb') as temp_file:
                temp_file.write(await file.read())
            
            uploaded_file = client.files.upload(
                file=temp_path, config={"display_name": file.filename}
            )
        finally:
            os.remove(temp_path)

        prompt = """
        Analyze this receipt image and extract:
        1. Total amount (just the number, e.g., "42.50")
        2. List of items with quantities
        
        CRITICAL INSTRUCTION: For the "category" field, you MUST choose ONLY ONE of the following exact strings:
        - "Viandes" (Meat & Fish)
        - "Legumes" (Fruits & Vegetables)
        - "Laitiers" (Dairy & Eggs)
        - "Epicerie" (Pasta, Rice, Canned goods, Spices, Dry grocery)
        - "Surgeles" (Frozen foods)
        - "Boisson" (Water, Soda, Alcohol, Juice)
        - "Hygiene" (Soap, Shampoo, Toothpaste, Toilet paper)
        - "Maison" (Cleaning products, Trash bags, Sponges)
        - "Autre" (Only if absolutely none of the above fit)
        
        Return ONLY valid JSON in this format:
        {
            "total_amount": "42.50",
            "items": [
                {"item": "Tomates", "qty": "500g", "category": "Legumes"},
                {"item": "Poulet", "qty": "2", "category": "Viandes"},
                {"item": "Liquide Vaisselle", "qty": "1", "category": "Maison"},
                {"item": "Pâtes", "qty": "1", "category": "Epicerie"}
            ]
        }
        """ 

        from google.genai import types
        config = types.GenerateContentConfig(
            response_mime_type="application/json"
        )

        response = client.models.generate_content(
            model="gemini-2.5-flash", 
            contents=[prompt, uploaded_file],
            config=config
        )

        text = response.text.strip()
        start = text.find("{")
        end = text.rfind("}") + 1
        if start != -1 and end > start:
            text = text[start:end]

        result = json.loads(text)

        # Automatically insert parsed items into the database
        for item_data in result.get("items", []):
            try:
                # Need to add expiry logic, defaulting to empty for now
                pantry_item = PantryItem(
                    item=item_data.get("item", "Inconnu"),
                    qty=str(item_data.get("qty", "1")),
                    category=item_data.get("category", "Autre"),
                    expiry=""
                )
                repo.create(pantry_item, current_user["id"])
            except Exception as e:
                print(f"Error saving scanned item: {e}")

        client.files.delete(name=uploaded_file.name)

        return result

    except Exception as e:
        print(f"Scan receipt error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
