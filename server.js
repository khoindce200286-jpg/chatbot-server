import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({
        error: { message: "Server missing API key" }
      });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://khoindce200286-jpg.github.io",
          "X-Title": "My Chatbot"
        },
        body: JSON.stringify({
          model: "google/gemma-2-9b-it:free",
          messages: [
            { role: "user", content: message }
          ]
        })
      }
    );

    const data = await response.json();
    console.log("OpenRouter:", JSON.stringify(data, null, 2));

    if (data.error) {
      return res.status(400).json(data);
    }

    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: { message: "Server crashed" } });
  }
});

app.listen(process.env.PORT || 3000);
