// index.js

// Load our secret keys from the .env file
require('dotenv').config();

// Import the tools we need
const express = require('express');
const bodyParser = require('body-parser');

// Create our web server app
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// This is the endpoint that Twilio will send data to
// It matches the "/process-call" we put in our Studio Flow
app.post('/process-call', (req, res) => {
  console.log('--- A NEW REPORT WAS RECEIVED FROM TWILIO! ---');
  
  // Get the data that Twilio sent us from the request body
  const transcript = req.body.transcript;
  const caller = req.body.caller;

  // Print the data to our terminal to make sure it's working
  console.log('Caller:', caller);
  console.log('Transcript:', transcript);
  
  // Send a success response back to Twilio so it knows we received the data
  res.sendStatus(200);
});

// Start the server and listen for connections on port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running and listening on http://localhost:${port}`);
});
