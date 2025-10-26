// server.js (Node + Express) - OpenAI (LLM) -> ElevenLabs (TTS)
// Run: node server.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import crypto from "crypto";

dotenv.config();
const app = express();
app.use(express.json());

// Simple health check
app.get("/", (req, res) => res.send("AI Asistentas (LT) - veikia"));

// Call OpenAI Chat Completions (adjust model/endpoint as needed)
async function callLLM(userText) {
  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [{ role: "user", content: `Atsakyk lietuviškai (mandagus tonas): ${userText}` }],
      max_tokens: 400
    })
  });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`LLM klaida: ${resp.status} ${txt}`);
  }
  const data = await resp.json();
  return data.choices?.[0]?.message?.content ?? "Atsiprašau, įvyko klaida.";
}

// Call ElevenLabs TTS - adapt based on ElevenLabs API docs
async function callTTS(text) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVEN_VOICE_ID}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text })
  });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`TTS klaida: ${resp.status} ${txt}`);
  }
  const arrayBuffer = await resp.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

app.post("/speak", async (req, res) => {
  try {
    const userText = req.body.text || "";
    const replyText = await callLLM(userText);
    const audioBuffer = await callTTS(replyText);

    // Option: save to temp file and return URL or stream back
    const filename = `${crypto.randomUUID()}.mp3`;
    const filepath = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(filepath)) fs.mkdirSync(filepath);
    const full = path.join(filepath, filename);
    fs.writeFileSync(full, audioBuffer);

    // Return as direct audio stream
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(audioBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on :${PORT}`));
