from app.repositories.base import BaseRepository
from sqlmodel import select
from app.models.domain import PantryItem, RecurringItem, Goal
from typing import List, Optional

class PantryRepository(BaseRepository):
    def _do_create(self, item_data, user_id: int) -> int:
        db_item = PantryItem(
            item=item_data.item,
            qty=item_data.qty,
            category=item_data.category,
            expiry=item_data.expiry,
            added_date=item_data.added_date,
            user_id=user_id
        )
        self.session.add(db_item)
        self.session.commit()
        self.session.refresh(db_item)
        return db_item.id

    def get_by_id(self, id: int, user_id: int) -> Optional[dict]:
        db_item = self.session.exec(select(PantryItem).where(PantryItem.id == id, PantryItem.user_id == user_id)).first()
        return self._row_to_dict(db_item)

    def get_all(self, user_id: int) -> List[dict]:
        db_items = self.session.exec(select(PantryItem).where(PantryItem.user_id == user_id).order_by(PantryItem.expiry.asc())).all()
        return self._rows_to_dicts(db_items)

    def delete(self, id: int, user_id: int) -> bool:
        db_item = self.session.exec(select(PantryItem).where(PantryItem.id == id, PantryItem.user_id == user_id)).first()
        if not db_item:
            return False
        self.session.delete(db_item)
        self.session.commit()
        return True

    def update(self, id: int, item_data, user_id: int) -> bool:
        db_item = self.session.exec(select(PantryItem).where(PantryItem.id == id, PantryItem.user_id == user_id)).first()
        if not db_item:
            return False
        db_item.item = item_data.item
        db_item.qty = item_data.qty
        db_item.category = item_data.category
        db_item.expiry = item_data.expiry
        db_item.added_date = item_data.added_date
        self.session.add(db_item)
        self.session.commit()
        return True

class RecurringRepository(BaseRepository):
    def _do_create(self, recurring_data, user_id: int) -> int:
        db_rec = RecurringItem(
            label=recurring_data.label,
            amount=recurring_data.amount,
            day=recurring_data.day,
            type=recurring_data.type,
            user_id=user_id
        )
        self.session.add(db_rec)
        self.session.commit()
        self.session.refresh(db_rec)
        return db_rec.id

    def get_by_id(self, id: int, user_id: int) -> Optional[dict]:
        db_rec = self.session.exec(select(RecurringItem).where(RecurringItem.id == id, RecurringItem.user_id == user_id)).first()
        return self._row_to_dict(db_rec)

    def get_all(self, user_id: int) -> List[dict]:
        db_recs = self.session.exec(select(RecurringItem).where(RecurringItem.user_id == user_id).order_by(RecurringItem.day.asc())).all()
        return self._rows_to_dicts(db_recs)

    def delete(self, id: int, user_id: int) -> bool:
        db_rec = self.session.exec(select(RecurringItem).where(RecurringItem.id == id, RecurringItem.user_id == user_id)).first()
        if not db_rec:
            return False
        self.session.delete(db_rec)
        self.session.commit()
        return True

    def update(self, id: int, recurring_data, user_id: int) -> bool:
        db_rec = self.session.exec(select(RecurringItem).where(RecurringItem.id == id, RecurringItem.user_id == user_id)).first()
        if not db_rec:
            return False
        db_rec.label = recurring_data.label
        db_rec.amount = recurring_data.amount
        db_rec.day = recurring_data.day
        db_rec.type = recurring_data.type
        self.session.add(db_rec)
        self.session.commit()
        return True

class GoalsRepository(BaseRepository):
    def _do_create(self, goal_data, user_id: int) -> int:
        db_goal = Goal(
            label=goal_data.label,
            target=goal_data.target,
            saved=goal_data.saved,
            deadline=goal_data.deadline,
            priority="normal",  # Default if missing in original schema
            user_id=user_id
        )
        if hasattr(goal_data, 'priority'):
            db_goal.priority = goal_data.priority
            
        self.session.add(db_goal)
        self.session.commit()
        self.session.refresh(db_goal)
        return db_goal.id

    def get_by_id(self, id: int, user_id: int) -> Optional[dict]:
        db_goal = self.session.exec(select(Goal).where(Goal.id == id, Goal.user_id == user_id)).first()
        return self._row_to_dict(db_goal)

    def get_all(self, user_id: int) -> List[dict]:
        db_goals = self.session.exec(select(Goal).where(Goal.user_id == user_id).order_by(Goal.deadline.asc())).all()
        return self._rows_to_dicts(db_goals)

    def delete(self, id: int, user_id: int) -> bool:
        db_goal = self.session.exec(select(Goal).where(Goal.id == id, Goal.user_id == user_id)).first()
        if not db_goal:
            return False
        self.session.delete(db_goal)
        self.session.commit()
        return True

    def update(self, id: int, goal_data, user_id: int) -> bool:
        db_goal = self.session.exec(select(Goal).where(Goal.id == id, Goal.user_id == user_id)).first()
        if not db_goal:
            return False
        db_goal.label = goal_data.label
        db_goal.target = goal_data.target
        db_goal.saved = goal_data.saved
        db_goal.deadline = goal_data.deadline
        if hasattr(goal_data, 'priority'):
            db_goal.priority = goal_data.priority
            
        self.session.add(db_goal)
        self.session.commit()
        return True
