// Route to start session
const express = require('express');
const { generateToken } = require('../util/jwt');
const { decodeToken } = require('../util/jwt');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { PutCommand, DynamoDBDocumentClient, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
require('dotenv').config();

// Basic configuration
const router = express.Router();

// Configuration for AWS
const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Create a new DocumentClient
const documentClient = DynamoDBDocumentClient.from(client);

// Order
const ORDERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Function to get the next order
const getNextOrder = async () => {
    let success = false;
    let order = null;

    while (!success) {
        // Retrieve the current order index
        const getParams = {
            TableName: "StudyResponses",
            Key: { 
                userID: "OrderCount",
                questionID: "None"
            },
        };

        const getResult = await documentClient.send(new GetCommand(getParams));
        const currentOrderIndex = getResult.Item ? getResult.Item.orderVal : 0;  // Default to 0 if no item exists

        // Round robin next order
        const newOrderIndex = (currentOrderIndex + 1) % ORDERS.length;
        order = ORDERS[newOrderIndex];

        // Conditional Write - Attempt to update orderIndex
        const putParams = {
            TableName: "StudyResponses",
            Key: { 
                userID: "OrderCount",
                questionID: "None"
            },
            UpdateExpression: "SET orderVal = :order",
            ExpressionAttributeValues: {
                ":order": order,
                ":currentOrderIndex": currentOrderIndex
            },
            ConditionExpression: "orderVal = :currentOrderIndex",  // Only update if orderIndex hasn't changed
        };

        try {
            // write the new order index
            await documentClient.send(new UpdateCommand(putParams));
            success = true;
        } catch (error) {
            if (error.name === 'ConditionalCheckFailedException') {
                console.log("Condition failed, retrying...");
            } else {
                throw error;
            }
        }
    }

    return order;
};

// Route to start session
router.post('/start', async (req, res) => {
    const token = generateToken();
    const decoded = decodeToken(token);
    const userID = decoded.userID;
    const order = await getNextOrder();
    console.log("Order: ", order);
    res.json({ token, userID, order });
});

module.exports = router;