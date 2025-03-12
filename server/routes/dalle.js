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
    const { prompt } = req.body;
    const userID = req.user.userID;
    console.log("Recieved Prompt dalle.js: ", prompt);
    console.log("User ID dalle.js: ", userID);

    try {
        // Generate image with DALL-E
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
        });

        const imageUrl = response.data[0].url;
        console.log("Image URL: ", imageUrl);

        // Download the image from DALL-E
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = await imageResponse.arrayBuffer();

        // Generate unique filename
        const fileName = `${userID}-${Date.now()}.png`;

        // Upload the image to S3
        const uploadParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileName,
            Body: Buffer.from(imageBuffer),
            ContentType: 'image/png',
        };
        
        await s3Client.send(new PutObjectCommand(uploadParams));

        // Generate the URL for the image
        const image_url = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
        console.log("Image URL: ", image_url);

        res.json(imageUrl);
    }
    catch (error) {
        console.log("Error: ", error);
        image_url = "I am sorry, Something went wrong!";
    }
});

module.exports = router;