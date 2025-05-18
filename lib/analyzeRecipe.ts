import type { NextApiRequest, NextApiResponse } from "next";
import { analyzeRecipe } from "@/lib/ai";
import type { Recipe, RecipeAnalysis } from "@/lib/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { recipe }: { recipe: Recipe } = req.body;

  if (!recipe) {
    return res.status(400).json({ error: "Recipe is required" });
  }

  try {
    console.log("API route: Analyzing recipe:", recipe.strMeal);
    const analysis = await analyzeRecipe(recipe);
    console.log("API route: Analysis result:", analysis);
    res.status(200).json(analysis);
  } catch (error) {
    console.error("API route error:", error);
    res.status(500).json({ error: "Failed to analyze recipe" });
  }
}