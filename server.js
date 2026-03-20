import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "*"
}));

app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct:free",
          messages: [
            { role: "user", content: message }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("API:", JSON.stringify(data, null, 2));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server crashed" });
  }
});

app.listen(process.env.PORT || 3000);
