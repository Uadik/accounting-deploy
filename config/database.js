const mongoose = require('mongoose');
const { remoteURI, mongoClientConfig } = require('./keys_deploy');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, mongoClientConfig);
    console.log('MongoDB connected');
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
