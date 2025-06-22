require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./Models/adminModel');
const { hashPassword } = require('./Utilities/passwordUtilities');

const createDefaultAdmin = async () => {
    try {
        console.log('MONGO_URI:', process.env.MONGO_URI);
        
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI is not defined in environment variables');
            return;
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: 'admin@heritagehands.com' });
        
        if (existingAdmin) {
            console.log('Admin already exists');
            return;
        }

        // Create default admin
        const hashedPassword = await hashPassword('admin123');
        const admin = new Admin({
            email: 'admin@heritagehands.com',
            password: hashedPassword
        });

        await admin.save();
        console.log('Default admin created successfully');
        console.log('Email: admin@heritagehands.com');
        console.log('Password: admin123');
        
    } catch (error) {
        console.error('Error creating admin:', error);
        if (error.name === 'MongoNetworkError') {
            console.log('Please make sure MongoDB is running on your system');
        }
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
        }
    }
};

createDefaultAdmin(); 