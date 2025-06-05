const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

const QUESTIONS = {
    0: [
        { text: "Question 1.1", type: "image", modality: "type", content: "Create a prompt to generate an image of a futuristic city with flying cars and holographic billboards. Include details about lighting, atmosphere, and architectural style." },
        { text: "Question 1.2", type: "image", modality: "type", content: "Create a prompt to generate an image of a serene forest with a river running through it. Include details about the time of day, weather, and wildlife." },
        { text: "Question 1.3", type: "text", modality: "type",  content: "Write a short story about a time traveler who discovers a hidden portal to another dimension. Include details about the time period, location, and the traveler's journey." },
        { text: "Question 1.4", type: "text", modality: "type", content: "Write a poem about the beauty of nature and the changing seasons. Include vivid descriptions of the landscape, weather, and wildlife." },
        { text: "Question 1.5", type: "text", modality: "type", content: "Write a dialogue between two characters who are stranded on a deserted island. Include details about their personalities, motivations, and survival strategies." },
        { text: "Question 1.6", type: "image", modality: "type", content: "Create a prompt to generate an image of a futuristic city with flying cars and holographic billboards. Include details about lighting, atmosphere, and architectural style." },
        { text: "Question 1.7", type: "image", modality: "type", content: "Create a prompt to generate an image of a serene forest with a river running through it. Include details about the time of day, weather, and wildlife." },
        { text: "Question 1.8", type: "text", modality: "type", content: "Write a short story about a time traveler who discovers a hidden portal to another dimension. Include details about the time period, location, and the traveler's journey." },
        { text: "Question 1.9", type: "text", modality: "type", content: "Write a poem about the beauty of nature and the changing seasons. Include vivid descriptions of the landscape, weather, and wildlife." },
        { text: "Question 1.10", type: "text", modality: "type", content: "Write a dialogue between two characters who are stranded on a deserted island. Include details about their personalities, motivations, and survival strategies." },
        { text: "Question 1.11", type: "image", modality: "voice", content: "Create a prompt to generate an image of a futuristic city with flying cars and holographic billboards. Include details about lighting, atmosphere, and architectural style." },
        { text: "Question 1.12", type: "image", modality: "voice", content: "Create a prompt to generate an image of a serene forest with a river running through it. Include details about the time of day, weather, and wildlife." },
        { text: "Question 1.13", type: "text", modality: "voice",  content: "Write a short story about a time traveler who discovers a hidden portal to another dimension. Include details about the time period, location, and the traveler's journey." },
        { text: "Question 1.14", type: "text", modality: "voice", content: "Write a poem about the beauty of nature and the changing seasons. Include vivid descriptions of the landscape, weather, and wildlife." },
        { text: "Question 1.15", type: "text", modality: "voice", content: "Write a dialogue between two characters who are stranded on a deserted island. Include details about their personalities, motivations, and survival strategies." },
        { text: "Question 1.16", type: "image", modality: "voice", content: "Create a prompt to generate an image of a futuristic city with flying cars and holographic billboards. Include details about lighting, atmosphere, and architectural style." },
        { text: "Question 1.17", type: "image", modality: "voice", content: "Create a prompt to generate an image of a serene forest with a river running through it. Include details about the time of day, weather, and wildlife." },
        { text: "Question 1.18", type: "text", modality: "voice", content: "Write a short story about a time traveler who discovers a hidden portal to another dimension. Include details about the time period, location, and the traveler's journey." },
        { text: "Question 1.19", type: "text", modality: "voice", content: "Write a poem about the beauty of nature and the changing seasons. Include vivid descriptions of the landscape, weather, and wildlife." },
        { text: "Question 1.20", type: "text", modality: "voice", content: "Write a dialogue between two characters who are stranded on a deserted island. Include details about their personalities, motivations, and survival strategies." },
    ],
    1: [
        { text: "Question 2.1", type: "text", modality: "type", content: "Write a short story about a detective who solves a mysterious crime in a futuristic city. Include details about the crime scene, suspects, and the detective's methods." },
        { text: "Question 2.2", type: "image", modality: "type", content: "Create a prompt to generate an image of a futuristic city with flying cars and holographic billboards. Include details about lighting, atmosphere, and architectural style." },
        { text: "Question 2.3", type: "image", modality: "type", content: "Create a prompt to generate an image of a serene forest with a river running through it. Include details about the time of day, weather, and wildlife." },
        { text: "Question 2.4", type: "text", modality: "type", content: "Write a short story about a time traveler who discovers a hidden portal to another dimension. Include details about the time period, location, and the traveler's journey." },
        { text: "Question 2.5", type: "text", modality: "type", content: "Write a poem about the beauty of nature and the changing seasons. Include vivid descriptions of the landscape, weather, and wildlife." },
        { text: "Question 2.6", type: "text", modality: "type", content: "Write a short story about a detective who solves a mysterious crime in a futuristic city. Include details about the crime scene, suspects, and the detective's methods." },
        { text: "Question 2.7", type: "image", modality: "type", content: "Create a prompt to generate an image of a futuristic city with flying cars and holographic billboards. Include details about lighting, atmosphere, and architectural style." },
        { text: "Question 2.8", type: "image", modality: "type", content: "Create a prompt to generate an image of a serene forest with a river running through it. Include details about the time of day, weather, and wildlife." },
        { text: "Question 2.9", type: "text", modality: "type", content: "Write a short story about a time traveler who discovers a hidden portal to another dimension. Include details about the time period, location, and the traveler's journey." },
        { text: "Question 2.10", type: "text", modality: "type", content: "Write a poem about the beauty of nature and the changing seasons. Include vivid descriptions of the landscape, weather, and wildlife." },
        { text: "Question 2.11", type: "text", modality: "voice", content: "Write a short story about a detective who solves a mysterious crime in a futuristic city. Include details about the crime scene, suspects, and the detective's methods." },
        { text: "Question 2.12", type: "image", modality: "voice", content: "Create a prompt to generate an image of a futuristic city with flying cars and holographic billboards. Include details about lighting, atmosphere, and architectural style." },
        { text: "Question 2.13", type: "image", modality: "voice", content: "Create a prompt to generate an image of a serene forest with a river running through it. Include details about the time of day, weather, and wildlife." },
        { text: "Question 2.14", type: "text", modality: "voice", content: "Write a short story about a time traveler who discovers a hidden portal to another dimension. Include details about the time period, location, and the traveler's journey." },
        { text: "Question 2.15", type: "text", modality: "voice", content: "Write a poem about the beauty of nature and the changing seasons. Include vivid descriptions of the landscape, weather, and wildlife." },
        { text: "Question 2.16", type: "text", modality: "voice", content: "Write a short story about a detective who solves a mysterious crime in a futuristic city. Include details about the crime scene, suspects, and the detective's methods." },
        { text: "Question 2.17", type: "image", modality: "voice", content: "Create a prompt to generate an image of a futuristic city with flying cars and holographic billboards. Include details about lighting, atmosphere, and architectural style." },
        { text: "Question 2.18", type: "image", modality: "voice", content: "Create a prompt to generate an image of a serene forest with a river running through it. Include details about the time of day, weather, and wildlife." },
        { text: "Question 2.19", type: "text", modality: "voice", content: "Write a short story about a time traveler who discovers a hidden portal to another dimension. Include details about the time period, location, and the traveler's journey." },
        { text: "Question 2.20", type: "text", modality: "voice", content: "Write a poem about the beauty of nature and the changing seasons. Include vivid descriptions of the landscape, weather, and wildlife." },
    ],
    2: [
        { text: "Question 3.1", type: "text", modality: "type", content: "Write a dialogue between two characters who are stranded on a deserted island. Include details about their personalities, motivations, and survival strategies." },
        { text: "Question 3.2", type: "text", modality: "voice", content: "Write a short story about a detective who solves a mysterious crime in a futuristic city. Include details about the crime scene, suspects, and the detective's methods." },
        { text: "Question 3.3", type: "image", modality: "type", content: "Create a prompt to generate an image of a futuristic city with flying cars and holographic billboards. Include details about lighting, atmosphere, and architectural style." },
        { text: "Question 3.4", type: "text", modality: "type", content: "Write a short story about a time traveler who discovers a hidden portal to another dimension. Include details about the time period, location, and the traveler's journey." },
        { text: "Question 3.5", type: "text", modality: "type", content: "Write a poem about the beauty of nature and the changing seasons. Include vivid descriptions of the landscape, weather, and wildlife." },
    ],
    3: [
        { text: "Question 4.1", type: "text", modality: "type", content: "Write a poem about the beauty of nature and the changing seasons. Include vivid descriptions of the landscape, weather, and wildlife." },
        { text: "Question 4.2", type: "text", modality: "voice", content: "Write a dialogue between two characters who are stranded on a deserted island. Include details about their personalities, motivations, and survival strategies." },
        { text: "Question 4.3", type: "text", modality: "type", content: "Write a short story about a detective who solves a mysterious crime in a futuristic city. Include details about the crime scene, suspects, and the detective's methods." },
        { text: "Question 4.4", type: "image", modality: "type", content: "Create a prompt to generate an image of a futuristic city with flying cars and holographic billboards. Include details about lighting, atmosphere, and architectural style." },
        { text: "Question 4.5", type: "image", modality: "type", content: "Create a prompt to generate an image of a serene forest with a river running through it. Include details about the time of day, weather, and wildlife." },
    ],
    4: [
        { text: "Question 5.1", type: "text", modality: "type", content: "Write a short story about a time traveler who discovers a hidden portal to another dimension. Include details about the time period, location, and the traveler's journey." },
        { text: "Question 5.2", type: "text", modality: "voice", content: "Write a poem about the beauty of nature and the changing seasons. Include vivid descriptions of the landscape, weather, and wildlife." },
        { text: "Question 5.3", type: "text", modality: "type", content: "Write a dialogue between two characters who are stranded on a deserted island. Include details about their personalities, motivations, and survival strategies." },
        { text: "Question 5.4", type: "image", modality: "type", content: "Create a prompt to generate an image of a futuristic city with flying cars and holographic billboards. Include details about lighting, atmosphere, and architectural style." },
        { text: "Question 5.5", type: "image", modality: "type", content: "Create a prompt to generate an image of a serene forest with a river running through it. Include details about the time of day, weather, and wildlife." },
    ],
    5: [
        { text: "Question 6.1", type: "text", modality: "type", content: "Write a dialogue between two characters who are stranded on a deserted island. Include details about their personalities, motivations, and survival strategies." },
        { text: "Question 6.2", type: "text", modality: "voice", content: "Write a short story about a detective who solves a mysterious crime in a futuristic city. Include details about the crime scene, suspects, and the detective's methods." },
        { text: "Question 6.3", type: "image", modality: "voice", content: "Create a prompt to generate an image of a futuristic city with flying cars and holographic billboards. Include details about lighting, atmosphere, and architectural style." },
        { text: "Question 6.4", type: "text", modality: "type", content: "Write a short story about a time traveler who discovers a hidden portal to another dimension. Include details about the time period, location, and the traveler's journey." },
        { text: "Question 6.5", type: "text", modality: "type", content: "Write a poem about the beauty of nature and the changing seasons. Include vivid descriptions of the landscape, weather, and wildlife." },
    ],
    6: [
        { text: "Question 7.1", type: "text", modality: "type", content: "Write a poem about the beauty of nature and the changing seasons. Include vivid descriptions of the landscape, weather, and wildlife." },
        { text: "Question 7.2", type: "text", modality: "type", content: "Write a dialogue between two characters who are stranded on a deserted island. Include details about their personalities, motivations, and survival strategies." },
        { text: "Question 7.3", type: "text", modality: "type", content: "Write a short story about a detective who solves a mysterious crime in a futuristic city. Include details about the crime scene, suspects, and the detective's methods." },
        { text: "Question 7.4", type: "image", modality: "type", content: "Create a prompt to generate an image of a futuristic city with flying cars and holographic billboards. Include details about lighting, atmosphere, and architectural style." },
        { text: "Question 7.5", type: "image", modality: "type", content: "Create a prompt to generate an image of a serene forest with a river running through it. Include details about the time of day, weather, and wildlife." },
    ],
    7: [
        { text: "Question 8.1", type: "text", modality: "type", content: "Write a short story about a time traveler who discovers a hidden portal to another dimension. Include details about the time period, location, and the traveler's journey." },
        { text: "Question 8.2", type: "text", modality: "type", content: "Write a poem about the beauty of nature and the changing seasons. Include vivid descriptions of the landscape, weather, and wildlife." },
        { text: "Question 8.3", type: "text", modality: "type", content: "Write a dialogue between two characters who are stranded on a deserted island. Include details about their personalities, motivations, and survival strategies." },
        { text: "Question 8.4", type: "image", modality: "type", content: "Create a prompt to generate an image of a futuristic city with flying cars and holographic billboards. Include details about lighting, atmosphere, and architectural style." },
        { text: "Question 8.5", type: "image", modality: "type", content: "Create a prompt to generate an image of a serene forest with a river running through it. Include details about the time of day, weather, and wildlife." },
    ],
    8: [
        { text: "Question 9.1", type: "text", modality: "type", content: "Write a dialogue between two characters who are stranded on a deserted island. Include details about their personalities, motivations, and survival strategies." },
        { text: "Question 9.2", type: "text", modality: "type", content: "Write a short story about a detective who solves a mysterious crime in a futuristic city. Include details about the crime scene, suspects, and the detective's methods." },
        { text: "Question 9.3", type: "image", modality: "type", content: "Create a prompt to generate an image of a futuristic city with flying cars and holographic billboards. Include details about lighting, atmosphere, and architectural style." },
        { text: "Question 9.4", type: "text", modality: "type", content: "Write a short story about a time traveler who discovers a hidden portal to another dimension. Include details about the time period, location, and the traveler's journey." },
        { text: "Question 9.5", type: "text", modality: "type", content: "Write a poem about the beauty of nature and the changing seasons. Include vivid descriptions of the landscape, weather, and wildlife." },
    ],
    9: [
        { text: "Question 10.1", type: "text", modality: "type", content: "Write a poem about the beauty of nature and the changing seasons. Include vivid descriptions of the landscape, weather, and wildlife." },
        { text: "Question 10.2", type: "text", modality: "type", content: "Write a dialogue between two characters who are stranded on a deserted island. Include details about their personalities, motivations, and survival strategies." },
        { text: "Question 10.3", type: "text", modality: "type", content: "Write a short story about a detective who solves a mysterious crime in a futuristic city. Include details about the crime scene, suspects, and the detective's methods." },
        { text: "Question 10.4", type: "image", modality: "type", content: "Create a prompt to generate an image of a futuristic city with flying cars and holographic billboards. Include details about lighting, atmosphere, and architectural style." },
        { text: "Question 10.5", type: "image", modality: "type", content: "Create a prompt to generate an image of a serene forest with a river running through it. Include details about the time of day, weather, and wildlife." },
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