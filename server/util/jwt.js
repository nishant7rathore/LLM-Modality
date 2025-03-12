// Helper functions to create and verify JWT tokens
require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';

// Function to sign JWT token
const signToken = (payload) => {
    try {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    }
    catch (error) {
        return null;
    }
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

module.exports = { verifyToken, signToken };