from app.repositories.base import BaseRepository
from sqlmodel import select
from app.models.domain import FuelEntry
from typing import List, Optional

class FuelRepository(BaseRepository):
    def _do_create(self, entry_data, user_id: int) -> int:
        db_entry = FuelEntry(
            date=entry_data.date,
            liters=entry_data.liters,
            total_cost=entry_data.total_cost,
            odometer=entry_data.odometer,
            fuel_type=entry_data.fuel_type,
            station=entry_data.station,
            is_full_tank=entry_data.is_full_tank,
            note=entry_data.note,
            user_id=user_id
        )
        self.session.add(db_entry)
        self.session.commit()
        self.session.refresh(db_entry)
        return db_entry.id

    def get_by_id(self, id: int, user_id: int) -> Optional[dict]:
        db_entry = self.session.exec(
            select(FuelEntry).where(FuelEntry.id == id, FuelEntry.user_id == user_id)
        ).first()
        return self._row_to_dict(db_entry)

    def get_all(self, user_id: int) -> List[dict]:
        db_entries = self.session.exec(
            select(FuelEntry).where(FuelEntry.user_id == user_id).order_by(FuelEntry.date.desc())
        ).all()
        return self._rows_to_dicts(db_entries)

    def delete(self, id: int, user_id: int) -> bool:
        db_entry = self.session.exec(
            select(FuelEntry).where(FuelEntry.id == id, FuelEntry.user_id == user_id)
        ).first()
        if not db_entry:
            return False
        self.session.delete(db_entry)
        self.session.commit()
        return True

    def update(self, id: int, entry_data, user_id: int) -> bool:
        db_entry = self.session.exec(
            select(FuelEntry).where(FuelEntry.id == id, FuelEntry.user_id == user_id)
        ).first()
        if not db_entry:
            return False
        db_entry.date = entry_data.date
        db_entry.liters = entry_data.liters
        db_entry.total_cost = entry_data.total_cost
        db_entry.odometer = entry_data.odometer
        db_entry.fuel_type = entry_data.fuel_type
        db_entry.station = entry_data.station
        db_entry.is_full_tank = entry_data.is_full_tank
        db_entry.note = entry_data.note
        self.session.add(db_entry)
        self.session.commit()
        return True

    def get_stats(self, user_id: int) -> dict:
        """Calculate fuel consumption stats from all entries."""
        entries = self.session.exec(
            select(FuelEntry).where(FuelEntry.user_id == user_id).order_by(FuelEntry.odometer.asc())
        ).all()

        if not entries:
            return {
                "total_cost": 0,
                "total_liters": 0,
                "total_distance": 0,
                "avg_consumption": 0,
                "cost_per_km": 0,
                "avg_price_per_liter": 0,
                "entry_count": 0,
            }

        total_cost = sum(e.total_cost for e in entries)
        total_liters = sum(e.liters for e in entries)
        entry_count = len(entries)
        avg_price_per_liter = total_cost / total_liters if total_liters > 0 else 0

        # Distance & consumption calculated between consecutive FULL tank entries
        total_distance = 0
        consumption_liters = 0
        consumption_distance = 0

        for i in range(1, len(entries)):
            dist = entries[i].odometer - entries[i - 1].odometer
            if dist > 0:
                total_distance += dist
                if entries[i].is_full_tank:
                    consumption_liters += entries[i].liters
                    consumption_distance += dist

        avg_consumption = (consumption_liters / consumption_distance * 100) if consumption_distance > 0 else 0
        cost_per_km = total_cost / total_distance if total_distance > 0 else 0

        return {
            "total_cost": round(total_cost, 2),
            "total_liters": round(total_liters, 2),
            "total_distance": round(total_distance, 1),
            "avg_consumption": round(avg_consumption, 2),
            "cost_per_km": round(cost_per_km, 4),
            "avg_price_per_liter": round(avg_price_per_liter, 3),
            "entry_count": entry_count,
        }
