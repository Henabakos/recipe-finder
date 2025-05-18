import type { SearchFilters, RecipeAnalysis, Recipe } from "@/lib/types";
import NodeCache from "node-cache";

const analysisCache = new NodeCache({
  stdTTL: 24 * 60 * 60, // Cache for 24 hours
  checkperiod: 120, // Check for expired entries every 2 minutes
});

export async function processSearchQuery(query: string): Promise<SearchFilters> {
  const defaultResult: SearchFilters = { query };
  const cacheKey = `search:${query.toLowerCase().trim()}`;

  // Check cache first
  const cachedResult = analysisCache.get<SearchFilters>(cacheKey);
  if (cachedResult) {
    console.log("Returning cached search result for:", query);
    return cachedResult;
  }

  if (!process.env.GROQ_API_KEY) {
    console.warn("GROQ_API_KEY is not set. Falling back to basic search.");
    return defaultResult;
  }

  try {
    const response = await fetchWithRetry("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant that extracts search parameters from recipe queries.
            Return a JSON object with:
            {
              "ingredient": "main ingredient (singular)",
              "cuisine": "cuisine type",
              "category": "dish category",
              "query": "original query",
              "firstLetter": "first letter if specified",
              "dietary": "dietary restrictions",
              "cookingMethod": "primary cooking method"
            }
            Omit fields not present in the query. Be concise and accurate.`,
          },
          { role: "user", content: query },
        ],
        temperature: 0.1,
        max_tokens: 150,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in API response");
    }

    const jsonString = extractJsonContent(content);
    const parsedData = JSON.parse(jsonString);
    
    // Validate response
    if (!parsedData || typeof parsedData !== "object") {
      throw new Error("Invalid response format");
    }

    const result = { ...parsedData, query };
    analysisCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error("Error processing search query:", error);
    return defaultResult;
  }
}

export async function analyzeRecipe(recipe: Recipe): Promise<RecipeAnalysis> {
  const cacheKey = `analysis:${recipe.idMeal}`;
  const cachedAnalysis = analysisCache.get<RecipeAnalysis>(cacheKey);
  if (cachedAnalysis) {
    console.log("Returning cached analysis for:", recipe.strMeal);
    return cachedAnalysis;
  }

  const defaultAnalysis: RecipeAnalysis = {
    difficulty: "Medium",
    prepTime: "30-45 minutes",
    cookingTechniques: ["Baking"],
    healthRating: "Moderate",
    nutritionalHighlights: ["Protein"],
    substitutionSuggestions: [],
    pairingRecommendations: ["Water"],
  };

  if (!process.env.GROQ_API_KEY) {
    console.warn("GROQ_API_KEY is not set.");
    return defaultAnalysis;
  }

  if (!recipe?.idMeal || !recipe.strMeal) {
    console.error("Invalid recipe data");
    return defaultAnalysis;
  }

  try {
    const ingredientsList = recipe.ingredients
      ?.filter((i) => i.ingredient && i.measure)
      .map((i) => `${i.measure} ${i.ingredient}`)
      .join(", ") || "Not specified";

    const prompt = `
      Recipe: ${recipe.strMeal}
      Category: ${recipe.strCategory || "Unknown"}
      Cuisine: ${recipe.strArea || "Unknown"}
      Ingredients: ${ingredientsList}
      Instructions: ${recipe.strInstructions?.substring(0, 1000) || "Not specified"}
    `;

    const response = await fetchWithRetry("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: `You are a chef and nutritionist. Analyze the recipe and return a JSON object:
            {
              "difficulty": "Easy/Medium/Hard",
              "prepTime": "estimated time",
              "cookingTechniques": ["technique1", "technique2"],
              "healthRating": "Low/Moderate/High",
              "nutritionalHighlights": ["benefit1", "benefit2"],
              "substitutionSuggestions": [{"ingredient": "name", "alternatives": ["sub1", "sub2"]}],
              "pairingRecommendations": ["pairing1", "pairing2"]
            }
            Limit arrays to 3-5 items. Be accurate.`,
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in API response");
    }

    const jsonString = extractJsonContent(content);
    const parsedData: RecipeAnalysis = JSON.parse(jsonString);

    // Validate response structure
    if (!parsedData.difficulty || !parsedData.prepTime) {
      throw new Error("Invalid analysis response structure");
    }

    analysisCache.set(cacheKey, parsedData);
    return parsedData;
  } catch (error) {
    console.error("Error analyzing recipe:", error);
    return defaultAnalysis;
  }
}

// Utility function to extract JSON from response
function extractJsonContent(content: string): string {
  const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```([\s\S]*?)```/) || [null, content];
  return jsonMatch[1]?.trim() || content.trim();
}

// Fetch with retry and exponential backoff
async function fetchWithRetry(url: string, options: RequestInit, retries = 3, baseDelay = 1000): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response;
    } catch (err) {
      if (attempt === retries) throw err;
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Max retries reached");
}