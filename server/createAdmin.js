const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdminUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected\n');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@dairydrop.com' });
        
        if (existingAdmin) {
            console.log('✅ Admin user already exists!');
            console.log('Email: admin@dairydrop.com');
            console.log('Password: admin123');
            console.log('\nYou can login with these credentials.');
            process.exit(0);
        }

        // Create new admin user
        const adminUser = await User.create({
            name: 'Admin',
            email: 'admin@dairydrop.com',
            password: 'admin123',
            phone: '1234567890',
            address: 'Admin Office',
            isAdmin: true
        });

        console.log('✅ Admin user created successfully!\n');
        console.log('Login credentials:');
        console.log('Email: admin@dairydrop.com');
        console.log('Password: admin123');
        console.log('\nYou can now login at http://localhost:5173/login');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

createAdminUser();
