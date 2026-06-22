import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Linguistic Analysis
  app.post("/api/analyze", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text || typeof text !== "string" || text.trim() === "") {
        res.status(400).json({ error: "Text content is required for analysis." });
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        res.status(500).json({ error: "GEMINI_API_KEY environment variable is not configured." });
        return;
      }

      // Initialize the Gemini SDK using the secure pattern
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const promptText = `Analyze the following text string extracted from an unverified online profile or client correspondence. Methodically audit the text structure for universal psychological markers of social engineering, synthetic urgency patterns, high-pressure closes, non-standard compliance requests, or transactional risk.

Target text:
"${text}"`;

      // Define local heuristic analysis as an absolute reliable failover fallback
      const getLocalHeuristicAnalysis = (inputMsg: string) => {
        const lowercase = inputMsg.toLowerCase();
        
        // Risk keywords
        const highRiskWords = [
          "urgent", "immediately", "wire", "transfer", "bank", "password", "crypto", 
          "bitcoin", "gift card", "ssn", "social security", "pin", "verify", "compliance",
          "unauthorized", "suspended", "security breach", "consequences", "avoid legal"
        ];
        const mediumRiskWords = [
          "deal", "offer", "discount", "winner", "congratulations", "invest", "profit",
          "guaranteed", "secret", "private", "hidden"
        ];
        
        const highMatches = highRiskWords.filter(word => lowercase.includes(word));
        const mediumMatches = mediumRiskWords.filter(word => lowercase.includes(word));
        
        let frictionScore = "Low Risk";
        let bulletPoints: string[] = [];
        
        if (highMatches.length >= 2) {
          frictionScore = "High Risk";
          bulletPoints = [
            `Detected critical risks: ${highMatches.slice(0, 2).map(w => `'${w}'`).join(", ")}.`,
            "Syntactic traits resemble severe social engineering or high-urgency compliance triggers."
          ];
        } else if (highMatches.length === 1 || mediumMatches.length >= 2) {
          frictionScore = "Medium Risk";
          bulletPoints = [
            `Caution triggers flagged: ${[...highMatches, ...mediumMatches].slice(0, 2).map(w => `'${w}'`).join(", ")}.`,
            "Non-standard communication styles detected. Manual inspection suggested."
          ];
        } else {
          frictionScore = "Low Risk";
          bulletPoints = [
            "No high-pressure closes or synthetic urgency patterns identified in this text block.",
            "Text parameters structure represents typical conversational low-friction standards."
          ];
        }
        
        return { frictionScore, bulletPoints };
      };

      let response;
      let usedHeuristic = false;

      try {
        // Try Tier 1 model (gemini-3.5-flash)
        response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: promptText,
          config: {
            systemInstruction: "Analyze the following text string extracted from an unverified online profile or client correspondence. Methodically audit the text structure for universal psychological markers of social engineering, synthetic urgency patterns, high-pressure closes, non-standard compliance requests, or transactional risk. Provide your final assessment structured exactly like this: A clean 'frictionScore' rating (Low Risk, Medium Risk, or High Risk) followed by 'bulletPoints' containing exactly 2 short, objective bullet points detailing syntactic warning signs or operational green flags discovered purely within the text layout.",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                frictionScore: {
                  type: Type.STRING,
                  description: "Risk calculation: must be 'Low Risk', 'Medium Risk', or 'High Risk'.",
                },
                bulletPoints: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.STRING,
                  },
                  description: "Exactly 2 short, objective bullet points detailing syntactic warning signs or operational green flags.",
                },
              },
              required: ["frictionScore", "bulletPoints"],
            },
          },
        });
      } catch (err35: any) {
        console.warn("gemini-3.5-flash failed or experienced high demand. Rolling back to gemini-3.1-flash-lite fallback...", err35.message || err35);
        try {
          // Try Tier 2 model (gemini-3.1-flash-lite)
          response = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite",
            contents: promptText,
            config: {
              systemInstruction: "Analyze the following text string extracted from an unverified online profile or client correspondence. Methodically audit the text structure for universal psychological markers of social engineering, synthetic urgency patterns, high-pressure closes, non-standard compliance requests, or transactional risk. Provide your final assessment structured exactly like this: A clean 'frictionScore' rating (Low Risk, Medium Risk, or High Risk) followed by 'bulletPoints' containing exactly 2 short, objective bullet points detailing syntactic warning signs or operational green flags discovered purely within the text layout.",
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  frictionScore: {
                    type: Type.STRING,
                    description: "Risk calculation: must be 'Low Risk', 'Medium Risk', or 'High Risk'.",
                  },
                  bulletPoints: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.STRING,
                    },
                    description: "Exactly 2 short, objective bullet points detailing syntactic warning signs or operational green flags.",
                  },
                },
                required: ["frictionScore", "bulletPoints"],
              },
            },
          });
        } catch (errLite: any) {
          console.error("Both models failed or experienced high demand. Falling back to local heuristic audit...", errLite.message || errLite);
          usedHeuristic = true;
        }
      }

      let parsedJSON;
      if (usedHeuristic) {
        parsedJSON = getLocalHeuristicAnalysis(text);
      } else {
        const rawText = response?.text;
        if (!rawText) {
          throw new Error("Empty response received from the language model.");
        }
        parsedJSON = JSON.parse(rawText.trim());
      }

      res.json(parsedJSON);
    } catch (error: any) {
      console.error("Linguistic analysis API error:", error);
      res.status(500).json({
        error: error.message || "An unexpected error occurred during linguistic audit.",
      });
    }
  });

  // Serve Frontend / Assets with Vite Middleware
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TrustPulse Index server is running on http://localhost:${PORT}`);
  });
}

startServer();
