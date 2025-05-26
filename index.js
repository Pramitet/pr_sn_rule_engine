require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./app')

const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Oh Thank God MongoDB is connected 🎉');

  // Start server after DB connects
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
})
.catch(err => console.error('MongoDB Connection failed... 🙏 Only God Can save you now', err));


