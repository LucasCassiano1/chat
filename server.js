require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.static("public"));
app.use(express.json());

app.post("/ask", async (req, res) => {
  const { question } = req.body;
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  try {
    // fetch nativo do Node.js
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + OPENROUTER_API_KEY,
      },
      body: JSON.stringify({
        model: "mistralai/mistral-small-3.2-24b-instruct-2506",
        messages: [
          { role: "system", content: "Você é um assistente útil e criativo." },
          { role: "user", content: question },
        ],
        temperature: 0.5,
        max_tokens: 1024,
      }),
    });

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || "Sem resposta.";
    res.json({ response: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar resposta da IA." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
