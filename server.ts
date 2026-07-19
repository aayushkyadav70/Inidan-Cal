import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Initialize GoogleGenAI SDK with environment variable and User-Agent telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Definition of the Response Schema for Sentiment Analysis
const sentimentResponseSchema = {
  type: Type.OBJECT,
  properties: {
    sentiment: {
      type: Type.STRING,
      description: "Overall sentiment of the text. Must be one of: 'Positive', 'Negative', 'Neutral', 'Mixed', 'Sarcastic'."
    },
    score: {
      type: Type.NUMBER,
      description: "Numeric sentiment score from -1.0 (extremely negative) to +1.0 (extremely positive)."
    },
    confidence: {
      type: Type.NUMBER,
      description: "Confidence level of this assessment from 0.0 to 1.0."
    },
    emotions: {
      type: Type.OBJECT,
      description: "Percentage breakdown (0 to 100) of key emotional indicators present in the text.",
      properties: {
        joy: { type: Type.INTEGER, description: "Degree of joy/happiness (0-100)" },
        anger: { type: Type.INTEGER, description: "Degree of anger/frustration (0-100)" },
        sadness: { type: Type.INTEGER, description: "Degree of sadness/disappointment (0-100)" },
        fear: { type: Type.INTEGER, description: "Degree of fear/anxiety (0-100)" },
        surprise: { type: Type.INTEGER, description: "Degree of surprise/wonder (0-100)" },
        anticipation: { type: Type.INTEGER, description: "Degree of anticipation/excitement (0-100)" }
      },
      required: ["joy", "anger", "sadness", "fear", "surprise", "anticipation"]
    },
    keyPhrases: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          phrase: { type: Type.STRING, description: "The extracted key phrase." },
          tone: { type: Type.STRING, description: "The tone of this specific phrase ('Positive', 'Negative', 'Neutral')." }
        },
        required: ["phrase", "tone"]
      },
      description: "List of key phrases from the text and their specific tones."
    },
    reasoning: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A bulleted list of 2-4 insightful explanations of why the model assigned this sentiment and emotion breakdown."
    },
    sarcasmDetected: {
      type: Type.BOOLEAN,
      description: "True if any sarcastic, ironic, or double-meaning tone was detected in the text."
    }
  },
  required: ["sentiment", "score", "confidence", "emotions", "keyPhrases", "reasoning", "sarcasmDetected"]
};

// API Endpoint for Sentiment Analysis
app.post("/api/analyze", async (req, res) => {
  const { text, models, temperature } = req.body;

  if (!text || typeof text !== "string" || text.trim() === "") {
    return res.status(400).json({ error: "Text field is required and must be a valid string." });
  }

  if (!models || !Array.isArray(models) || models.length === 0) {
    return res.status(400).json({ error: "At least one model must be specified in the 'models' array." });
  }

  // Define allowed models list to prevent unauthorized access or deprecated models
  const allowedModels = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-3.1-pro-preview"];
  const selectedModels = models.filter(m => allowedModels.includes(m));

  if (selectedModels.length === 0) {
    return res.status(400).json({ error: "None of the specified models are supported. Allowed: " + allowedModels.join(", ") });
  }

  // Check if GEMINI_API_KEY is available
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ 
      error: "GEMINI_API_KEY environment variable is not configured. Please define it in your Secrets settings." 
    });
  }

  const results: Record<string, any> = {};

  // Analyze text for each model in parallel
  await Promise.all(selectedModels.map(async (model) => {
    const startTime = Date.now();
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: `Analyze the sentiment, emotions, key phrases, and tonal quality of the following text:

"${text}"`,
        config: {
          systemInstruction: "You are a professional computational linguist and sentiment analysis expert. Analyze the provided text objectively, extracting the structural emotional weights, key phrases with individual tones, and logical justifications for your conclusions. If sarcasm or irony is present, make sure to mark sarcasmDetected as true and evaluate the underlying emotional sentiment.",
          temperature: typeof temperature === "number" ? temperature : 0.2,
          responseMimeType: "application/json",
          responseSchema: sentimentResponseSchema,
        }
      });

      const durationMs = Date.now() - startTime;
      const textOutput = response.text;

      if (!textOutput) {
        throw new Error("No output received from the model.");
      }

      const data = JSON.parse(textOutput.trim());
      results[model] = {
        success: true,
        data,
        durationMs
      };
    } catch (err: any) {
      const durationMs = Date.now() - startTime;
      
      // Categorize errors cleanly
      let errMsg = err.message || "An error occurred during sentiment analysis.";
      if (model === "gemini-3.1-pro-preview" && errMsg.includes("paid")) {
        errMsg = "This model requires a paid API key or paid model flow activation. Please select the appropriate workflow in AI Studio.";
      }

      results[model] = {
        success: false,
        error: errMsg,
        durationMs
      };
    }
  }));

  res.json({ results });
});

