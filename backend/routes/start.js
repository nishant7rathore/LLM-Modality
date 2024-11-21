// Route to start session
const express = require('express');
const { generateToken } = require('../util/jwt');
const { decodeToken } = require('../util/jwt');

// Basic configuration
const router = express.Router();

router.post('/start', (req, res) => {
    const token = generateToken();
    const decoded = decodeToken(token);
    const userID = decoded.userID;
    res.json({ token, userID });
});

module.exports = router;