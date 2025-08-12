import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/chat", async (req, res) => {
  const { prompt } = req.body;
  try {
    const ollamaRes = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "deepseek-r1", prompt, stream: false })
    });
    const data = await ollamaRes.json();
    res.json({ response: data.response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al conectar con Ollama" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