// Definition of the Response Schema for Calorie Tracker Food Analysis
const foodResponseSchema = {
  type: Type.OBJECT,
  properties: {
    dish_name: { 
      type: Type.STRING, 
      description: "Name of the dish or meal. (e.g. 'Dal Makhani & Roti')" 
    },
    serving_estimate: { 
      type: Type.STRING, 
      description: "Estimated portion size or serving description. (e.g. '1 cup curry and 2 medium rotis')" 
    },
    calories: { 
      type: Type.NUMBER, 
      description: "Estimated total calories in kcal." 
    },
    protein_g: { 
      type: Type.NUMBER, 
      description: "Estimated protein in grams." 
    },
    carbs_g: { 
      type: Type.NUMBER, 
      description: "Estimated carbohydrate in grams." 
    },
    fat_g: { 
      type: Type.NUMBER, 
      description: "Estimated fat in grams." 
    },
    confidence: { 
      type: Type.STRING, 
      description: "Confidence level of prediction. Must be one of: 'high', 'medium', 'low'." 
    },
    notes: { 
      type: Type.STRING, 
      description: "One or two sentences detailing key assumptions, like oil/ghee amount, gravy type, hidden butter/cream, etc." 
    }
  },
  required: ["dish_name", "serving_estimate", "calories", "protein_g", "carbs_g", "fat_g", "confidence", "notes"]
};

// API Endpoint for Calorie Tracker Food Analysis
app.post("/api/analyze-food", async (req, res) => {
  const { text, image } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ 
      error: "GEMINI_API_KEY environment variable is not configured. Please define it in your Secrets settings." 
    });
  }

  try {
    const parts: any[] = [];

    if (image && typeof image === "object" && image.data) {
      parts.push({
        inlineData: {
          mimeType: image.mimeType || "image/jpeg",
          data: image.data // base64 string
        }
      });
    }

    const baseSystemPrompt = `You are an expert nutrition and calorie estimation assistant specializing in Indian and global foods. 
Your job is to account for EVERYTHING that goes into a dish, including cooking oil or ghee, butter, cream, sugar, gravy type, and portion sizes.
If no gravy/oil detail is provided, assume standard realistic amounts for commercial or authentic home cooking. Be precise, fair, and comprehensive.`;

    const userPrompt = text ? `User description: "${text}"` : `Identify the dish on this plate and estimate its serving size, calories, protein, carbs, and fat. If multiple items are visible, estimate the aggregate totals for the plate.`;

    parts.push({
      text: `${baseSystemPrompt}\n\n${userPrompt}\n\nAnalyze and provide a structured JSON response following the strict responseSchema format.`
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts },
      config: {
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: foodResponseSchema
      }
    });

    const output = response.text;
    if (!output) {
      throw new Error("No response received from the Gemini model.");
    }

    const parsedData = JSON.parse(output.trim());
    return res.json(parsedData);
  } catch (err: any) {
    console.error("Calorie API Error:", err);
    return res.status(500).json({ 
      error: err.message || "An error occurred while analyzing the food. Please try again." 
    });
  }
});

