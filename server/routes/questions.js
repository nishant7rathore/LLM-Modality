const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

const QUESTIONS = {
    0: [
        { text: "Question 1.1", type: "text" },
        { text: "Question 1.2", type: "text" },
        { text: "Question 1.3", type: "text" },
        { text: "Question 1.4", type: "text" },
        { text: "Question 1.5", type: "text" },
    ],
    1: [
        { text: "Question 2.1", type: "text" },
        { text: "Question 2.2", type: "text" },
        { text: "Question 2.3", type: "text" },
        { text: "Question 2.4", type: "text" },
        { text: "Question 2.5", type: "text" },
    ],
    2: [
        { text: "Question 3.1", type: "text" },
        { text: "Question 3.2", type: "text" },
        { text: "Question 3.3", type: "text" },
        { text: "Question 3.4", type: "text" },
        { text: "Question 3.5", type: "text" },
    ],
    3: [
        { text: "Question 4.1", type: "text" },
        { text: "Question 4.2", type: "text" },
        { text: "Question 4.3", type: "text" },
        { text: "Question 4.4", type: "text" },
        { text: "Question 4.5", type: "text" },
    ],
    4: [
        { text: "Question 5.1", type: "text" },
        { text: "Question 5.2", type: "text" },
        { text: "Question 5.3", type: "text" },
        { text: "Question 5.4", type: "text" },
        { text: "Question 5.5", type: "text" },
    ],
    5: [
        { text: "Question 6.1", type: "text" },
        { text: "Question 6.2", type: "text" },
        { text: "Question 6.3", type: "text" },
        { text: "Question 6.4", type: "text" },
        { text: "Question 6.5", type: "text" },
    ],
    6: [
        { text: "Question 7.1", type: "text" },
        { text: "Question 7.2", type: "text" },
        { text: "Question 7.3", type: "text" },
        { text: "Question 7.4", type: "text" },
        { text: "Question 7.5", type: "text" },
    ],
    7: [
        { text: "Question 8.1", type: "text" },
        { text: "Question 8.2", type: "text" },
        { text: "Question 8.3", type: "text" },
        { text: "Question 8.4", type: "text" },
        { text: "Question 8.5", type: "text" },
    ],
    8: [
        { text: "Question 9.1", type: "text" },
        { text: "Question 9.2", type: "text" },
        { text: "Question 9.3", type: "text" },
        { text: "Question 9.4", type: "text" },
        { text: "Question 9.5", type: "text" },
    ],
    9: [
        { text: "Question 10.1", type: "text" },
        { text: "Question 10.2", type: "text" },
        { text: "Question 10.3", type: "text" },
        { text: "Question 10.4", type: "text" },
        { text: "Question 10.5", type: "text" },
    ],
};

router.get('/questions', authenticateToken ,async (req, res) => {
    try {
        const order = parseInt(req.query.order);
        if (order === null || order === undefined || !QUESTIONS[order])
        {
            return res.status(400).json({ success: false, message: "Invalid order" });
        }
        res.status(200).json({ success: true, questions: QUESTIONS[order] });
    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ success: false, message: "Error fetching questions" });
    }
});

module.exports = router;