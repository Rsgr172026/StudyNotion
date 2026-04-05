const mongoose = require('mongoose');
require('dotenv').config();

// Connect to database
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/StudyNotion')
  .then(async () => {
    console.log('Connected to database');
    
    // Get all users
    const User = require('./models/User');
    const users = await User.find({}).select('firstName lastName email accountType');
    
    console.log('\nRegistered Users:');
    console.log('================');
    users.forEach((user, index) => {
      console.log(`${index + 1}. Name: ${user.firstName} ${user.lastName}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Account Type: ${user.accountType}`);
      console.log('---');
    });
    
    if (users.length === 0) {
      console.log('No users found in database');
    }
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });
