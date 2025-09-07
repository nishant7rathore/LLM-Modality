// Route to get data from frontend and write to database
const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand, DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
require("dotenv").config();

// Configuration for AWS
const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Create a new DocumentClient
const documentClient = DynamoDBDocumentClient.from(client);

// Write data to DynamoDB
router.post("/db", authenticateToken, async (req, res) => {
  const studyData = req.body;
  console.log("Recieved Data: ", studyData);

  // Define the parameters
  const params = {
    TableName: process.env.DDB_TABLE_NAME,
    Item: {
      userID: studyData.userID,
      // convert questionID to string
      questionID: studyData.questionID.toString(),
      questionType: studyData.questionType.toString(),
      modality: studyData.modality.toString(),
      prompt: studyData.prompt,
      content: studyData.content,
      response: studyData.response,
      selectedIdx: studyData.selectedIdx,
      surveyAnswers: studyData.surveyAnswers,
      createdAt: new Date().toISOString(),
    },
  };

  // Write to the database
  try {
    await documentClient.send(new PutCommand(params));
    console.log("Data written to the database");
    res.status(200).send("Data written successfully");
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send("Error writing data to the database");
  }
});

// Save demographic data to DynamoDB
router.post("/demographic", authenticateToken, async (req, res) => {
  const demographicData = req.body;
  console.log("Received Demographic Data: ", demographicData);

  // You can use participantId as the partition key, or userID if available
  const params = {
    TableName: process.env.DDB_DEMO_TABLE_NAME,
    Item: {
      dataType: "demographic", // To distinguish from studyData
      userID: demographicData.participantId,
      age: demographicData.age,
      gender: demographicData.gender,
      genderSelfDescription: demographicData.genderSelfDescription,
      llmFamiliarity: demographicData.llmFamiliarity,
      llmUsage: demographicData.llmUsage,
      llmReason: demographicData.llmReason,
      createdAt: new Date().toISOString(),
    },
  };

  try {
    await documentClient.send(new PutCommand(params));
    console.log("Demographic data written to the database");
    res.status(200).send("Demographic data written successfully");
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send("Error writing demographic data to the database");
  }
});

module.exports = router;
