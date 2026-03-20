import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

// 🔥 FIX CORS
app.use(cors({
    origin: "*"
}));

app.use(express.json());

// test route
app.get("/", (req, res) => {
    res.send("Server is running 🚀");
});

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "mistralai/mistral-7b-instruct:free",
                messages: [
                    { role: "system", content: "You are a coding tutor." },
                    { role: "user", content: userMessage }
                ]
            })
        });

        const data = await response.json();
        res.json(data);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server error" });
    }
});

// 🔥 PORT FIX
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
