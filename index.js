require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { MongoClient, ObjectId } = require('mongodb');
const router = require('./routes/api');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Database client
let db;

// Connect to MongoDB
MongoClient.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(client => {
  db = client.db(); // default db from URI
  console.log('Oh Thank God MongoDB is connected 🎉');

  // Start server after DB connects
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
})
.catch(err => console.error('MongoDB Connection failed... 🙏 Only God Can save you now', err));

app.use('/', router);
