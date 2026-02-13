const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected\n');

        const users = await User.find({}).select('-password');

        if (users.length === 0) {
            console.log('❌ No users found in the database');
            console.log('Please register a user first at http://localhost:5173/register');
        } else {
            console.log(`✅ Found ${users.length} user(s):\n`);
            users.forEach((user, index) => {
                console.log(`${index + 1}. Name: ${user.name}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Admin: ${user.isAdmin ? '✅ Yes' : '❌ No'}`);
                console.log(`   Phone: ${user.phone}`);
                console.log('');
            });
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

listUsers();
