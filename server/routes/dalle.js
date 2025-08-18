// API route for dalle-image calls
const express = require('express');
const { OpenAI } = require('openai');
const authenticateToken = require('../middleware/auth');
const { S3Client } = require('@aws-sdk/client-s3'); 
const { PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

// Basic configuration
const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// S3 Configuration
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

router.post('/dalle', authenticateToken, async(req, res) => {
    console.log("Request: ", req.body);
    const prompt = req.body.prompt;
    const order = req.body.order;
    const questionID = req.body.questionID;
    const userID = req.user.PROLIFIC_PID;
    const oldInputText = req.body.oldResponse || ""; // Now oldResponse is previous input text

    // Combine previous input text and current prompt
    let combinedPrompt = "";
    if (oldInputText && oldInputText.trim() !== "") {
        combinedPrompt = `Here is the previous instruction: "${oldInputText}".\nHere is the new instruction: "${prompt}".\nPlease generate an image that reflects both instructions together.`;
    } else {
        combinedPrompt = `Instruction: "${prompt}". Please generate an image based on this instruction.`;
    }

    console.log("Combined Prompt for DALL-E: ", combinedPrompt);
    console.log("User ID dalle.js: ", userID);

    try {
        // Always use images.generate, since we are not sending an image buffer anymore
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: combinedPrompt,
            n: 1,
            size: "1024x1024"
        });

        const imageViewUrl = response.data[0].url;
        const revised_prompt = response.data[0].revised_prompt;
        console.log("Revised Prompt: ", revised_prompt);
        console.log("Image URL: ", imageViewUrl);

        // Download the image from DALL-E
        const imageResponse = await fetch(imageViewUrl);
        const imageBuffer = await imageResponse.arrayBuffer();

        // Generate unique filename
        const fileName = `${userID}-${order}-${questionID}-${Date.now()}.png`;

        // Upload the image to S3
        const uploadParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileName,
            Body: Buffer.from(imageBuffer),
            ContentType: 'image/png'
        };
        
        await s3Client.send(new PutObjectCommand(uploadParams));

        // Generate the URL for the image
        const image_url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
        console.log("Image URL: ", image_url);

        res.json(image_url);
    }
    catch (error) {
        const errorMessage = "I am sorry, Something went wrong!";
        console.log("Error:" + errorMessage + "- ", error);
        res.status(500).json({ error: errorMessage });
    }
});

module.exports = router;