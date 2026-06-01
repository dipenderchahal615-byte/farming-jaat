import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Initialize Gemini client using the server-side environment key
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey ? new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  }) : null;

  // Stream farming AI diagnostic details
  app.post("/api/chat", async (req, res) => {
    // Standard SSE configuration
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
      if (!ai) {
        const errMsg = JSON.stringify({ error: "Gemini API key is missing. Please configure it in Settings > Secrets." });
        res.write(`data: ${errMsg}\n\n`);
        res.end();
        return;
      }

      const { messages, systemPrompt } = req.body;
      if (!messages || !Array.isArray(messages)) {
        const errMsg = JSON.stringify({ error: "Invalid messages format in input" });
        res.write(`data: ${errMsg}\n\n`);
        res.end();
        return;
      }

      // Map history to Gemini's expected role structure
      const contents = messages.map((m: any) => {
        const parts: any[] = [];
        
        if (m.image) {
          // Extract base64 without prefix: "data:image/jpeg;base64,xxxx"
          const matches = m.image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.*)$/);
          if (matches && matches.length === 3) {
            parts.push({
              inlineData: {
                mimeType: matches[1],
                data: matches[2]
              }
            });
          }
        }
        
        if (m.text) {
          parts.push({ text: m.text });
        } else if (parts.length === 0) {
          parts.push({ text: "" }); // safety fallback
        }

        return {
          role: m.sender === "user" ? "user" : "model",
          parts
        };
      });

      // Launch streaming content generation
      const responseStream = await ai.models.generateContentStream({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction: systemPrompt || "You are an expert Agriculture AI Assistant.",
          temperature: 0.7,
        }
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }
      
      res.write("data: [DONE]\n\n");
      res.end();
    } catch (error: any) {
      console.error("Express Gemini chat route error:", error);
      const errMsg = JSON.stringify({ error: error?.message || "An exception occurred while processing crop diagnostics" });
      res.write(`data: ${errMsg}\n\n`);
      res.end();
    }
  });

  // Setup static serving or Vite middleware depending on the environment
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Farming GPT server running natively on port ${PORT}`);
  });
}

startServer();
