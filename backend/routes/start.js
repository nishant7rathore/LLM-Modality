// Route to start session
const express = require('express');
const { generateToken } = require('../util/jwt');

// Basic configuration
const router = express.Router();

router.post('/start', (req, res) => {
    const token = generateToken();
    res.json({ token });
});

module.exports = router;