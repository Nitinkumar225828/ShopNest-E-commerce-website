
const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// Set custom DNS servers to resolve SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://nitinkumar81715_db_user:Nitin1234@cluster0.avhqbgr.mongodb.net/?appName=Cluster0", {
      // Connection options for better error handling
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Don't exit the process, let the application handle it
    throw error;
  }
};

module.exports = connectDB;
