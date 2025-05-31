from flask import request
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Task, TaskStatus, TaskPriority, TaskAssignment, User, db
from ..services.auth_service import get_current_user

api = Namespace('tasks', description='Task operations')

# Request/Response models
task_model = api.model('Task', {
    'title': fields.String(required=True, description='Task title'),
    'description': fields.String(description='Task description'),
    'due_date': fields.DateTime(description='Due date (ISO 8601 format)'),
    'status': fields.String(description='Task status', enum=[s.value for s in TaskStatus], default='todo'),
    'priority': fields.String(description='Task priority', enum=[p.value for p in TaskPriority], default='medium'),
    'event_id': fields.Integer(required=True, description='ID of the associated event'),
    'assignee_ids': fields.List(fields.Integer, description='List of user IDs to assign to this task')
})

task_assignment_model = api.model('TaskAssignment', {
    'task_id': fields.Integer(required=True, description='Task ID'),
    'assignee_id': fields.Integer(required=True, description='User ID of the assignee'),
    'assigned_by': fields.Integer(required=True, description='User ID of the assigner'),
    'notes': fields.String(description='Assignment notes')
})

# Query parameters
task_parser = api.parser()
task_parser.add_argument('status', type=str, help='Filter by status')
task_parser.add_argument('priority', type=str, help='Filter by priority')
task_parser.add_argument('assignee_id', type=int, help='Filter by assignee ID')
task_parser.add_argument('event_id', type=int, help='Filter by event ID')
task_parser.add_argument('due_before', type=str, help='Filter by due date before (YYYY-MM-DD)')
task_parser.add_argument('due_after', type=str, help='Filter by due date after (YYYY-MM-DD)')
task_parser.add_argument('page', type=int, default=1, help='Page number')
task_parser.add_argument('per_page', type=int, default=20, help='Items per page')

@api.route('/')
class TaskList(Resource):
    @jwt_required()
    @api.expect(task_parser)
    @api.response(200, 'Success')
    @api.response(401, 'Not authenticated')
    def get(self):
        """Get a list of tasks"""
        args = task_parser.parse_args()
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)
        
        query = Task.query
        
        # Apply filters
        if args.get('status'):
            query = query.filter(Task.status == TaskStatus(args['status']))
        
        if args.get('priority'):
            query = query.filter(Task.priority == TaskPriority(args['priority']))
        
        if args.get('assignee_id'):
            query = query.join(Task.assignments).filter(TaskAssignment.assignee_id == args['assignee_id'])
        elif user.role not in ['admin', 'organizer']:
            # Non-admin users only see their assigned tasks
            query = query.join(Task.assignments).filter(TaskAssignment.assignee_id == user.id)
        
        if args.get('event_id'):
            query = query.filter(Task.event_id == args['event_id'])
        
        if args.get('due_before'):
            query = query.filter(Task.due_date <= args['due_before'])
        
        if args.get('due_after'):
            query = query.filter(Task.due_date >= args['due_after'])
        
        # Order by due date (nulls last) and priority
        query = query.order_by(
            db.nulls_last(Task.due_date.asc()),
            Task.priority.desc(),
            Task.created_at.desc()
        )
        
        # Pagination
        page = args.get('page', 1)
        per_page = args.get('per_page', 20)
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return {
            'items': [task.to_dict() for task in pagination.items],
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page,
            'per_page': per_page
        }
    
    @jwt_required()
    @api.expect(task_model, validate=True)
    @api.response(201, 'Task created')
    @api.response(400, 'Invalid input')
    @api.response(401, 'Not authenticated')
    def post(self):
        """Create a new task"""
        user_id = get_jwt_identity()
        data = request.get_json()
        
        try:
            # Extract assignee_ids from the data
            assignee_ids = data.pop('assignee_ids', [])
            
            # Create the task
            task = Task(
                created_by=user_id,
                **{k: v for k, v in data.items() if k != 'assignee_ids'}
            )
            
            db.session.add(task)
            db.session.flush()  # Get the task ID
            
            # Create assignments
            for assignee_id in assignee_ids:
                assignment = TaskAssignment(
                    task_id=task.id,
                    assignee_id=assignee_id,
                    assigned_by=user_id
                )
                db.session.add(assignment)
            
            db.session.commit()
            
            return {
                "message": "Task created successfully",
                "task": task.to_dict()
            }, 201
        except Exception as e:
            db.session.rollback()
            return {"error": f"Failed to create task: {str(e)}"}, 500

