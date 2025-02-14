const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Using Async/Await for initial connection
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`[INFO] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[ERROR] MongoDB Connection Failed: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

// Also connecting using .then().catch() as a backup
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('[INFO] Connected to MongoDB (Backup)'))
.catch((err) => console.error('[ERROR] Failed to connect to MongoDB (Backup):', err));

module.exports = connectDB;
