// Route to get data from frontend and write to database
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

router.post('/db', authenticateToken, (req, res) => {
    const studyData = req.body;
    console.log("Study Data: ", studyData);
    res.status(200).json({ message: "Data received successfully!" });
});

module.exports = router;