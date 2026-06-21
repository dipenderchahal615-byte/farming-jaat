import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { detectLanguage, getResponseCategory, getAdvancedChatGPTResponse } from "./server_fallback_data";

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

  // Helper to stream Groq response silently as fallback or directly if Gemini isn't configured
  async function streamGroq(messages: any[], systemPrompt: string, res: any) {
    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      throw new Error("Missing both Gemini and Groq API keys.");
    }

    // Format system instruction and context chat messages for Groq compatibility
    const groqMessages = [
      { role: "system", content: systemPrompt || "You are a warm, helpful Agriculture AI Specialist called Kisan Mitra." }
    ];

    messages.forEach((m: any) => {
      const role = m.sender === "user" ? "user" : "assistant";
      if (m.image) {
        groqMessages.push({
          role,
          content: [
            { type: "text", text: m.text || "" },
            {
              type: "image_url",
              image_url: {
                url: m.image
              }
            }
          ] as any
        });
      } else {
        groqMessages.push({
          role,
          content: m.text || ""
        });
      }
    });

    const hasAttachedImage = messages.some((m: any) => m.image);
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqKey}`
      },
      body: JSON.stringify({
        model: hasAttachedImage ? "llama-3.2-11b-vision-preview" : "llama-3.3-70b-versatile",
        messages: groqMessages,
        temperature: 0.7,
        stream: true
      })
    });

    if (!groqResponse.ok) {
      const bodyErr = await groqResponse.text();
      throw new Error(`Groq API Error: ${groqResponse.statusText} (${bodyErr})`);
    }

    const groqReader = groqResponse.body;
    if (!groqReader) {
      throw new Error("No response stream fetched from Groq service.");
    }

    const decoder = new TextDecoder();
    for await (const chunk of groqReader as any) {
      const chunkStr = decoder.decode(chunk);
      const lines = chunkStr.split("\n");
      for (const line of lines) {
        const cleaned = line.trim();
        if (cleaned.startsWith("data: ")) {
          const dataVal = cleaned.slice(6).trim();
          if (dataVal === "[DONE]") {
            continue;
          }
          try {
            const parsed = JSON.parse(dataVal);
            const contentText = parsed.choices?.[0]?.delta?.content;
            if (contentText) {
              res.write(`data: ${JSON.stringify({ text: contentText, engine: "Meta Llama (via Groq API)" })}\n\n`);
            }
          } catch (e) {
            // Fragmented chunks ignored
          }
        }
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  }

  // Stream an advanced local diagnostic report as ultimate fallback to never throw errors
  async function streamStaticFallbackText(messages: any[], systemPrompt: string, res: any) {
    const lastUserMessage = [...messages].reverse().find((m: any) => m.sender === "user");
    let queryText = lastUserMessage ? lastUserMessage.text || "" : "";
    
    // Check if there is an image in any of the messages of this conversation
    const hasImage = messages.some((m: any) => m.image);
    
    // Context scanning: if current message has empty text (e.g. image-only upload),
    // find the most recent user text message to resolve the target crop/disease context.
    if (!queryText || queryText.trim() === "") {
      const precedingTextMsg = [...messages].reverse().find((m: any) => m.sender === "user" && m.text && m.text.trim() !== "");
      if (precedingTextMsg) {
        queryText = precedingTextMsg.text;
      }
    }
    
    const lang = detectLanguage(queryText, systemPrompt);
    const category = getResponseCategory(queryText);
    const text = getAdvancedChatGPTResponse(queryText, category, lang, hasImage);

    // Stream word-by-word with natural delays to behave like live ChatGPT
    const words = text.split(" ");
    let chunkBuffer = "";
    
    for (let i = 0; i < words.length; i++) {
      chunkBuffer += words[i] + " ";
      if (i % 3 === 0 || i === words.length - 1) {
        res.write(`data: ${JSON.stringify({ text: chunkBuffer, engine: "Kisan Mitra Offline Database" })}\n\n`);
        chunkBuffer = "";
        await new Promise((resolve) => setTimeout(resolve, 8)); // fast streaming
      }
    }
    
    res.write("data: [DONE]\n\n");
    res.end();
  }

  // Stream farming AI diagnostic details
  app.post("/api/chat", async (req, res) => {
    // Standard SSE configuration
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
      const { messages, systemPrompt } = req.body;
      if (!messages || !Array.isArray(messages)) {
        const errMsg = JSON.stringify({ error: "Invalid messages format in input" });
        res.write(`data: ${errMsg}\n\n`);
        res.end();
        return;
      }

      let hasStartedStreaming = false;

      if (ai) {
        try {
          // Map history to Gemini's expected role structure and merge consecutive same-role messages
          const contents: any[] = [];
          const totalMsgs = messages.length;
          messages.forEach((m: any, idx: number) => {
            const role = m.sender === "user" ? "user" : "model";
            const parts: any[] = [];
            
            // Only send the base64 image data if it is in the latest user messages (idx >= totalMsgs - 2)
            // to prevent huge token accumulation and 429 quota/payload size errors.
            const isRecentTurn = (idx >= totalMsgs - 2);
            
            if (m.image) {
              if (isRecentTurn) {
                if (m.image.startsWith("data:")) {
                  const commaIndex = m.image.indexOf(",");
                  if (commaIndex !== -1) {
                    const header = m.image.substring(0, commaIndex);
                    const dataRaw = m.image.substring(commaIndex + 1);
                    const mimeMatch = header.match(/data:([^;]+);base64/);
                    const mimeType = mimeMatch ? mimeMatch[1] : m.imageType === "video" ? "video/mp4" : "image/jpeg";
                    parts.push({
                      inlineData: {
                        mimeType,
                        data: dataRaw
                      }
                    });
                  }
                } else {
                  parts.push({
                    inlineData: {
                      mimeType: m.imageType === "video" ? "video/mp4" : "image/jpeg",
                      data: m.image
                    }
                  });
                }
              } else {
                // For historical messages, we replace the heavy stream with a text placeholder to preserve context smoothly
                parts.push({ text: `[Attached ${m.imageType === "video" ? "video" : "image"}]` });
              }
            }
            
            if (m.text) {
              parts.push({ text: m.text });
            } else if (parts.length === 0) {
              parts.push({ text: "" }); // safety fallback
            }

            if (contents.length > 0 && contents[contents.length - 1].role === role) {
              contents[contents.length - 1].parts.push(...parts);
            } else {
              contents.push({
                role,
                parts
              });
            }
          });

          // Ensure first turn starts as user
          while (contents.length > 0 && contents[0].role !== "user") {
            contents.shift();
          }

          if (contents.length === 0) {
            throw new Error("Empty conversation history");
          }

          // List of configurations to try in sequence to ensure max robustness & survive quota/429 errors
          const configOptions = [
            { model: "gemini-3.5-flash", useSearch: true, displayName: "Google Gemini 3.5 Flash (Search)" },
            { model: "gemini-3.5-flash", useSearch: false, displayName: "Google Gemini 3.5 Flash" },
            { model: "gemini-3.1-flash-lite", useSearch: false, displayName: "Google Gemini 3.1 Flash Lite" }
          ];

          let responseStream: any = null;
          let activeConfig: any = null;
          let encounteredQuotaLimit = false;
          let firstChunk: any = null;
          let streamIterator: any = null;

          for (let i = 0; i < configOptions.length; i++) {
            const opt = configOptions[i];
            
            // If we previously hit a quota/rate limit, skip trying Search or heavy options to save latency and avoid unnecessary errors.
            if (encounteredQuotaLimit && opt.useSearch) {
              console.log(`Skipping model option due to active quota limits: ${opt.model} with Search`);
              continue;
            }

            try {
              console.log(`Trying Gemini model Option ${i + 1}/${configOptions.length}: ${opt.model} (Grounding Search: ${opt.useSearch || false})...`);
              
              const tools = opt.useSearch ? [{ googleSearch: {} }] : undefined;
              
              const stream = await ai.models.generateContentStream({
                model: opt.model,
                contents,
                config: {
                  systemInstruction: systemPrompt || "You are an expert Agriculture AI Assistant.",
                  temperature: 0.7,
                  tools
                }
              });

              // Pre-fetch the first chunk to verify the stream handshake is successful (tests API key, privileges, and tools support)
              const iterator = stream[Symbol.asyncIterator]();
              const firstVal = await iterator.next();
              
              // Handshake succeeded! Store verified iterator and first chunk
              responseStream = stream;
              streamIterator = iterator;
              firstChunk = firstVal;
              activeConfig = opt;
              console.log(`✅ Success! Stream initiated & pre-fetch handshake validated for model: ${opt.model}`);
              break;
            } catch (err: any) {
              const errMsg = String(err?.message || err);
              const isQuotaError = errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("exhausted") || errMsg.includes("rate limit");
              
              if (isQuotaError) {
                encounteredQuotaLimit = true;
                console.warn(`⚠️ Resource/Quota limit hit on ${opt.model}. Adapting configuration on the fly...`);
              } else {
                console.warn(`⚠️ Option ${i + 1} (${opt.model}) failed handshake:`, errMsg);
              }

              if (i === configOptions.length - 1) {
                throw err; // All Gemini configurations failed, fall back to Groq/local
              }
            }
          }

          let latestGroundingSources: any[] = [];
          
          // Emit the pre-fetched first chunk if it is valid
          if (firstChunk && !firstChunk.done) {
            const chunk = firstChunk.value;
            const text = chunk.text;
            const metadata = chunk.candidates?.[0]?.groundingMetadata;
            if (metadata && metadata.groundingChunks) {
              latestGroundingSources = metadata.groundingChunks.map((c: any) => ({
                uri: c.web?.uri || c.maps?.uri,
                title: c.web?.title || c.maps?.title || "Search Reference"
              })).filter((item: any) => item.uri);
            }

            if (text || latestGroundingSources.length > 0) {
              res.write(`data: ${JSON.stringify({ 
                text: text || "", 
                engine: activeConfig ? activeConfig.displayName : "Google Gemini API",
                groundingSources: latestGroundingSources.length > 0 ? latestGroundingSources : undefined 
              })}\n\n`);
              hasStartedStreaming = true;
            }
          }

          // Continue iterating on the remaining chunks of the validated iterator
          if (streamIterator) {
            let nextVal = await streamIterator.next();
            while (!nextVal.done) {
              const chunk = nextVal.value;
              const text = chunk.text;
              const metadata = chunk.candidates?.[0]?.groundingMetadata;
              if (metadata && metadata.groundingChunks) {
                latestGroundingSources = metadata.groundingChunks.map((c: any) => ({
                  uri: c.web?.uri || c.maps?.uri,
                  title: c.web?.title || c.maps?.title || "Search Reference"
                })).filter((item: any) => item.uri);
              }

              if (text || latestGroundingSources.length > 0) {
                res.write(`data: ${JSON.stringify({ 
                  text: text || "", 
                  engine: activeConfig ? activeConfig.displayName : "Google Gemini API",
                  groundingSources: latestGroundingSources.length > 0 ? latestGroundingSources : undefined 
                })}\n\n`);
                hasStartedStreaming = true;
              }
              nextVal = await streamIterator.next();
            }
          }
          
          res.write("data: [DONE]\n\n");
          res.end();
        } catch (geminiErr: any) {
          console.warn("⚠️ Gemini service quota exceeded or connection failure. Delegating to Groq/local fallback...", geminiErr);
          
          if (!hasStartedStreaming) {
            if (process.env.GROQ_API_KEY) {
              try {
                console.log("👉 Performing seamless fallback to ultra-fast Groq Llama AI engine...");
                await streamGroq(messages, systemPrompt, res);
                return;
              } catch (groqErr) {
                console.warn("⚠️ Groq also failed. Using ultra-stable local expert diagnostic brain...", groqErr);
                await streamStaticFallbackText(messages, systemPrompt, res);
                return;
              }
            } else {
              console.log("👉 Performing seamless fallback to ultra-stable local expert diagnostic brain...");
              await streamStaticFallbackText(messages, systemPrompt, res);
              return;
            }
          } else {
            throw geminiErr; // propagate to general catch handler
          }
        }
      } else {
        // No Gemini key configured. Directly route via Groq or Local Static fallback
        if (process.env.GROQ_API_KEY) {
          try {
            console.log("👉 Gemini client unconfigured. Directly routing via Groq Llama AI engine...");
            await streamGroq(messages, systemPrompt, res);
            return;
          } catch (groqErr) {
            console.log("👉 Groq failed. Routing to local expert diagnostic brain...");
            await streamStaticFallbackText(messages, systemPrompt, res);
            return;
          }
        } else {
          console.log("👉 No keys set. Routing seamlessly to local expert diagnostic brain...");
          await streamStaticFallbackText(messages, systemPrompt, res);
          return;
        }
      }
    } catch (error: any) {
      console.error("Express Gemini / fallback chat route outer error:", error);
      // Fallback is also triggered if there's any initial parsing/initialization error
      try {
        if (!res.headersSent) {
          console.log("👉 Encountered early route exception. Attempting outer local expert backup stream...");
          await streamStaticFallbackText(req.body?.messages || [], req.body?.systemPrompt || "", res);
        } else {
          console.warn("⚠️ Stream failed/interrupted mid-execution. Writing graceful error chunk and ending.");
          res.write(`data: ${JSON.stringify({ error: "Diagnostic service was temporarily interrupted: " + (error?.message || "connection reset.") })}\n\n`);
          res.write("data: [DONE]\n\n");
          res.end();
        }
      } catch (innerErr) {
        try {
          let rawMsg = error?.message || String(error);
          const errMsg = JSON.stringify({ error: rawMsg });
          res.write(`data: ${errMsg}\n\n`);
          res.end();
        } catch (e) {
          // Socket already closed, suppress secondary error
        }
      }
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
