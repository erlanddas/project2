// server_twilio.js - Twilio Voice webhook example (uses the same LLM+TTS flow)
// This example expects your /speak endpoint to exist and return audio when POSTed text.
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { xml2js, js2xml } from "xml-js"; // note: xml-js is not strictly required; we can build TwiML manually

dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: true })); // Twilio sends form-encoded requests
app.use(express.json());

// Twilio will POST to this webhook when a call is answered.
// For demo: assume the caller's speech is transcribed elsewhere and we have a 'text' to speak.
app.post("/twilio-webhook", async (req, res) => {
  try {
    // Example: get text from query or generate server-side
    const userText = req.body.SpeechResult || "Sveiki, čia automatizuotas asistentas.";

    // Call your local /speak to produce audio buffer, then host it where Twilio can access (S3 or public URL)
    const speakResp = await fetch(process.env.PUBLIC_SPEAK_ENDPOINT || `http://localhost:${process.env.PORT||3000}/speak`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: userText })
    });

    // For Twilio, it's easiest to provide a public URL to an mp3. This example assumes you have an endpoint that can serve the generated file.
    // As a minimal demo, respond with TwiML that uses <Say> (Twilio TTS) as fallback.
    const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Say language="lt-LT">${userText}</Say></Response>`;
    res.type('text/xml');
    res.send(twiml);
  } catch (err) {
    console.error(err);
    const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Say language="lt-LT">Atsiprašome, įvyko klaida.</Say></Response>`;
    res.type('text/xml');
    res.send(twiml);
  }
});

const PORT = process.env.TWILIO_PORT || 4000;
app.listen(PORT, () => console.log(`Twilio webhook listening on :${PORT}`));
