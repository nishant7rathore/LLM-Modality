// API route for gpt-text calls
const express = require('express');
const { OpenAI } = require('openai');
const authenticateToken = require('../middleware/auth');
require('dotenv').config();

// Basic configuration
const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/text', authenticateToken, async(req, res) => {
    const { prompt, oldResponse } = req.body;
    let response = "";
    console.log("Recieved Prompt: ", prompt);

    try {
        response = "Text Call is good!";
        let content = "New prompt: " + prompt + (oldResponse ? `\n\nPrevious Response: ${oldResponse}` : "");
        console.log("Content to send: ", content);
        // Creation call to OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: 'system', content: 'You are a helpful assistant. Update the previous response (if available) based on the new prompt given.' },
                {
                    role: 'user',
                    content: content
                },
            ]
        });
        console.log("Completion: ", completion);
        response = completion.choices[0].message.content;
    }
    catch (error) {
        console.log("Error: ", error);
        response = "I am sorry, Something went wrong!";
    }
    res.json(response);
});

module.exports = router;