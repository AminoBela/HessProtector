from app.services.validators.transaction_validator import TransactionValidator


class BudgetLimitValidator(TransactionValidator):
    
    def __init__(self, budget_repo, next_validator=None):
        super().__init__(next_validator)
        self.budget_repo = budget_repo
    
    def _check(self, transaction, user_id: int, context: dict) -> tuple[bool, str]:
        if transaction.type != "depense":
            return True, ""
        
        limit = self.budget_repo.get_by_category(transaction.category, user_id)
        
        if not limit:
            return True, ""
        
        current_spending = context.get('current_category_spending', {}).get(transaction.category, 0)
        total_spending = current_spending + transaction.amount
        
        if total_spending > limit['amount']:
            return False, f"Budget limit exceeded for {transaction.category}: {total_spending}€ > {limit['amount']}€"
        
        return True, ""
