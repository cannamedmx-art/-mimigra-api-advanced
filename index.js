import express from "express";
import cors from "cors";
import { db } from "./firebaseAdminInit.js";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Ruta para enviar preguntas a la IA
app.post("/ask", async (req, res) => {
  try {
    const { question, userId } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Eres un asistente experto en migración." },
        { role: "user", content: question }
      ]
    });

    const answer = response.choices[0].message.content;

    // Guardar historial en Firestore
    await db.collection("users")
      .doc(userId)
      .collection("history")
      .add({
        question,
        answer,
        timestamp: new Date()
      });

    res.json({ answer });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al procesar." });
  }
});

// Puerto para Vercel
app.listen(3000, () => {
  console.log("API funcionando en puerto 3000");
});

export default app;
