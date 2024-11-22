// API route for dalle-image calls
const express = require('express');
const { OpenAI } = require('openai');
const authenticateToken = require('../middleware/auth');
require('dotenv').config();

// Basic configuration
const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/dalle', authenticateToken, async(req, res) => {
    const { prompt } = req.body;
    let image_url = "";
    console.log("Recieved Prompt: ", prompt);

    try {
        image_url = "Dalle Call is good!"
        // // Generate call to OpenAI
        // const response = await openai.images.generate({
        //     model: "dall-e-3",
        //     prompt: prompt,
        //     n: 1,
        //     size: "1024x1024",
        // });
        // image_url = response.data[0].url;
    }
    catch (error) {
        console.log("Error: ", error);
        image_url = "I am sorry, Something went wrong!";
    }
    res.json(image_url);
});

module.exports = router;