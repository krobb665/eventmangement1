from flask import request
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import db, Budget, BudgetItem, BudgetStatus, ExpenseCategory, Event
from ..services.auth_service import get_current_user

api = Namespace('budgets', description='Budget operations')

# Request/Response models
budget_model = api.model('Budget', {
    'event_id': fields.Integer(required=True, description='ID of the associated event'),
    'total_budget': fields.Float(description='Total budget amount'),
    'status': fields.String(description='Budget status', enum=[s.value for s in BudgetStatus], default='draft'),
    'notes': fields.String(description='Budget notes')
})

budget_item_model = api.model('BudgetItem', {
    'budget_id': fields.Integer(required=True, description='ID of the parent budget'),
    'category': fields.String(required=True, description='Expense category', enum=[c.value for c in ExpenseCategory]),
    'description': fields.String(required=True, description='Item description'),
    'quantity': fields.Integer(description='Quantity', default=1),
    'estimated_unit_cost': fields.Float(required=True, description='Estimated cost per unit'),
    'actual_unit_cost': fields.Float(description='Actual cost per unit'),
    'vendor_id': fields.Integer(description='ID of the vendor'),
    'payment_status': fields.String(description='Payment status', default='unpaid'),
    'due_date': fields.Date(description='Due date (YYYY-MM-DD)'),
    'notes': fields.String(description='Item notes')
})

# Query parameters
budget_parser = api.parser()
budget_parser.add_argument('status', type=str, help='Filter by status')
budget_parser.add_argument('event_id', type=int, help='Filter by event ID')
budget_parser.add_argument('page', type=int, default=1, help='Page number')
budget_parser.add_argument('per_page', type=int, default=20, help='Items per page')

@api.route('/')
class BudgetList(Resource):
    @jwt_required()
    @api.expect(budget_parser)
    @api.response(200, 'Success')
    @api.response(401, 'Not authenticated')
    def get(self):
        """Get a list of budgets"""
        args = budget_parser.parse_args()
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)
        
        query = Budget.query
        
        # Apply filters
        if args.get('status'):
            query = query.filter(Budget.status == BudgetStatus(args['status']))
        
        if args.get('event_id'):
            query = query.filter(Budget.event_id == args['event_id'])
        
        # Non-admin users can only see budgets for their events
        if user.role not in ['admin', 'organizer']:
            query = query.join(Event).filter(Event.organizer_id == user.id)
        
        # Order by creation date
        query = query.order_by(Budget.created_at.desc())
        
        # Pagination
        page = args.get('page', 1)
        per_page = args.get('per_page', 20)
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return {
            'items': [budget.to_dict() for budget in pagination.items],
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page,
            'per_page': per_page
        }
    
    @jwt_required()
    @api.expect(budget_model, validate=True)
    @api.response(201, 'Budget created')
    @api.response(400, 'Invalid input')
    @api.response(401, 'Not authenticated')
    def post(self):
        """Create a new budget"""
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)
        data = request.get_json()
        
        # Check if user has permission to create budgets for this event
        if user.role not in ['admin', 'organizer']:
            return {"error": "Not authorized to create budgets"}, 403
        
        # Check if event exists and user has access
        event = Event.query.get(data.get('event_id'))
        if not event:
            return {"error": "Event not found"}, 404
        
        if event.organizer_id != user.id and user.role != 'admin':
            return {"error": "Not authorized to create a budget for this event"}, 403
        
        try:
            # Check if a budget already exists for this event
            existing_budget = Budget.query.filter_by(event_id=data['event_id']).first()
            if existing_budget:
                return {"error": "A budget already exists for this event"}, 400
            
            # Create the budget
            budget = Budget(
                created_by=user_id,
                **{k: v for k, v in data.items() if k != 'items'}
            )
            
            db.session.add(budget)
            db.session.commit()
            
            return {
                "message": "Budget created successfully",
                "budget": budget.to_dict()
            }, 201
        except Exception as e:
            db.session.rollback()
            return {"error": f"Failed to create budget: {str(e)}"}, 500

@api.route('/<int:budget_id>')
@api.param('budget_id', 'The budget identifier')
class BudgetResource(Resource):
    @jwt_required()
    @api.response(200, 'Success')
    @api.response(401, 'Not authenticated')
    @api.response(403, 'Not authorized')
    @api.response(404, 'Budget not found')
    def get(self, budget_id):
        """Get budget by ID with all items"""
        budget = Budget.query.get_or_404(budget_id)
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)
        
        # Check if user has permission to view this budget
        if user.role not in ['admin', 'organizer']:
            event = Event.query.get(budget.event_id)
            if not event or event.organizer_id != user.id:
                return {"error": "Not authorized to view this budget"}, 403
        
        return budget.to_dict()
    
    @jwt_required()
    @api.expect(budget_model)
    @api.response(200, 'Budget updated')
    @api.response(400, 'Invalid input')
    @api.response(401, 'Not authenticated')
    @api.response(403, 'Not authorized')
    @api.response(404, 'Budget not found')
    def put(self, budget_id):
        """Update a budget"""
        budget = Budget.query.get_or_404(budget_id)
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)
        
        # Check if user has permission to update this budget
        if user.role not in ['admin', 'organizer']:
            return {"error": "Not authorized to update this budget"}, 403
        
        event = Event.query.get(budget.event_id)
        if not event or (event.organizer_id != user.id and user.role != 'admin'):
            return {"error": "Not authorized to update this budget"}, 403
        
        data = request.get_json()
        
        try:
            # Update budget fields
            for key, value in data.items():
                if hasattr(budget, key) and key not in ['items']:
                    setattr(budget, key, value)
            
            db.session.commit()
            
            return {
                "message": "Budget updated successfully",
                "budget": budget.to_dict()
            }
        except Exception as e:
            db.session.rollback()
            return {"error": f"Failed to update budget: {str(e)}"}, 500

