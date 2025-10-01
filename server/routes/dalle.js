// API route for dalle-image calls
const express = require("express");
const { OpenAI } = require("openai");
const authenticateToken = require("../middleware/auth");
const { S3Client } = require("@aws-sdk/client-s3");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

// Basic configuration
const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// S3 Configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

router.post("/dalle", authenticateToken, async (req, res) => {
  console.log("Request: ", req.body);
  const prompt = req.body.prompt;
  const order = req.body.order;
  const questionID = req.body.questionID;
  const userID = req.user.PROLIFIC_PID;
  const oldPrompts = req.body.oldPrompts || ""; // Now oldPrompts is previous prompts, separated by $Prompt>

  // Combine previous prompts and current prompt
  let combinedPrompt = "";
  if (oldPrompts && oldPrompts.trim() !== "") {
    combinedPrompt = `Here is the history of previous prompts, each separated by "$Prompt>":\n${oldPrompts}\n\n$Prompt>\n${prompt}\nPlease combine all these prompts to generate an image that captures the overall idea and any successive improvements or refinements made to the prompt. Focus on the latest prompt after the last "$Prompt>", but use the context from previous prompts to inform the image generation.`;
  } else {
    combinedPrompt = `Previous prompts may not be available as this could be the first prompt in the context.\n\n$Prompt>\n${prompt}\nPlease generate an image based on this instruction.`;
  }

  console.log("Combined Prompt for DALL-E: ", combinedPrompt);
  console.log("User ID dalle.js: ", userID);

  try {
    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: combinedPrompt,
      n: 1,
      quality: "high",
      size: "1024x1024",
    });

    const imageBase64 = response.data[0].b64_json;
    const imageBuffer = Buffer.from(imageBase64, "base64");

    // Generate unique filename
    const fileName = `${userID}-${order}-${questionID}-${Date.now()}.png`;

    // Upload the image to S3
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Body: imageBuffer,
      ContentType: "image/png",
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    // Generate the URL for the image
    const image_url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    console.log("Image URL: ", image_url);

    res.json(image_url);
  } catch (error) {
    const errorMessage = "I am sorry, Something went wrong!";
    console.log("Error:" + errorMessage + "- ", error);
    res.status(500).json({ success: false, message: errorMessage });
  }
});

module.exports = router;
