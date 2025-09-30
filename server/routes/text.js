// API route for gpt-text calls
const express = require("express");
const { OpenAI } = require("openai");
const authenticateToken = require("../middleware/auth");
require("dotenv").config();

// Basic configuration
const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/text", authenticateToken, async (req, res) => {
  const { prompt, oldPrompts } = req.body;
  let response = "";
  console.log("Received Prompt: ", prompt);

  try {
    response = "Text Call is good!";
    // Compose the content for the LLM
    let content = "";
    if (oldPrompts && oldPrompts.trim() !== "") {
      content = `Here is the history of previous prompts, each separated by "$Prompt>":\n${oldPrompts}\n\n$Prompt>\n${prompt}`;
    } else {
      content = `$Prompt>\n${prompt}`;
    }
    console.log("Content to send: ", content);

    // Creation call to OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            'You are a helpful assistant. You will receive a history of previous prompts separated by "$Prompt>". Use this context to update or craft your response based on the latest prompt provided after the last "$Prompt>".',
        },
        {
          role: "user",
          content: content,
        },
      ],
    });
    console.log("Completion: ", completion);
    response = completion.choices[0].message.content;
  } catch (error) {
    console.log("Error: ", error);
    response = "I am sorry, Something went wrong!";
  }
  res.json(response);
});

module.exports = router;
