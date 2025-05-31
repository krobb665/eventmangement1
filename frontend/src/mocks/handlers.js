import { rest } from 'msw';

export const handlers = [
  // Auth endpoints
  rest.post('/api/auth/login', (req, res, ctx) => {
    const { email, password } = req.body;
    
    // Mock validation
    if (email === 'test@example.com' && password === 'password123') {
      return res(
        ctx.status(200),
        ctx.json({
          access_token: 'mock-jwt-token',
          user: {
            id: 1,
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
            role: 'admin',
            created_at: '2025-01-01T00:00:00.000Z',
            updated_at: '2025-01-01T00:00:00.000Z'
          }
        })
      );
    }
    
    return res(
      ctx.status(401),
      ctx.json({
        error: 'Invalid credentials',
        message: 'The provided email or password is incorrect.'
      })
    );
  }),
  
  rest.post('/api/auth/refresh', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        access_token: 'new-mock-jwt-token',
        user: {
          id: 1,
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
          role: 'admin',
          created_at: '2025-01-01T00:00:00.000Z',
          updated_at: '2025-01-01T00:00:00.000Z'
        }
      })
    );
  }),
  
  rest.get('/api/auth/me', (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res(
        ctx.status(401),
        ctx.json({
          error: 'Unauthorized',
          message: 'No authentication token provided.'
        })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json({
        id: 1,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        role: 'admin',
        created_at: '2025-01-01T00:00:00.000Z',
        updated_at: '2025-01-01T00:00:00.000Z'
      })
    );
  }),
  
  // Events endpoints
  rest.get('/api/events', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          title: 'Sample Event 1',
          description: 'This is a sample event',
          start_time: '2025-02-01T10:00:00.000Z',
          end_time: '2025-02-01T12:00:00.000Z',
          location: 'Sample Location',
          status: 'upcoming',
          created_by: 1,
          created_at: '2025-01-01T00:00:00.000Z',
          updated_at: '2025-01-01T00:00:00.000Z'
        },
        {
          id: 2,
          title: 'Sample Event 2',
          description: 'This is another sample event',
          start_time: '2025-02-15T14:00:00.000Z',
          end_time: '2025-02-15T16:00:00.000Z',
          location: 'Another Location',
          status: 'upcoming',
          created_by: 1,
          created_at: '2025-01-02T00:00:00.000Z',
          updated_at: '2025-01-02T00:00:00.000Z'
        }
      ])
    );
  }),
  
  rest.get('/api/events/:id', (req, res, ctx) => {
    const { id } = req.params;
    
    return res(
      ctx.status(200),
      ctx.json({
        id: parseInt(id),
        title: `Event ${id}`,
        description: `This is event ${id}`,
        start_time: '2025-02-01T10:00:00.000Z',
        end_time: '2025-02-01T12:00:00.000Z',
        location: 'Sample Location',
        status: 'upcoming',
        created_by: 1,
        created_at: '2025-01-01T00:00:00.000Z',
        updated_at: '2025-01-01T00:00:00.000Z',
        tasks: [],
        attendees: [],
        budget: null
      })
    );
  }),
  
  rest.post('/api/events', (req, res, ctx) => {
    const newEvent = {
      id: Math.floor(Math.random() * 1000),
      ...req.body,
      status: 'upcoming',
      created_by: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tasks: [],
      attendees: [],
      budget: null
    };
    
    return res(
      ctx.status(201),
      ctx.json(newEvent)
    );
  }),
  
  rest.put('/api/events/:id', (req, res, ctx) => {
    const { id } = req.params;
    
    return res(
      ctx.status(200),
      ctx.json({
        id: parseInt(id),
        ...req.body,
        updated_at: new Date().toISOString(),
        tasks: [],
        attendees: [],
        budget: null
      })
    );
  }),
  
  rest.delete('/api/events/:id', (req, res, ctx) => {
    return res(
      ctx.status(204)
    );
  }),
  
  // Venues endpoints
  rest.get('/api/venues', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          name: 'Sample Venue',
          address: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zip_code: '12345',
          capacity: 100,
          contact_person: 'John Doe',
          contact_email: 'john@example.com',
          contact_phone: '555-123-4567',
          created_at: '2025-01-01T00:00:00.000Z',
          updated_at: '2025-01-01T00:00:00.000Z'
        }
      ])
    );
  }),
  
  // Tasks endpoints
  rest.get('/api/tasks', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          title: 'Sample Task',
          description: 'This is a sample task',
          due_date: '2025-01-15T23:59:59.000Z',
          status: 'pending',
          priority: 'medium',
          assigned_to: 1,
          event_id: 1,
          created_at: '2025-01-01T00:00:00.000Z',
          updated_at: '2025-01-01T00:00:00.000Z'
        }
      ])
    );
  }),
  
  // Budgets endpoints
  rest.get('/api/budgets', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          name: 'Event Budget',
          total_amount: 5000,
          spent_amount: 2500,
          event_id: 1,
          created_at: '2025-01-01T00:00:00.000Z',
          updated_at: '2025-01-01T00:00:00.000Z',
          items: [
            {
              id: 1,
              description: 'Catering',
              amount: 2000,
              category: 'food',
              budget_id: 1,
              created_at: '2025-01-01T00:00:00.000Z',
              updated_at: '2025-01-01T00:00:00.000Z'
            },
            {
              id: 2,
              description: 'Venue Rental',
              amount: 3000,
              category: 'venue',
              budget_id: 1,
              created_at: '2025-01-01T00:00:00.000Z',
              updated_at: '2025-01-01T00:00:00.000Z'
            }
          ]
        }
      ])
    );
  })
];