@api.route('/<int:task_id>')
@api.param('task_id', 'The task identifier')
class TaskResource(Resource):
    @jwt_required()
    @api.response(200, 'Success')
    @api.response(401, 'Not authenticated')
    @api.response(403, 'Not authorized')
    @api.response(404, 'Task not found')
    def get(self, task_id):
        """Get task by ID"""
        task = Task.query.get_or_404(task_id)
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)
        
        # Check if user has permission to view this task
        if user.role not in ['admin', 'organizer'] and not any(
            a.assignee_id == user.id for a in task.assignments
        ):
            return {"error": "Not authorized to view this task"}, 403
        
        return task.to_dict()
    
    @jwt_required()
    @api.expect(task_model)
    @api.response(200, 'Task updated')
    @api.response(400, 'Invalid input')
    @api.response(401, 'Not authenticated')
    @api.response(403, 'Not authorized')
    @api.response(404, 'Task not found')
    def put(self, task_id):
        """Update a task"""
        task = Task.query.get_or_404(task_id)
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)
        
        # Check if user has permission to update this task
        if user.role not in ['admin', 'organizer'] and task.created_by != user.id:
            return {"error": "Not authorized to update this task"}, 403
        
        data = request.get_json()
        
        try:
            # Update task fields
            for key, value in data.items():
                if hasattr(task, key) and key not in ['assignee_ids']:
                    setattr(task, key, value)
            
            # Update assignees if provided
            if 'assignee_ids' in data:
                # Remove existing assignments
                TaskAssignment.query.filter_by(task_id=task.id).delete()
                
                # Add new assignments
                for assignee_id in data['assignee_ids']:
                    assignment = TaskAssignment(
                        task_id=task.id,
                        assignee_id=assignee_id,
                        assigned_by=user_id
                    )
                    db.session.add(assignment)
            
            db.session.commit()
            
            return {
                "message": "Task updated successfully",
                "task": task.to_dict()
            }
        except Exception as e:
            db.session.rollback()
            return {"error": f"Failed to update task: {str(e)}"}, 500
    
    @jwt_required()
    @api.response(200, 'Task deleted')
    @api.response(401, 'Not authenticated')
    @api.response(403, 'Not authorized')
    @api.response(404, 'Task not found')
    def delete(self, task_id):
        """Delete a task"""
        task = Task.query.get_or_404(task_id)
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)
        
        # Check if user has permission to delete this task
        if user.role not in ['admin', 'organizer'] and task.created_by != user.id:
            return {"error": "Not authorized to delete this task"}, 403
        
        try:
            db.session.delete(task)
            db.session.commit()
            return {"message": "Task deleted successfully"}
        except Exception as e:
            db.session.rollback()
            return {"error": f"Failed to delete task: {str(e)}"}, 500

@api.route('/<int:task_id>/complete')
@api.param('task_id', 'The task identifier')
class CompleteTask(Resource):
    @jwt_required()
    @api.response(200, 'Task marked as completed')
    @api.response(401, 'Not authenticated')
    @api.response(403, 'Not authorized')
    @api.response(404, 'Task not found')
    def post(self, task_id):
        """Mark a task as completed"""
        task = Task.query.get_or_404(task_id)
        user_id = get_jwt_identity()
        
        # Check if user is assigned to this task
        assignment = TaskAssignment.query.filter_by(
            task_id=task_id,
            assignee_id=user_id
        ).first()
        
        if not assignment and task.created_by != user_id:
            return {"error": "Not authorized to complete this task"}, 403
        
        try:
            task.status = TaskStatus.COMPLETED
            
            # Update assignment completion time
            if assignment:
                assignment.completed_at = db.func.now()
            
            db.session.commit()
            
            return {
                "message": "Task marked as completed",
                "task": task.to_dict()
            }
        except Exception as e:
            db.session.rollback()
            return {"error": f"Failed to complete task: {str(e)}"}, 500