// Definition of Response Schema for Meal Suggestions
const mealSuggestionResponseSchema = {
  type: Type.OBJECT,
  properties: {
    suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          meal_name: { type: Type.STRING, description: "Name of the Indian meal/dish" },
          portion: { type: Type.STRING, description: "Detailed serving portion size or combination" },
          calories: { type: Type.NUMBER, description: "Calories of this serving (kcal)" },
          protein_g: { type: Type.NUMBER, description: "Protein content in grams" },
          carbs_g: { type: Type.NUMBER, description: "Carbohydrate content in grams" },
          fat_g: { type: Type.NUMBER, description: "Fat content in grams" },
          why_fits: { type: Type.STRING, description: "Explanatory sentence detailing why it fits the remaining targets, high protein for gym persons if applicable." },
          trend_label: { type: Type.STRING, description: "A short, catchy, modern fitness label with emojis appealing to boys & girls (e.g., '💪 Gym Bro OG Power', '✨ Aesthetic Glow & Lean', '🍳 Quick Egg Charge', '🥛 Desi Protein Shield', '🌱 Pure Veg Glow-up')" }
        },
        required: ["meal_name", "portion", "calories", "protein_g", "carbs_g", "fat_g", "why_fits", "trend_label"]
      }
    }
  },
  required: ["suggestions"]
};

