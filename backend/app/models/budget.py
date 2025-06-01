from datetime import datetime
from enum import Enum
from .. import db

class BudgetStatus(str, Enum):
    DRAFT = 'draft'
    PENDING_APPROVAL = 'pending_approval'
    APPROVED = 'approved'
    REJECTED = 'rejected'

class ExpenseCategory(str, Enum):
    VENUE = 'venue'
    CATERING = 'catering'
    EQUIPMENT = 'equipment'
    MARKETING = 'marketing'
    STAFF = 'staff'
    TRANSPORTATION = 'transportation'
    ACCOMMODATION = 'accommodation'
    ENTERTAINMENT = 'entertainment'
    DECORATIONS = 'decorations'
    PRINTING = 'printing'
    SIGNAGE = 'signage'
    TECHNOLOGY = 'technology'
    OTHER = 'other'

class Budget(db.Model):
    __tablename__ = 'budgets'
    
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    total_budget = db.Column(db.Numeric(12, 2), nullable=False, default=0)
    actual_spent = db.Column(db.Numeric(12, 2), default=0)
    status = db.Column(db.Enum(BudgetStatus), default=BudgetStatus.DRAFT)
    notes = db.Column(db.Text)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    approved_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    approved_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    event = db.relationship('Event', back_populates='budget')
    items = db.relationship('BudgetItem', back_populates='budget', cascade='all, delete-orphan')
    creator = db.relationship('User', foreign_keys=[created_by])
    approver = db.relationship('User', foreign_keys=[approved_by])
    
    def to_dict(self):
        return {
            'id': self.id,
            'event_id': self.event_id,
            'total_budget': float(self.total_budget) if self.total_budget else 0,
            'actual_spent': float(self.actual_spent) if self.actual_spent else 0,
            'remaining_budget': float(self.total_budget - self.actual_spent) if self.total_budget and self.actual_spent else float(self.total_budget),
            'status': self.status.value,
            'notes': self.notes,
            'created_by': self.created_by,
            'created_by_name': f"{self.creator.first_name} {self.creator.last_name}" if self.creator else None,
            'approved_by': self.approved_by,
            'approved_by_name': f"{self.approver.first_name} {self.approver.last_name}" if self.approver else None,
            'approved_at': self.approved_at.isoformat() if self.approved_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'items': [item.to_dict() for item in self.items]
        }
    
    def update_totals(self):
        """Update the total_budget and actual_spent based on items."""
        from sqlalchemy import func
        
        # Calculate totals from items
        result = db.session.query(
            func.sum(BudgetItem.estimated_cost).label('total_estimated'),
            func.sum(BudgetItem.actual_cost).label('total_actual')
        ).filter(
            BudgetItem.budget_id == self.id
        ).first()
        
        self.total_budget = result.total_estimated or 0
        self.actual_spent = result.total_actual or 0

class Expense(db.Model):
    __tablename__ = 'expenses'
    
    id = db.Column(db.Integer, primary_key=True)
    budget_item_id = db.Column(db.Integer, db.ForeignKey('budget_items.id'), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    date_incurred = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    receipt_url = db.Column(db.String(255))
    description = db.Column(db.Text)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    budget_item = db.relationship('BudgetItem', back_populates='expenses')
    creator = db.relationship('User', foreign_keys=[created_by])
    
    def to_dict(self):
        return {
            'id': self.id,
            'budget_item_id': self.budget_item_id,
            'amount': float(self.amount) if self.amount else 0,
            'date_incurred': self.date_incurred.isoformat() if self.date_incurred else None,
            'receipt_url': self.receipt_url,
            'description': self.description,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class BudgetItem(db.Model):
    __tablename__ = 'budget_items'
    
    id = db.Column(db.Integer, primary_key=True)
    budget_id = db.Column(db.Integer, db.ForeignKey('budgets.id'), nullable=False)
    category = db.Column(db.Enum(ExpenseCategory), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    estimated_unit_cost = db.Column(db.Numeric(10, 2), nullable=False)
    estimated_cost = db.Column(db.Numeric(12, 2), nullable=False)
    actual_unit_cost = db.Column(db.Numeric(10, 2))
    actual_cost = db.Column(db.Numeric(12, 2))
    vendor_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    payment_status = db.Column(db.String(20), default='unpaid')  # unpaid, partial, paid
    due_date = db.Column(db.Date)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    budget = db.relationship('Budget', back_populates='items')
    vendor = db.relationship('User')
    expenses = db.relationship('Expense', back_populates='budget_item', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'budget_id': self.budget_id,
            'category': self.category.value,
            'description': self.description,
            'quantity': self.quantity,
            'estimated_unit_cost': float(self.estimated_unit_cost) if self.estimated_unit_cost else 0,
            'estimated_cost': float(self.estimated_cost) if self.estimated_cost else 0,
            'actual_unit_cost': float(self.actual_unit_cost) if self.actual_unit_cost else None,
            'actual_cost': float(self.actual_cost) if self.actual_cost else None,
            'vendor_id': self.vendor_id,
            'vendor_name': f"{self.vendor.first_name} {self.vendor.last_name}" if self.vendor else None,
            'payment_status': self.payment_status,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def update_costs(self):
        """Update calculated costs when unit cost or quantity changes."""
        self.estimated_cost = self.estimated_unit_cost * self.quantity if self.estimated_unit_cost and self.quantity else 0
        if self.actual_unit_cost and self.quantity:
            self.actual_cost = self.actual_unit_cost * self.quantity
        
        # Update parent budget totals
        if self.budget:
            self.budget.update_totals()
    
    def __init__(self, **kwargs):
        super(BudgetItem, self).__init__(**kwargs)
        self.update_costs()
    
    def __setattr__(self, name, value):
        """Override to update costs when relevant fields change."""
        super(BudgetItem, self).__setattr__(name, value)
        if name in ['estimated_unit_cost', 'actual_unit_cost', 'quantity']:
            try:
                if hasattr(self, 'estimated_unit_cost') and hasattr(self, 'quantity'):
                    self.update_costs()
            except Exception as e:
                # Handle case where we're still initializing
                pass
