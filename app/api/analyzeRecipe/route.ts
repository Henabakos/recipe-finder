import { NextResponse } from "next/server";
import { analyzeRecipe } from "@/lib/ai";
import type { Recipe } from "@/lib/types";

export async function POST(request: Request) {
  console.log("API Route: /api/analyzeRecipe called");

  try {
    const body = await request.json();
    console.log("Request body:", body);

    if (!body.recipe || typeof body.recipe !== "object") {
      console.error("Invalid or missing recipe data in request");
      return NextResponse.json(
        { error: "Valid recipe data is required" },
        { status: 400 }
      );
    }

    const recipe: Recipe = body.recipe;

    // Basic validation of recipe
    if (!recipe.strMeal || !recipe.idMeal) {
      console.error("Recipe missing required fields (strMeal or idMeal)");
      return NextResponse.json(
        { error: "Recipe must include name and ID" },
        { status: 400 }
      );
    }

    console.log("Processing recipe:", recipe.strMeal);
    const analysis = await analyzeRecipe(recipe);
    console.log("Analysis completed:", analysis);

    return NextResponse.json(analysis, { status: 200 });
  } catch (error) {
    console.error("Error in /api/analyzeRecipe:", error);
    return NextResponse.json(
      { error: "Failed to analyze recipe" },
      { status: 500 }
    );
  }
}