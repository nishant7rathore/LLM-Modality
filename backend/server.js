const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Basic configuration
const port = process.env.PORT || 5001;
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Route to handle prompt
app.post('/api/prompt', (req, res) => {
    const { prompt } = req.body;
    console.log("Recieved Prompt: ",prompt);

    const response = "ACK! for prompt: " + prompt;
    res.json(response);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

