from fastapi import APIRouter, Depends, UploadFile, File
from app.models import PantryItem, User
from app.auth_utils import get_current_user
from app.core.dependencies import get_pantry_repository
from app.repositories import PantryRepository
import os
from google import genai
import json

router = APIRouter()


@router.post("/pantry")
def add_pantry(
    item: PantryItem,
    current_user: User = Depends(get_current_user),
    repo: PantryRepository = Depends(get_pantry_repository),
):
    """Add an item to pantry"""
    repo.create(item, current_user["id"])
    return {"status": "added"}


@router.delete("/pantry/{id}")
def delete_pantry(
    id: int,
    current_user: User = Depends(get_current_user),
    repo: PantryRepository = Depends(get_pantry_repository),
):
    """Delete a pantry item"""
    success = repo.delete(id, current_user["id"])
    return {"status": "deleted" if success else "not_found"}


@router.post("/scan-receipt")
async def scan_receipt(
    file: UploadFile = File(...), current_user: User = Depends(get_current_user)
):
    """Scan a receipt image using Gemini Vision"""
    try:
        await file.read()

        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return {"error": "GEMINI_API_KEY not configured"}

        client = genai.Client(api_key=api_key)

        uploaded_file = client.files.upload(
            path=file.filename, config={"display_name": file.filename}
        )

        prompt = """
        Analyze this receipt image and extract:
        1. Total amount (just the number, e.g., "42.50")
        2. List of items with quantities
        
        Return ONLY valid JSON:
        {
            "total": "42.50",
            "items": [
                {"item": "Tomates", "qty": "500g", "category": "Légumes"},
                {"item": "Pain", "qty": "1", "category": "Boulangerie"}
            ]
        }
        """

        response = client.models.generate_content(
            model="gemini-2.5-flash", contents=[prompt, uploaded_file]
        )

        text = response.text.strip()
        start = text.find("{")
        end = text.rfind("}") + 1
        if start != -1 and end > start:
            text = text[start:end]

        result = json.loads(text)

        client.files.delete(name=uploaded_file.name)

        return result

    except Exception as e:
        return {"error": str(e)}
