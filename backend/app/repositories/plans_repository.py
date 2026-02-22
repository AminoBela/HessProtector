from app.repositories.base import BaseRepository
from app.models.domain import Plan
from sqlmodel import select
from typing import List, Optional
from datetime import datetime

class PlansRepository(BaseRepository):
    def _do_create(self, plan_data: dict, user_id: int) -> int:
        db_plan = Plan(
            name=plan_data.get("name", ""),
            content_json=plan_data.get("content", ""),
            created_at=datetime.utcnow().isoformat(),
            user_id=user_id
        )
        self.session.add(db_plan)
        self.session.commit()
        self.session.refresh(db_plan)
        return db_plan.id

    def get_by_id(self, id: int, user_id: int) -> Optional[dict]:
        db_plan = self.session.exec(select(Plan).where(Plan.id == id, Plan.user_id == user_id)).first()
        return self._row_to_dict(db_plan)

    def get_all(self, user_id: int) -> List[dict]:
        db_plans = self.session.exec(select(Plan).where(Plan.user_id == user_id).order_by(Plan.id.desc())).all()
        return self._rows_to_dicts(db_plans)

    def delete(self, id: int, user_id: int) -> bool:
        db_plan = self.session.exec(select(Plan).where(Plan.id == id, Plan.user_id == user_id)).first()
        if not db_plan:
            return False
        self.session.delete(db_plan)
        self.session.commit()
        return True