// API Endpoint for Indian Meal Suggestions based on remaining macros
app.post("/api/suggest-meals", async (req, res) => {
  const { remainingCalories, remainingProtein, remainingCarbs, remainingFat, goal, activity, isGymPerson, isVegOnly } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ 
      error: "GEMINI_API_KEY environment variable is not configured. Please define it in your Secrets settings." 
    });
  }

  try {
    const systemPrompt = `You are an expert Indian fitness nutritionist, personal trainer and meal advisor. Your task is to recommend 3 specific, healthy Indian meal options that help the user hit their remaining macro-nutrient targets for the day. 
The user is aiming to ${goal || "maintain"} weight, with an activity level of "${activity || "moderately active"}" and isGymPerson: ${isGymPerson ? "Yes" : "No"}.
Dietary preference: ${isVegOnly ? "Strict Vegetarian (Pure Veg - NO eggs, NO meat, but dairy like Paneer, Milk, Curd are allowed)" : "All (Vegetarian + Eggitarian + Non-Vegetarian allowed)"}.

Mandatory Rules:
1. Since the user loves simple daily staples, if they are not strictly vegetarian (isVegOnly is false), make sure at least 1-2 suggestions explicitly include Eggs (e.g. Boiled Eggs, Egg Bhurji, Egg White Omelette) or a Glass of Milk (e.g. double toned milk, turmeric golden milk, cold skimmed milk) which are great, authentic fitness staples. If they are Vegetarian (isVegOnly is true), recommend dairy-based protein options like a Glass of Milk (with almond/turmeric or simple high protein skimmed milk), Paneer Bhurji, Sattu drink, Curd, or Roasted Chana.
2. Focus purely on realistic, tasty Indian dishes that regular Indian fitness lovers eat (e.g., Dal Khichdi, Besan Chilla, Soya chunks stir-fry, Paneer tikka, grilled chicken, sprouts salad, etc.).
3. Assign a highly appealing and trendy "trend_label" with emojis to make the suggestion look fun, aesthetic, and motivational for both boys and girls (e.g., '💪 Gym Bro Muscle Fuel', '✨ Aesthetic Glow & Lean', '🍳 Quick Egg Charge', '🥛 Desi Protein Shield', '🌱 Pure Veg Champion').
4. Include precise portion sizes and explain in "why_fits" how it satisfies their current remaining goals. Keep descriptions engaging and cool!`;

    const userPrompt = `Remaining Targets Today:
- Calories: ${remainingCalories} kcal
- Protein: ${remainingProtein}g
- Carbs: ${remainingCarbs}g
- Fat: ${remainingFat}g

Please output 3 highly curated Indian options that fit perfectly. If any macro is negative (overbudget), recommend options that are extremely low/near zero in that macro.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `${systemPrompt}\n\n${userPrompt}`,
      config: {
        temperature: 0.3,
        responseMimeType: "application/json",
        responseSchema: mealSuggestionResponseSchema
      }
    });

    const output = response.text;
    if (!output) {
      throw new Error("No response received from the Gemini model.");
    }

    const parsedData = JSON.parse(output.trim());
    return res.json(parsedData);
  } catch (err: any) {
    console.error("Meal Suggestions API Error:", err);
    return res.status(500).json({ 
      error: err.message || "An error occurred while generating meal suggestions. Please try again." 
    });
  }
});

// API Endpoint for Lyria-3-clip-preview Workout Beats Generation
app.post("/api/generate-workout-music", async (req, res) => {
  const { prompt } = req.body;
  const userPrompt = prompt || "Generate a high-energy, fast-paced Indian gym workout beat with heavy Punjabi dhol, modern trap bass, and energetic fitness vibes.";

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ 
      error: "GEMINI_API_KEY environment variable is not configured." 
    });
  }

  try {
    console.log("Requesting Lyria Clip music generation for prompt:", userPrompt);
    const responseStream = await ai.models.generateContentStream({
      model: "lyria-3-clip-preview",
      contents: userPrompt,
    });

    let audioBase64 = "";
    let lyrics = "";
    let mimeType = "audio/wav";

    for await (const chunk of responseStream) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;

      for (const part of parts) {
        if (part.inlineData?.data) {
          if (!audioBase64 && part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          audioBase64 += part.inlineData.data;
        }
        if (part.text && !lyrics) {
          lyrics = part.text;
        }
      }
    }

    if (!audioBase64) {
      throw new Error("No audio data returned by Lyria.");
    }

    return res.json({
      audioBase64,
      mimeType,
      lyrics: lyrics || "💪 Burn Fat, Build Muscle! Desi Gym Beats!",
      fallback: false
    });

  } catch (err: any) {
    console.warn("Lyria generation failed or requires paid tier. Serving ultra-hype fallback gym loops:", err.message);
    
    // Choose a high-quality fallback track based on prompt keywords
    let fallbackUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; // generic high-energy EDM
    let title = "Desi Gym Bass Hype (Power Beat)";
    let lyrics = "💪 [ENERGY BURST] Crushing standard macros! Lift heavy, eat clean, look aesthetic!";

    const lowerPrompt = userPrompt.toLowerCase();
    if (lowerPrompt.includes("yoga") || lowerPrompt.includes("meditat") || lowerPrompt.includes("peace") || lowerPrompt.includes("slow")) {
      fallbackUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"; // slow melodic ambient chill
      title = "Himalayan Flow Yoga Vibe (Ambient Flute)";
      lyrics = "🧘 [ZEN MODE] Inhale peace, exhale calories. Balance your body, mind, and spirit.";
    } else if (lowerPrompt.includes("girl") || lowerPrompt.includes("aesthetic") || lowerPrompt.includes("glow")) {
      fallbackUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"; // upbeat progressive house
      title = "Aesthetic Synthwave Glow (Lofi Lean Beats)";
      lyrics = "✨ [GLOW UP] Elegant strides, healthy meals. Building that clean aesthetic daily!";
    }

    return res.json({
      fallback: true,
      fallbackUrl,
      title,
      lyrics,
      message: "Paid tier required for real-time Lyria music generation. Playing gorgeous fallback fitness tracks!"
    });
  }
});

// Configure Vite or Serve static files
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

setupVite();
