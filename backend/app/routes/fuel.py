from fastapi import APIRouter, Depends
from app.models import FuelEntryCreate
from app.auth_utils import get_current_user
from app.core.dependencies import get_fuel_repository
from app.repositories import FuelRepository

router = APIRouter()

@router.get("/fuel")
def get_fuel_entries(
    current_user=Depends(get_current_user),
    repo: FuelRepository = Depends(get_fuel_repository),
):
    return repo.get_all(current_user["id"])

@router.post("/fuel")
def add_fuel_entry(
    entry: FuelEntryCreate,
    current_user=Depends(get_current_user),
    repo: FuelRepository = Depends(get_fuel_repository),
):
    entry_id = repo.create(entry, current_user["id"])
    return {"status": "added", "id": entry_id}

@router.put("/fuel/{id}")
def update_fuel_entry(
    id: int,
    entry: FuelEntryCreate,
    current_user=Depends(get_current_user),
    repo: FuelRepository = Depends(get_fuel_repository),
):
    success = repo.update(id, entry, current_user["id"])
    return {"status": "updated" if success else "not_found"}

@router.delete("/fuel/{id}")
def delete_fuel_entry(
    id: int,
    current_user=Depends(get_current_user),
    repo: FuelRepository = Depends(get_fuel_repository),
):
    success = repo.delete(id, current_user["id"])
    return {"status": "deleted" if success else "not_found"}

@router.get("/fuel/stats")
def get_fuel_stats(
    current_user=Depends(get_current_user),
    repo: FuelRepository = Depends(get_fuel_repository),
):
    return repo.get_stats(current_user["id"])
