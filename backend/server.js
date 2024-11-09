const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { OpenAI} = require('openai');

// Basic configuration
const port = process.env.PORT || 5001;
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// OpenAI configuration
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

// Route to handle prompt
app.post('/api/text', async(req, res) => {
    const { prompt } = req.body;
    let response = "";
    console.log("Recieved Prompt: ",prompt);

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: 'system', content: 'You are a helpful assistant.'},
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

// Route to handle DALLE
app.post('/api/dalle', async(req,res) => {
    const { prompt } = req.body;
    let image_url = "";
    console.log("Recieved Prompt: ",prompt);

    try {
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
          });
          image_url = response.data[0].url;
    }
    catch (error) {
        console.log("Error: ", error);
        image_url = "I am sorry, Something went wrong!";
    }
    res.json(image_url);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

