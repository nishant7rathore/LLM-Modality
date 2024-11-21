// API route for gpt-text calls
const express = require('express');
const { OpenAI } = require('openai');
require('dotenv').config();

// Basic configuration
const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/text', async(req, res) => {
    const { prompt } = req.body;
    let response = "";
    console.log("Recieved Prompt: ", prompt);

    try {
        // Creation call to OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                {
                    role: 'user',
                    content: prompt,
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