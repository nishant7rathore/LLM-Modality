const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

const QUESTIONS = {
    0: [
        { text: "Question 1.1", type: "image", modality: "voice", content: "%PUBLIC_URL%/img/family-holding-hands-in-winter.jpg" },
        { text: "Question 1.2", type: "image", modality: "type", content: "%PUBLIC_URL%/img/masked-people-on-the-boardwalk-next-to-open-water.jpg" },
        { text: "Question 1.3", type: "text", modality: "voice",  content: "Write a short story about a time traveler who discovers a hidden portal to another dimension. Include details about the time period, location, and the traveler's journey." },
        { text: "Question 1.4", type: "text", modality: "type", content: "Write a poem about the beauty of nature and the changing seasons. Include vivid descriptions of the landscape, weather, and wildlife." }
    ],
    1: [
        { text: "Question 2.1", type: "image", modality: "type", content: "%PUBLIC_URL%/img/family-holding-hands-in-winter.jpg" },
        { text: "Question 2.2", type: "text", modality: "voice", content: "Create a prompt to generate an image of a futuristic city with flying cars and holographic billboards. Include details about lighting, atmosphere, and architectural style." },
        { text: "Question 2.3", type: "text", modality: "type", content: "Create a prompt to generate an image of a serene forest with a river running through it. Include details about the time of day, weather, and wildlife." },
        { text: "Question 2.4", type: "image", modality: "voice", content: "%PUBLIC_URL%/img/masked-people-on-the-boardwalk-next-to-open-water.jpg" }
    ],
    2: [
        { text: "Question 3.1", type: "text", modality: "voice", content: "Write a dialogue between two characters who are stranded on a deserted island. Include details about their personalities, motivations, and survival strategies." },
        { text: "Question 3.2", type: "text", modality: "type", content: "Write a short story about a detective who solves a mysterious crime in a futuristic city. Include details about the crime scene, suspects, and the detective's methods." },
        { text: "Question 3.3", type: "image", modality: "voice", content: "%PUBLIC_URL%/img/family-holding-hands-in-winter.jpg" },
        { text: "Question 3.4", type: "image", modality: "type", content: "%PUBLIC_URL%/img/masked-people-on-the-boardwalk-next-to-open-water.jpg" },
    ],
    3: [
        { text: "Question 4.1", type: "text", modality: "voice", content: "Write a dialogue between two characters who are stranded on a deserted island. Include details about their personalities, motivations, and survival strategies." },
        { text: "Question 4.2", type: "image", modality: "voice", content: "%PUBLIC_URL%/img/masked-people-on-the-boardwalk-next-to-open-water.jpg" },
        { text: "Question 4.3", type: "image", modality: "type", content: "%PUBLIC_URL%/img/family-holding-hands-in-winter.jpg" },
        { text: "Question 4.4", type: "text", modality: "type", content: "Write a poem about the beauty of nature and the changing seasons. Include vivid descriptions of the landscape, weather, and wildlife." },
    ],
    4: [
        { text: "Question 5.1", type: "text", modality: "voice", content: "Write a short story about a time traveler who discovers a hidden portal to another dimension. Include details about the time period, location, and the traveler's journey." },
        { text: "Question 5.2", type: "image", modality: "type", content: "%PUBLIC_URL%/img/masked-people-on-the-boardwalk-next-to-open-water.jpg" },
        { text: "Question 5.3", type: "text", modality: "type", content: "Write a dialogue between two characters who are stranded on a deserted island. Include details about their personalities, motivations, and survival strategies." },
        { text: "Question 5.4", type: "image", modality: "voice", content: "%PUBLIC_URL%/img/family-holding-hands-in-winter.jpg" }
    ],
    5: [
        { text: "Question 6.1", type: "image", modality: "type", content: "%PUBLIC_URL%/img/family-holding-hands-in-winter.jpg" },
        { text: "Question 6.2", type: "text", modality: "type", content: "Write a short story about a detective who solves a mysterious crime in a futuristic city. Include details about the crime scene, suspects, and the detective's methods." },
        { text: "Question 6.3", type: "image", modality: "voice", content: "%PUBLIC_URL%/img/masked-people-on-the-boardwalk-next-to-open-water.jpg" },
        { text: "Question 6.4", type: "text", modality: "voice", content: "Write a short story about a time traveler who discovers a hidden portal to another dimension. Include details about the time period, location, and the traveler's journey." }
    ],
    6: [
        { text: "Question 7.1", type: "text", modality: "type", content: "Write a poem about the beauty of nature and the changing seasons. Include vivid descriptions of the landscape, weather, and wildlife." },
        { text: "Question 7.2", type: "image", modality: "voice", content: "%PUBLIC_URL%/img/family-holding-hands-in-winter.jpg" },
        { text: "Question 7.3", type: "text", modality: "voice", content: "Write a short story about a detective who solves a mysterious crime in a futuristic city. Include details about the crime scene, suspects, and the detective's methods." },
        { text: "Question 7.4", type: "image", modality: "type", content: "%PUBLIC_URL%/img/masked-people-on-the-boardwalk-next-to-open-water.jpg" }
    ],
    7: [
        { text: "Question 8.1", type: "image", modality: "voice", content: "%PUBLIC_URL%/img/masked-people-on-the-boardwalk-next-to-open-water.jpg" },
        { text: "Question 8.2", type: "text", modality: "voice", content: "Write a poem about the beauty of nature and the changing seasons. Include vivid descriptions of the landscape, weather, and wildlife." },
        { text: "Question 8.3", type: "image", modality: "type", content: "%PUBLIC_URL%/img/family-holding-hands-in-winter.jpg" },
        { text: "Question 8.4", type: "text", modality: "type", content: "Create a prompt to generate an image of a futuristic city with flying cars and holographic billboards. Include details about lighting, atmosphere, and architectural style." }
    ]
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