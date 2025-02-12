// Main server file to handle API requests
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Routes
const startRoute = require('./routes/start');
const textRoute = require('./routes/text');
const dalleRoute = require('./routes/dalle');
const dbRoute = require('./routes/db');
const questionRoute = require('./routes/questions');

// Basic configuration
const port = process.env.PORT || 5001;
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Use Routes
app.use('/', startRoute);
app.use('/api', textRoute);
app.use('/api', dalleRoute);
app.use('/api', dbRoute);
app.use('/api', questionRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

