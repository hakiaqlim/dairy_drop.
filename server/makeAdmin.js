const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const makeAdmin = async (email) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const user = await User.findOne({ email });

        if (!user) {
            console.log(`❌ User with email "${email}" not found`);
            process.exit(1);
        }

        // Update user directly without triggering pre-save hook
        await User.updateOne({ email }, { $set: { isAdmin: true } });

        console.log(`✅ User "${user.name}" (${user.email}) is now an admin!`);
        console.log('User details:', {
            name: user.name,
            email: user.email,
            isAdmin: true
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

// Get email from command line argument
const email = process.argv[2];

if (!email) {
    console.log('❌ Please provide an email address');
    console.log('Usage: node makeAdmin.js <email>');
    console.log('Example: node makeAdmin.js admin@example.com');
    process.exit(1);
}

makeAdmin(email);
