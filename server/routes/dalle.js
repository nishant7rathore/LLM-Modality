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
    const imageUrl = req.body.oldResponse;
    // Download the image from DALL-E
    const oldImageResponse = imageUrl === '' ? null : await fetch(imageUrl);
    const oldImageBuffer = oldImageResponse ? await oldImageResponse.arrayBuffer() : null;

    console.log("Recieved Prompt dalle.js: ", prompt);
    console.log("User ID dalle.js: ", userID);

    try {
        let response;
        if (oldImageBuffer) {
            response = await openai.images.edit({
                model: "dall-e-2",
                prompt: "Can you look at the image (if attached) and update it according to this instruction? :" + prompt,
                n: 1,
                size: "1024x1024",
                image: [
                    {
                        name: "base.png", // filename is important
                        buffer: Buffer.from(oldImageBuffer) // the binary data
                    }
                ]
            });
        } else {
            response = await openai.images.generate({
                model: "dall-e-3",
                prompt: prompt,
                n: 1,
                size: "1024x1024"
            });
        }

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
    }
});

module.exports = router;