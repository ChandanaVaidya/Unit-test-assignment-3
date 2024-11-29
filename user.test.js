const { app, connection } = require('./server');
const request = require('supertest'); // For HTTP requests during tests

let userId; // updating id

beforeAll(async () => {
  await connection(); // Creating connection test
});

describe('User API', () => {
  
  // Test creating a user
  it('should create a user', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'John Doe', email: 'john.doe@example.com', age: 30 });
    
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created');
    
    // Storing the created user ID for updte test
    userId = response.body.user._id;
  });

  // Test fetching all users
  it('should fetch users', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test updating a user
  it('should update an existing user', async () => {
    const updatedUser = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      age: 28
    };

    const response = await request(app)
      .put(`/users/${userId}`)
      .send(updatedUser);
    
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Updated');
    console.log(updatedUser.name);
    console.log(updatedUser.email);

  });

});
