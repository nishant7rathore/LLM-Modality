# WebApp for a LLM Study
 
 A full stack web app platform for studying user interactions with large language models (LLMs) and generative AI, focusing on user experience, authorship perception, and cognitive load.
 
 ## Overview
 
 This platform provides a comprehensive environment for conducting human-computer interaction research with generative AI systems. It supports both text and image generation tasks, collects survey data, and measures various aspects of user experience including perceived authorship, cognitive load, and user preferences.
 
 ## Stack
 
 - **Frontend**: React, TypeScript, Framer Motion, Tailwind CSS
 - **Backend**: Node.js, Express
 - **Database**: AWS DynamoDB, AWS S3
 - **API Integrations**: OpenAI (for text generation), DALL-E (for image generation)
 - **Hosting**: Render (backend), Vercel (frontend)
 
 ## Getting Started
 
 ### Prerequisites
 
 - Node.js
 - npm or yarn
 - **AWS**:
     - IAM user with AmazonS3FullAccess, AmazonDynamoDBFullAccess, IAMReadOnlyAccess (optional)
     - S3 bucket settings - Uncheck "Block public and cross-account access to buckets and objects through any public bucket or access point policies"
     - Also, make sure the S3 bucket policy is set correctly under the permission tab:
       ``` {
         "Version": "2012-10-17",
         "Statement": [
             {
                 "Sid": "PublicReadGetObject",
                 "Effect": "Allow",
                 "Principal": "*",
                 "Action": "s3:GetObject",
                 "Resource": "arn:aws:s3:::llm-modaility-images-mbmcb88xutrm8gdu/*"
             }
         ]
     } ```
     - DynamoDB - Check the database schema below. Also, add an OrderCount Item with an attribute 'orderval' set to 0 for init.
 
 ### Environment Setup
 
 Create a `.env` file in the root directory with the following variables:
 - PORT
 - OPENAI_API_KEY
 - JWT_SECRET
 - AWS_ACCESS_KEY_ID
 - AWS_SECRET_ACCESS_KEY
 - AWS_REGION
 - S3_BUCKET_NAME
 - DDB_TABLE_NAME
 - REACT_APP_BACKEND_HOST_URL (this is for frontend)
 
 
 ### Installation
 
 1. Clone the repository:
   ```bash
    git clone https://github.com/yourusername/llm-study.git
    cd llm-study
   ```
 2. Install dependencies:
   ```bash
   npm install
   ```
 3. Start the development server:
   ```bash
   npm start
   ```
 4. Start the backend server:
   ```bash
   cd server
   npm install
   npm start
   ```
 
 ### Database Schema for DynamoDB
 - Primary Key: userID (S)
 - Sort Key: questionID (S)
 - Attributes:
     - prompt: User's input prompt
     - response: AI-generated response
     - surveyAnswers: Object containing Likert scale, NASA TLX, and text responses
     - createdAt: Date.Now()
 
 ## Project Structure
 ``` 
 llm-study/
 ├── src/
 │   ├── components/          # Reusable UI components
 │   │   ├── displayFrame.tsx # Displays AI responses with animations
 │   │   ├── inputPrompt.tsx  # User input interface for prompts
 │   │   └── questionFrame.tsx # Question display component
 │   ├── routes/              # Application pages
 │   │   ├── homePage.tsx     # Entry point with Prolific ID collection
 │   │   ├── instructionsPage.tsx # Study instructions
 │   │   ├── questionPage.tsx # Main interaction page for prompt/response
 │   │   ├── surveyPage.tsx   # Survey collection after each task
 │   │   └── endPage.tsx      # Study completion page
 │   ├── hooks/               # Custom React hooks
 │   │   ├── preventNavigation.ts # Prevents accidental navigation
 │   │   └── sendStudyData.ts # Handles data submission to backend
 │   └── App.tsx              # Main application component with routing
 |
 ├── server/                  # Backend server code
 │   ├── routes/              # API routes
 │   │   └── start.js         # Handles study session initialization
 |   |   └── questions.js     # Setup question order and content
 |   |   └── dalle.js         # Handles image generation and S3 bucket puts
 |   |   └── db.js            # Writes to DynamoDB
 |   |   └── text.js          # Handles text generation
 │   ├── util/                # Utility functions
 │   |   └── jwt.js           # Authentication utilities
 │   ├── middleware/          # Helper functions
 │   |   └── auth.js          # Authentication helpers
 │   └── server.js            # Main server base  
 |
 └── public/                  # Static assets
 ```
 
 ## License
 
 This project is licensed under the MIT License I guess lol!
