import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Fallback curated recipes if API key is not yet set or unavailable
function getFallbackRecipes(ingredients: string[]) {
  const ingStr = ingredients.map(i => i.toLowerCase());
  const hasRice = ingStr.some(i => i.includes("rice"));
  const hasEgg = ingStr.some(i => i.includes("egg"));
  const hasPotato = ingStr.some(i => i.includes("potato"));
  const hasTomato = ingStr.some(i => i.includes("tomato"));
  const hasOnion = ingStr.some(i => i.includes("onion"));

  return [
    {
      id: "recipe-1",
      name: hasEgg && hasRice ? "Classic Golden Egg Fried Rice" : "Savory Skillet Fried Rice",
      tagline: "Crispy, aromatic comfort food utilizing everyday pantry staples in under 20 minutes.",
      prepTime: "10 mins",
      cookTime: "10 mins",
      totalTime: "20 mins",
      difficulty: "Easy" as const,
      servings: "2 servings",
      cuisine: "Asian-inspired",
      matchedIngredientsCount: ingredients.length,
      totalIngredientsCount: ingredients.length + 3,
      ingredientsRequired: [
        { name: "Cooked Rice", amount: "2 cups", isUserProvided: hasRice },
        { name: "Eggs", amount: "2 large, beaten", isUserProvided: hasEgg },
        { name: "Onion", amount: "1 small, finely diced", isUserProvided: hasOnion },
        { name: "Cooking Oil", amount: "2 tbsp", isUserProvided: false, notes: "Pantry staple" },
        { name: "Salt & Black Pepper", amount: "To taste", isUserProvided: false, notes: "Pantry staple" },
        { name: "Soy Sauce or Salt", amount: "1 tbsp", isUserProvided: false, notes: "Pantry staple" }
      ],
      instructions: [
        {
          stepNumber: 1,
          instruction: "Heat 1 tbsp of oil in a wide skillet or wok over medium-high heat. If using eggs, pour in beaten eggs and scramble gently until 80% set, then set aside.",
          durationMinutes: 3,
          tip: "Do not overcook the eggs; they will cook more when mixed back in."
        },
        {
          stepNumber: 2,
          instruction: "Add the remaining oil to the pan. Sauté the diced onion until fragrant and translucent.",
          durationMinutes: 3
        },
        {
          stepNumber: 3,
          instruction: "Add cooked rice, breaking up any clumps with a spatula. Fry on high heat, stirring continuously until grains are toasted.",
          durationMinutes: 4,
          tip: "Day-old cold rice creates the best texture with separate grains."
        },
        {
          stepNumber: 4,
          instruction: "Return the eggs to the pan. Season with salt, pepper, and soy sauce. Toss everything together vigorously for 1 minute and serve hot.",
          durationMinutes: 2
        }
      ],
      chefTip: "For extra crunch, let the rice sit undisturbed on high heat for 30 seconds at the end to create a crispy bottom layer."
    },
    {
      id: "recipe-2",
      name: hasPotato && hasEgg ? "Rustic Potato & Egg Frittata" : "Golden Potato Skillet Hash",
      tagline: "Tender sliced potatoes and aromatic vegetables cooked to golden perfection.",
      prepTime: "10 mins",
      cookTime: "15 mins",
      totalTime: "25 mins",
      difficulty: "Easy" as const,
      servings: "2-3 servings",
      cuisine: "Mediterranean",
      matchedIngredientsCount: ingredients.length,
      totalIngredientsCount: ingredients.length + 2,
      ingredientsRequired: [
        { name: "Potatoes", amount: "2 medium, thinly sliced or diced", isUserProvided: hasPotato },
        { name: "Eggs", amount: "3 large", isUserProvided: hasEgg },
        { name: "Onion", amount: "1 medium, sliced", isUserProvided: hasOnion },
        { name: "Olive Oil or Cooking Oil", amount: "2 tbsp", isUserProvided: false },
        { name: "Salt & Ground Pepper", amount: "To taste", isUserProvided: false }
      ],
      instructions: [
        {
          stepNumber: 1,
          instruction: "Peel and slice potatoes thinly into bite-sized rounds or small cubes for quick cooking.",
          durationMinutes: 5
        },
        {
          stepNumber: 2,
          instruction: "Heat oil in an oven-safe or heavy nonstick skillet. Add potatoes and sliced onions, cooking gently until tender and lightly browned.",
          durationMinutes: 10,
          tip: "Covering the pan with a lid for the first 5 minutes helps potatoes steam tender faster."
        },
        {
          stepNumber: 3,
          instruction: "Whisk eggs with a pinch of salt and pepper. Pour evenly over the cooked potatoes and onions in the skillet.",
          durationMinutes: 2
        },
        {
          stepNumber: 4,
          instruction: "Cook on low heat until eggs are almost set, then either flip gently or finish under a broiler for 2 minutes until golden on top.",
          durationMinutes: 5
        }
      ],
      chefTip: "Pair with any fresh herbs, hot sauce, or a pinch of smoked paprika if available in your pantry."
    },
    {
      id: "recipe-3",
      name: hasTomato && hasEgg ? "Quick Tomato & Egg Stir-Fry / Shakshuka" : "Rich Tomato & Onion Braised Medley",
      tagline: "Juicy, caramelized tomatoes melted into a savory sauce with fluffy poached or scrambled eggs.",
      prepTime: "8 mins",
      cookTime: "12 mins",
      totalTime: "20 mins",
      difficulty: "Easy" as const,
      servings: "2 servings",
      cuisine: "Homestyle",
      matchedIngredientsCount: ingredients.length,
      totalIngredientsCount: ingredients.length + 3,
      ingredientsRequired: [
        { name: "Fresh Tomatoes", amount: "3 ripe, chopped", isUserProvided: hasTomato },
        { name: "Eggs", amount: "3 eggs", isUserProvided: hasEgg },
        { name: "Onion", amount: "1/2 medium, sliced", isUserProvided: hasOnion },
        { name: "Cooking Oil", amount: "1.5 tbsp", isUserProvided: false },
        { name: "Sugar or Honey", amount: "1/2 tsp (optional balance)", isUserProvided: false },
        { name: "Salt and Pepper", amount: "To taste", isUserProvided: false }
      ],
      instructions: [
        {
          stepNumber: 1,
          instruction: "In a bowl, beat eggs with a pinch of salt. Scramble loosely in a hot oiled pan for 1-2 minutes until soft curds form, then transfer to a plate.",
          durationMinutes: 2
        },
        {
          stepNumber: 2,
          instruction: "In the same pan, add a touch more oil and sauté the onions until soft, then toss in the chopped tomatoes.",
          durationMinutes: 4
        },
        {
          stepNumber: 3,
          instruction: "Cook tomatoes on medium heat, gently pressing them with the back of a spoon until they break down into a thick, glossy sauce.",
          durationMinutes: 5,
          tip: "A pinch of sugar balances the natural acidity of fresh tomatoes."
        },
        {
          stepNumber: 4,
          instruction: "Fold the cooked eggs back into the bubbling tomato sauce, simmering together for 1 minute so flavors meld. Serve warm with rice or bread.",
          durationMinutes: 2
        }
      ],
      chefTip: "The natural juice from tomatoes forms an incredible savory gravy that is delicious spooned over warm rice."
    }
  ];
}

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Recipe suggestion endpoint
app.post("/api/suggest-recipes", async (req, res) => {
  try {
    const { ingredients = [], preferences = {} } = req.body;

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: "Please provide at least one ingredient." });
    }

    const cleanIngredients = ingredients
      .map((item: unknown) => String(item).trim())
      .filter((item: string) => item.length > 0);

    if (cleanIngredients.length === 0) {
      return res.status(400).json({ error: "Please provide valid ingredients." });
    }

    const {
      mealType = "any",
      dietary = "none",
      maxTime = "any",
      pantryStaples = true,
    } = preferences;

    // Check if GEMINI_API_KEY is configured
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY not found. Returning curated fallback recipes.");
      const fallback = getFallbackRecipes(cleanIngredients);
      return res.json({
        recipes: fallback,
        isFallback: true,
        notes: "Generated using curated chef templates because GEMINI_API_KEY is not yet attached.",
      });
    }

    const ai = getAIClient();

    const systemInstruction = `You are a culinary expert and household chef AI.
Your main objective is to help users decide what to cook using the ingredients they already have at home, minimizing food waste and maximizing flavor.
Always propose 3 to 4 distinct, practical, realistic recipes that prominently feature the user's available ingredients.
Make sure every recipe is achievable in a normal home kitchen with clear step-by-step instructions.`;

    const prompt = `Available Ingredients at Home:
${cleanIngredients.join(", ")}

User Preferences:
- Meal Type: ${mealType}
- Dietary Preferences: ${dietary}
- Max Time Limit: ${maxTime === "any" ? "No strict limit" : `${maxTime} minutes`}
- Basic Pantry Staples Available (salt, pepper, cooking oil, water): ${pantryStaples ? "Yes" : "Strictly user ingredients only"}

Please generate 3 to 4 delicious, well-tested recipes using these ingredients.
For each recipe, provide:
1. "id": unique string identifier (e.g. "rec-1")
2. "name": attractive, appetizing recipe name
3. "tagline": 1 concise sentence describing the dish
4. "prepTime": preparation time in minutes (e.g., "10 mins")
5. "cookTime": active cooking time in minutes (e.g., "15 mins")
6. "totalTime": total time (e.g., "25 mins")
7. "difficulty": one of "Easy", "Medium", "Hard"
8. "servings": realistic serving size (e.g., "2 servings" or "2-3 servings")
9. "cuisine": general cuisine style (e.g., "Italian", "Home-style", "Asian", "Quick Skillet")
10. "ingredientsRequired": array of objects with:
    - "name": ingredient name
    - "amount": quantity with unit (e.g., "2 cups", "1 medium", "1 tbsp")
    - "isUserProvided": true if this was in the user's provided list, false if it is a common staple
    - "notes": optional preparation note (e.g. "diced", "beaten", "optional")
11. "instructions": array of step objects with:
    - "stepNumber": integer step number starting at 1
    - "instruction": clear, actionable instruction
    - "durationMinutes": estimated minutes for this step
    - "tip": optional helpful chef tip for this step
12. "chefTip": general secret or plating/flavor tip
13. "matchedIngredientsCount": number of user-provided ingredients utilized
14. "totalIngredientsCount": total number of ingredients required`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recipes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  tagline: { type: Type.STRING },
                  prepTime: { type: Type.STRING },
                  cookTime: { type: Type.STRING },
                  totalTime: { type: Type.STRING },
                  difficulty: {
                    type: Type.STRING,
                    enum: ["Easy", "Medium", "Hard"],
                  },
                  servings: { type: Type.STRING },
                  cuisine: { type: Type.STRING },
                  matchedIngredientsCount: { type: Type.INTEGER },
                  totalIngredientsCount: { type: Type.INTEGER },
                  ingredientsRequired: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        amount: { type: Type.STRING },
                        isUserProvided: { type: Type.BOOLEAN },
                        notes: { type: Type.STRING },
                      },
                      required: ["name", "amount", "isUserProvided"],
                    },
                  },
                  instructions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        stepNumber: { type: Type.INTEGER },
                        instruction: { type: Type.STRING },
                        durationMinutes: { type: Type.INTEGER },
                        tip: { type: Type.STRING },
                      },
                      required: ["stepNumber", "instruction"],
                    },
                  },
                  chefTip: { type: Type.STRING },
                },
                required: [
                  "id",
                  "name",
                  "tagline",
                  "prepTime",
                  "cookTime",
                  "totalTime",
                  "difficulty",
                  "servings",
                  "ingredientsRequired",
                  "instructions",
                ],
              },
            },
            notes: { type: Type.STRING },
          },
          required: ["recipes"],
        },
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);

    return res.json({
      recipes: data.recipes || [],
      notes: data.notes || "",
    });
  } catch (error: unknown) {
    console.error("Error generating recipes:", error);
    const errMessage = error instanceof Error ? error.message : "Internal server error";

    // If quota or API failure occurs, fallback gracefully to curated suggestions
    const ingredients = req.body.ingredients || [];
    if (Array.isArray(ingredients) && ingredients.length > 0) {
      console.warn("Falling back to curated templates due to API error.");
      const fallback = getFallbackRecipes(ingredients);
      return res.json({
        recipes: fallback,
        isFallback: true,
        warning: `AI generation encountered an issue (${errMessage}). Here are curated recipes tailored to your ingredients.`,
      });
    }

    return res.status(500).json({
      error: "Failed to generate recipes. Please try again.",
      details: errMessage,
    });
  }
});

async function startServer() {
  // Vite middleware for development
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
