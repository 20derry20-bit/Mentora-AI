import express from "express";
import cors from "cors";
import { Groq } from "groq-sdk";

const app = express();
app.use(cors());
app.use(express.json({ limit: "25mb" }));

// Inizializza Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Endpoint principale
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ reply: "Nessun messaggio ricevuto." });
    }

    // Chiamata al modello Groq aggiornato
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "Sei Mentora, un assistente AI utile, chiaro e amichevole." },
        { role: "user", content: userMessage }
      ]
    });

    const output = completion.choices?.[0]?.message?.content || "Errore: nessuna risposta dal modello.";

    res.json({ reply: output });

  } catch (err) {
    console.error("Errore Groq:", err);
    res.status(500).json({
      reply: "Errore interno del server."
    });
  }
});

// Avvio server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server attivo sulla porta " + PORT);
});
