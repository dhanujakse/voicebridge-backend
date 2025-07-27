require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');

const app = express();
const port = process.env.PORT || 3000;

// Initialize Firebase
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Middleware to parse JSON
app.use(express.json());

// Main endpoint for Twilio Studio
app.post('/process-call', async (req, res) => {
  try {
    const { case_type, caller_number, recording_url, language, issue_type } = req.body;

    // Simple classification for demo
    let ngo_target = 'NGO_GENERAL';
    if (issue_type) {
      if (issue_type.toLowerCase().includes('water')) ngo_target = 'NGO_WATER';
      else if (issue_type.toLowerCase().includes('electric')) ngo_target = 'NGO_ELECTRICITY';
    }

    const report = {
      case_type: case_type || 'unknown',
      caller_number: caller_number || 'unknown',
      language: language || 'unknown',
      recording_url: recording_url || null,
      ngo_target: ngo_target,
      received_at: admin.firestore.FieldValue.serverTimestamp()
    };

    console.log('Received report:', report);

    await db.collection('voice_reports').add(report);

    res.status(200).json({ success: true, ngo_target });
  } catch (err) {
    console.error('Error saving report:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Simple home route
app.get('/', (req, res) => {
  res.send('VoiceBridge backend is running.');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
