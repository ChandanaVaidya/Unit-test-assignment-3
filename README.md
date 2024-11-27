# Unit-test-assignment-3
Mongo db,express js and  unit test writing


This is a REST API built using **Node.js**, **Express.js**, and **MongoDB**. The API allows for creating, updating, and fetching users from MongoDB.


### API Endpoints

### 1. **Create a User**

- **Route**: `POST /users`
- **Request Body**:
  ```
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "age": 30
  }
  ```
- **Response**:
  ```
  {
    "message": "User created",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "age": 30
    }
  }
  ```

### 2. **Update a User**

- **Route**: `PUT /users/:id`
- **Request Body**:
  ```
  {
    "name": "John Updated",
    "email": "updated@example.com",
    "age": 31
  }
  ```
- **Response**:
  ```
  {
    "message": "Updated",
    "user": {
      "_id": "user_id",
      "name": "John Updated",
      "email": "updated@example.com",
      "age": 31
    }
  }
  ```

### 3. **Get Users List**

- **Route**: `GET /users`
- **Response**:
  ```
  [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "age": 30
    },
    {
      "_id": "user_id",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "age": 25
    }
  ]
  ```



## Testing

### 1. Unit Tests with Jest

Includes unit tests written using **Jest** and **supertest**. The tests mock MongoDB methods to ensure proper functionality .


Basic functionality for creating, updating, and fetching users. Used **MongoDB** for storage and **Express.js** to handle HTTP requests. The includes tests using **Jest** and **supertest** for API validation. 

