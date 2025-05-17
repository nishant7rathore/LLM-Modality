// Route to start session
const express = require('express');
const { signToken } = require('../util/jwt');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
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
const ORDERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// Function to get the next order
const getNextOrder = async () => {
    let success = false;
    let order = null;

    while (!success) {
        // Retrieve the current order index
        const getParams = {
            TableName: process.env.DDB_TABLE_NAME,
            Key: { 
                userID: "OrderCount",
                questionID: "None"
            },
        };

        const getResult = await documentClient.send(new GetCommand(getParams));
        const currentCounter = getResult.Item ? getResult.Item.orderVal : 0; // Default to 0 if no item exists

        // Get next order using counter
        order = ORDERS[currentCounter % ORDERS.length];
        const nextCounter = (currentCounter + 1);

        // Conditional Write - Attempt to update orderIndex
        const putParams = {
            TableName: process.env.DDB_TABLE_NAME,
            Key: { 
                userID: "OrderCount",
                questionID: "None"
            },
            UpdateExpression: "SET orderVal = :nextCounter",
            ExpressionAttributeValues: {
                ":nextCounter": nextCounter,
                ":currentCounter": currentCounter
            },
            ConditionExpression: "orderVal = :currentCounter",  // Only update if hasn't changed
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
    const { PROLIFIC_PID } = req.body;
    const token = signToken({ PROLIFIC_PID });
    const order = await getNextOrder();
    console.log("Start endpoint logs: ", token, order);
    res.json({ token, order });
});

module.exports = router;