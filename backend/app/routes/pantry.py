from fastapi import APIRouter, Depends, UploadFile, File
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
    file: UploadFile = File(...), current_user: User = Depends(get_current_user)
):

    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return {"error": "GEMINI_API_KEY not configured"}

        client = genai.Client(api_key=api_key)

        fd, temp_path = tempfile.mkstemp(suffix=os.path.splitext(file.filename)[1])
        try:
            with os.fdopen(fd, 'wb') as temp_file:
                temp_file.write(await file.read())
            
            uploaded_file = client.files.upload(
                path=temp_path, config={"display_name": file.filename}
            )
        finally:
            os.remove(temp_path)

        prompt = """
        Analyze this receipt image and extract:
        1. Total amount (just the number, e.g., "42.50")
        2. List of items with quantities
        
        Return ONLY valid JSON:
        {
            "total_amount": "42.50",
            "items": [
                {"item": "Tomates", "qty": "500g", "category": "Legumes"},
                {"item": "Pain", "qty": "1", "category": "Autre"}
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
        repo = PantryRepository()
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
        return {"error": str(e)}
