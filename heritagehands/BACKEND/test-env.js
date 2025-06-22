require('dotenv').config();

console.log('Testing environment variables:');
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('NODE_ENV:', process.env.NODE_ENV);

if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not set!');
} else {
    console.log('JWT_SECRET is set correctly');
} 