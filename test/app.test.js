import request from 'supertest';
import app from '../server.js';  // Import your Express app

// Mock Data for Testing
const mockUser = {
  username: 'testuser',
  password: 'testpassword',
};

let authToken;

// Testing the API Endpoints
describe('Node.js Backend Tests', () => {
  // Test the Login Endpoint
  describe('/POST /api/login', () => {
    it('should authenticate a user and return a JWT token', async () => {
      const res = await request(app)
        .post('/api/login')
        .send(mockUser);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      authToken = res.body.token;
    });

    it('should not authenticate a user with incorrect credentials', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({ username: 'wronguser', password: 'wrongpassword' });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Invalid username or password');
    });
  });

  // Test the Get Contacts Endpoint
  describe('/GET /api/contacts', () => {
    it('should GET all the contacts assigned to the user', async () => {
      const res = await request(app)
        .get('/api/contacts')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });

    it('should return 401 if no token is provided', async () => {
      const res = await request(app).get('/api/contacts');

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Access Denied');
    });
  });

  // Test Update Contact Endpoint
  describe('/PUT /api/contacts/:id', () => {
    it('should update the contact details', async () => {
      const res = await request(app)
        .put('/api/contacts/1')  // Assuming contact_id 1 exists for testing
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'Interested', remarks: 'Good conversation', follow_up_date: '2024-12-01' });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Contact updated successfully');
    });

    it('should return 401 if user is not authenticated', async () => {
      const res = await request(app)
        .put('/api/contacts/1')
        .send({ status: 'Follow-up' });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Access Denied');
    });
  });
});
