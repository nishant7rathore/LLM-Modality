// Helper functions to create and verify JWT tokens
// Create unique userID for each user
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';

// Function to generate JWT token
const generateToken = () => {
    const userID = uuidv4();
    return jwt.sign({ userID }, JWT_SECRET, { expiresIn: '1h' });
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

// Function to decode JWT token
const decodeToken = (token) => {
    return jwt.decode(token);
};

module.exports = { generateToken, verifyToken, decodeToken };