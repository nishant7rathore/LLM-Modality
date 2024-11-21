// Helper functions to create and verify JWT tokens

require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';

// Function to generate JWT token
const generateToken = () => {
    return jwt.sign({}, JWT_SECRET, { expiresIn: '1h' });
};

// Function to verify JWT token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch (error) {
        return null;
    }
};

module.exports = { generateToken, verifyToken };