@api.route('/<int:budget_id>/items')
@api.param('budget_id', 'The budget identifier')
class BudgetItemList(Resource):
    @jwt_required()
    @api.response(200, 'Success')
    @api.response(401, 'Not authenticated')
    @api.response(403, 'Not authorized')
    @api.response(404, 'Budget not found')
    def get(self, budget_id):
        """Get all items for a budget"""
        budget = Budget.query.get_or_404(budget_id)
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)
        
        # Check if user has permission to view this budget
        if user.role not in ['admin', 'organizer']:
            event = Event.query.get(budget.event_id)
            if not event or event.organizer_id != user.id:
                return {"error": "Not authorized to view this budget"}, 403
        
        return {"items": [item.to_dict() for item in budget.items]}
    
    @jwt_required()
    @api.expect(budget_item_model, validate=True)
    @api.response(201, 'Budget item created')
    @api.response(400, 'Invalid input')
    @api.response(401, 'Not authenticated')
    @api.response(403, 'Not authorized')
    @api.response(404, 'Budget not found')
    def post(self, budget_id):
        """Add an item to a budget"""
        budget = Budget.query.get_or_404(budget_id)
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)
        
        # Check if user has permission to modify this budget
        if user.role not in ['admin', 'organizer']:
            event = Event.query.get(budget.event_id)
            if not event or event.organizer_id != user.id:
                return {"error": "Not authorized to modify this budget"}, 403
        
        data = request.get_json()
        
        try:
            # Create the budget item
            item = BudgetItem(
                budget_id=budget_id,
                **{k: v for k, v in data.items() if k != 'id'}
            )
            
            db.session.add(item)
            db.session.commit()
            
            # Update budget totals
            budget.update_totals()
            db.session.commit()
            
            return {
                "message": "Budget item added successfully",
                "item": item.to_dict()
            }, 201
        except Exception as e:
            db.session.rollback()
            return {"error": f"Failed to add budget item: {str(e)}"}, 500

@api.route('/items/<int:item_id>')
@api.param('item_id', 'The budget item identifier')
class BudgetItemResource(Resource):
    @jwt_required()
    @api.expect(budget_item_model)
    @api.response(200, 'Budget item updated')
    @api.response(400, 'Invalid input')
    @api.response(401, 'Not authenticated')
    @api.response(403, 'Not authorized')
    @api.response(404, 'Item not found')
    def put(self, item_id):
        """Update a budget item"""
        item = BudgetItem.query.get_or_404(item_id)
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)
        
        # Check if user has permission to modify this budget item
        if user.role not in ['admin', 'organizer']:
            budget = Budget.query.get(item.budget_id)
            if not budget:
                return {"error": "Budget not found"}, 404
                
            event = Event.query.get(budget.event_id)
            if not event or event.organizer_id != user.id:
                return {"error": "Not authorized to modify this budget item"}, 403
        
        data = request.get_json()
        
        try:
            # Update item fields
            for key, value in data.items():
                if hasattr(item, key) and key != 'id':
                    setattr(item, key, value)
            
            # Update calculated fields
            item.update_costs()
            db.session.commit()
            
            # Update budget totals
            budget = Budget.query.get(item.budget_id)
            if budget:
                budget.update_totals()
                db.session.commit()
            
            return {
                "message": "Budget item updated successfully",
                "item": item.to_dict()
            }
        except Exception as e:
            db.session.rollback()
            return {"error": f"Failed to update budget item: {str(e)}"}, 500
    
    @jwt_required()
    @api.response(200, 'Budget item deleted')
    @api.response(401, 'Not authenticated')
    @api.response(403, 'Not authorized')
    @api.response(404, 'Item not found')
    def delete(self, item_id):
        """Delete a budget item"""
        item = BudgetItem.query.get_or_404(item_id)
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)
        
        # Check if user has permission to delete this budget item
        if user.role not in ['admin', 'organizer']:
            budget = Budget.query.get(item.budget_id)
            if not budget:
                return {"error": "Budget not found"}, 404
                
            event = Event.query.get(budget.event_id)
            if not event or event.organizer_id != user.id:
                return {"error": "Not authorized to delete this budget item"}, 403
        
        try:
            budget_id = item.budget_id
            db.session.delete(item)
            db.session.commit()
            
            # Update budget totals
            budget = Budget.query.get(budget_id)
            if budget:
                budget.update_totals()
                db.session.commit()
            
            return {"message": "Budget item deleted successfully"}
        except Exception as e:
            db.session.rollback()
            return {"error": f"Failed to delete budget item: {str(e)}"}, 500

# Import User here to avoid circular imports
from ..models.user import User
