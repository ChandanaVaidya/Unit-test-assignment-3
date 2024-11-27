const request = require('supertest');
const { MongoClient } = require('mongodb');
const app = require('./server'); 

jest.mock('morgan', () => jest.fn((format) => (req, res, next) => next()));  // Mocking

// mocking momngodb
jest.mock('mongodb', () => {
  // Stimulating methods of mongodb
  const mockInsertOne = jest.fn();
  const mockFindOneAndUpdate = jest.fn();
  const mockFind = jest.fn();
  
  const mockDb = {
    collection: jest.fn().mockReturnValue({
      insertOne: mockInsertOne,
      findOneAndUpdate: mockFindOneAndUpdate,
      find: mockFind,
    }),
  };

  // mock db connections
  const mockClient = {
    db: jest.fn().mockReturnValue(mockDb),
    close: jest.fn(),
  };

  return {
    MongoClient: {
      connect: jest.fn().mockResolvedValue(mockClient),
    },
    ObjectId: jest.fn().mockReturnValue('mockObjectId'),
  };
});

const mockUser = {
  "name": 'John doe',
  "email": 'john.doe@example.com',
  "age": 30,
};

//for update user
const mockUpdatedUser = { _id: 'mockObjectId', name: 'John Updated', email: 'updated@example.com', age: 31 };

describe('User api', () => {
  beforeEach(() => {
    MongoClient.connect.mockClear();  // Reseting mock calls before testing
  });

  it('User created', async () => {
    const mockInsertOne = jest.fn().mockResolvedValue({ insertedId: 'mockObjectId' });
    MongoClient.connect.mockResolvedValueOnce({
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          insertOne: mockInsertOne,
        }),
      }),
    });

    // Send data on response
    const res = await request(app).post('/users').send(mockUser);
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User created');
    expect(res.body.user._id).toBe('mockObjectId');
  });

  it('should return err on failure', async () => {
    MongoClient.connect.mockResolvedValueOnce({
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          insertOne: jest.fn().mockRejectedValue(new Error('Could not insert')),
        }),
      }),
    });

    const res = await request(app).post('/users').send(mockUser);
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Error creating');
  });

  it('should update user', async () => {
    const mockFindOneAndUpdate = jest.fn().mockResolvedValue({
      value: { _id: 'mockObjectId', name: 'John Updated', email: 'updated@example.com', age: 31 },
    });
    
    MongoClient.connect.mockResolvedValueOnce({
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          findOneAndUpdate: mockFindOneAndUpdate,
        }),
      }),
    });

    const res = await request(app).put('/users/mockObjectId').send(mockUpdatedUser);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Updated');
    expect(res.body.user.name).toBe('John Updated');
  });

  it('should return 404 if not found', async () => {
    MongoClient.connect.mockResolvedValueOnce({
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          findOneAndUpdate: jest.fn().mockResolvedValue(null),
        }),
      }),
    });

    const res = await request(app).put('/users/mockObjectId').send(mockUpdatedUser);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('User not found');
  });

  it('should get users list', async () => {
    const mockFind = jest.fn().mockReturnValue({
      toArray: jest.fn().mockResolvedValue([mockUser]),
    });

    MongoClient.connect.mockResolvedValueOnce({
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          find: mockFind,
        }),
      }),
    });

    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('John Doe');
  });

  it('should return error on fetch fail', async () => {
    MongoClient.connect.mockResolvedValueOnce({
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          find: jest.fn().mockRejectedValue(new Error('failed to fetch')),
        }),
      }),
    });

    const res = await request(app).get('/users');
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Error fetching user');
  });
});
