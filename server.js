import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// cho phép gọi từ Ladipage và GitHub Pages
app.use(cors({ origin: "*" }));
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

    // kiểm tra API key
    if (!process.env.OPENROUTER_API_KEY) {
      console.error("❌ OPENROUTER_API_KEY is missing");
      return res.status(500).json({
        error: { message: "Server missing API key" }
      });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          // model free thường hoạt động
          model: "openrouter/cinematika-7b:free",
          messages: [
            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();

    // log để debug trên Render
    console.log("OpenRouter response:", JSON.stringify(data, null, 2));

    // nếu OpenRouter trả lỗi → trả lỗi ra frontend
    if (data.error) {
      return res.status(400).json(data);
    }

    res.json(data);

  } catch (err) {
    console.error("Server crashed:", err);
    res.status(500).json({
      error: { message: "Server crashed" }
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port", process.env.PORT || 3000);
});
