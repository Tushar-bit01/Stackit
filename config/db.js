const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(' MongoDB connected successfully');
    console.log(' Connected to:', conn.connection.host);
    console.log(' Database name:', conn.connection.name);
  } catch (err) {
    console.error(' Database connection failed:', err);
    process.exit(1);
  }
};

module.exports = connectDB;