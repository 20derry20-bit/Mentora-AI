import express from "express";
import cors from "cors";
import { Groq } from "groq-sdk";

const app = express();
app.use(cors());
app.use(express.json());

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await client.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      messages: [
        { role: "system", content: "Sei Mentora AI, un assistente utile e chiaro." },
        { role: "user", content: message }
      ]
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("Errore Groq:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

app.listen(3000, () => console.log("Server avviato su porta 3000"));
