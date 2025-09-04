const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");

const QUESTIONS = {
  0: [
    {
      text: "Question 1.1",
      type: "image",
      modality: "type",
      content: "Create an image of your happiest memory.",
    },
    {
      text: "Question 1.2",
      type: "image",
      modality: "voice",
      content: "Create a self-portrait.",
    },
    {
      text: "Question 1.3",
      type: "text",
      modality: "voice",
      content:
        "Imagine your dream job in 10 years — describe what it looks like, why it excites you, and how it fits your values.",
    },
    {
      text: "Question 1.4",
      type: "text",
      modality: "type",
      content:
        "Choose one hobby, interest, or cause you deeply care about and persuade readers why more people should explore it.",
    },
  ],
  1: [
    {
      text: "Question 2.1",
      type: "image",
      modality: "voice",
      content: "Create a self-portrait.",
    },
    {
      text: "Question 2.2",
      type: "image",
      modality: "type",
      content: "Create an image of your happiest memory.",
    },
    {
      text: "Question 2.3",
      type: "text",
      modality: "type",
      content:
        "Choose one hobby, interest, or cause you deeply care about and persuade readers why more people should explore it.",
    },
    {
      text: "Question 2.4",
      type: "text",
      modality: "voice",
      content:
        "Imagine your dream job in 10 years — describe what it looks like, why it excites you, and how it fits your values.",
    },
  ],
  2: [
    {
      text: "Question 3.1",
      type: "text",
      modality: "type",
      content:
        "Imagine your dream job in 10 years — describe what it looks like, why it excites you, and how it fits your values.",
    },
    {
      text: "Question 3.2",
      type: "text",
      modality: "voice",
      content:
        "Choose one hobby, interest, or cause you deeply care about and persuade readers why more people should explore it.",
    },
    {
      text: "Question 3.3",
      type: "image",
      modality: "voice",
      content: "Create an image of your happiest memory.",
    },
    {
      text: "Question 3.4",
      type: "image",
      modality: "type",
      content: "Create a self-portrait.",
    },
  ],
  3: [
    {
      text: "Question 4.1",
      type: "text",
      modality: "voice",
      content:
        "Choose one hobby, interest, or cause you deeply care about and persuade readers why more people should explore it.",
    },
    {
      text: "Question 4.2",
      type: "text",
      modality: "type",
      content:
        "Imagine your dream job in 10 years — describe what it looks like, why it excites you, and how it fits your values.",
    },
    {
      text: "Question 4.3",
      type: "image",
      modality: "type",
      content: "Create a self-portrait.",
    },
    {
      text: "Question 4.4",
      type: "image",
      modality: "voice",
      content: "Create an image of your happiest memory.",
    },
  ],
  4: [
    {
      text: "Question 5.1",
      type: "image",
      modality: "type",
      content: "Create a self-portrait.",
    },
    {
      text: "Question 5.2",
      type: "image",
      modality: "voice",
      content: "Create an image of your happiest memory.",
    },
    {
      text: "Question 5.3",
      type: "text",
      modality: "voice",
      content:
        "Choose one hobby, interest, or cause you deeply care about and persuade readers why more people should explore it.",
    },
    {
      text: "Question 5.4",
      type: "text",
      modality: "type",
      content:
        "Imagine your dream job in 10 years — describe what it looks like, why it excites you, and how it fits your values.",
    },
  ],
  5: [
    {
      text: "Question 6.1",
      type: "image",
      modality: "voice",
      content: "Create an image of your happiest memory.",
    },
    {
      text: "Question 6.3",
      type: "image",
      modality: "type",
      content: "Create a self-portrait.",
    },
    {
      text: "Question 6.2",
      type: "text",
      modality: "type",
      content:
        "Imagine your dream job in 10 years — describe what it looks like, why it excites you, and how it fits your values.",
    },
    {
      text: "Question 6.4",
      type: "text",
      modality: "voice",
      content:
        "Choose one hobby, interest, or cause you deeply care about and persuade readers why more people should explore it.",
    },
  ],
  6: [
    {
      text: "Question 7.1",
      type: "text",
      modality: "type",
      content:
        "Choose one hobby, interest, or cause you deeply care about and persuade readers why more people should explore it.",
    },
    {
      text: "Question 7.2",
      type: "text",
      modality: "voice",
      content:
        "Imagine your dream job in 10 years — describe what it looks like, why it excites you, and how it fits your values.",
    },
    {
      text: "Question 7.3",
      type: "image",
      modality: "voice",
      content: "Create a self-portrait.",
    },
    {
      text: "Question 7.4",
      type: "image",
      modality: "type",
      content: "Create an image of your happiest memory.",
    },
  ],
  7: [
    {
      text: "Question 8.1",
      type: "text",
      modality: "type",
      content:
        "Choose one hobby, interest, or cause you deeply care about and persuade readers why more people should explore it.",
    },
    {
      text: "Question 8.2",
      type: "text",
      modality: "voice",
      content:
        "Imagine your dream job in 10 years — describe what it looks like, why it excites you, and how it fits your values.",
    },
    {
      text: "Question 8.3",
      type: "image",
      modality: "type",
      content: "Create an image of your happiest memory.",
    },
    {
      text: "Question 8.4",
      type: "image",
      modality: "voice",
      content: "Create a self-portrait.",
    },
  ],
};

router.get("/questions", authenticateToken, async (req, res) => {
  try {
    const order = parseInt(req.query.order);
    if (order === null || order === undefined || !QUESTIONS[order]) {
      return res.status(400).json({ success: false, message: "Invalid order" });
    }
    res.status(200).json({ success: true, questions: QUESTIONS[order] });
  } catch (error) {
    console.log("Error: ", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching questions" });
  }
});

module.exports = router;
