const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
// HTTP request logger middleware for node.js
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();

// Middleware to log HTTP request.
app.use(morgan('dev'));  
// To parse JSON request.
app.use(bodyParser.json()); 

// Connection to mongodb
const mongoURI = 'mongodb+srv://usersdb:usersdb123@cluster2.4mysj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2';
const dbName = 'Users';

let db;
let usersCollection;
// to check on the status of the connection: useUnifiedTopology
MongoClient.connect(mongoURI, { useUnifiedTopology: true })
  .then(client => {
    db = client.db(dbName);
    // Getting the 'names' collection from the database
    usersCollection = db.collection('names'); 
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Failed to connect to DB', err);
    process.exit(1);
  });

// Creating users
app.post('/users', async (req, res) => {
  try {
    const { name, email, age } = req.body;
    // new user insertion
    const result = await usersCollection.insertOne({ name, email, age });
    res.status(201).json({ message: 'User created' , user: {
        // inserted id returning
        _id: result.insertedId, 
        name,
        email,
        age
      }});
  } catch (error) {
    // console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating' });
  }
});

// Update User
app.put('/users/:id', async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const userId = req.params.id;

    // Find the user by id and update
    const updatedUser = await usersCollection.findOneAndUpdate(
        // String to object id conversion from the path
      { _id: new ObjectId(userId) }, 
      { $set: { name, email, age } },
      // Updated document
      { returnDocument: 'after' } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Updated', user: updatedUser.value });
  } catch (error) {
    // console.error('Cannot update:', error);
    res.status(500).json({ message: 'Error updating' });
  }
});


// Get List of Users
app.get('/users', async (req, res) => {
  try {
    // Fetching all users from collection and convert to array
    const users = await usersCollection.find().toArray();
    res.json(users);
  } catch (error) {
    // console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});


// Starting server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Exportiing for the unit test purpose
module.exports = app;
