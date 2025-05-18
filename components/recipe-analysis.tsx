"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, ChefHat, Clock, Activity, Utensils, Leaf, Wine } from "lucide-react";
import type { Recipe, RecipeAnalysis } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface RecipeAnalysisProps {
  recipe: Recipe;
}

export function RecipeAnalysis({ recipe }: RecipeAnalysisProps) {
  const [analysis, setAnalysis] = useState<RecipeAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const prevRecipeRef = useRef<Recipe | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchAnalysis = useCallback(async () => {
    if (!recipe?.idMeal) {
      setError("Invalid recipe data");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    abortControllerRef.current = new AbortController();

    try {
      console.log(`Requesting analysis for: ${recipe.strMeal}`);
      const response = await fetch("/api/analyzeRecipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipe }),
        signal: abortControllerRef.current.signal,
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: RecipeAnalysis = await response.json();
      
      // Validate response structure
      if (!data.difficulty || !data.prepTime) {
        throw new Error("Invalid analysis response structure");
      }

      setAnalysis(data);
      setLoading(false);
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Analysis error:", err);
        setError("Failed to analyze recipe. Please try again.");
        setLoading(false);
      }
    }
  }, [recipe]);

  useEffect(() => {
    // Track recipe changes
    if (prevRecipeRef.current?.idMeal !== recipe.idMeal) {
      console.log("Recipe changed:", {
        from: prevRecipeRef.current?.strMeal,
        to: recipe.strMeal,
        id: recipe.idMeal,
      });
      prevRecipeRef.current = recipe;
      fetchAnalysis();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [recipe, fetchAnalysis]);

  const handleRetry = () => {
    fetchAnalysis();
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-lg border-0">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xl">
            <ChefHat className="h-5 w-5 text-primary" />
            AI Recipe Analysis
          </CardTitle>
          <CardDescription>Analyzing recipe...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Please wait...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-lg border-0">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xl">
            <ChefHat className="h-5 w-5 text-primary" />
            AI Recipe Analysis
          </CardTitle>
          <CardDescription>Error analyzing recipe</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <AlertCircle className="h-6 w-6 text-destructive mb-2" />
          <p className="mb-4">{error}</p>
          <Button variant="outline" onClick={handleRetry}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-lg border-0">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <ChefHat className="h-5 w-5 text-primary" />
          AI Recipe Analysis
        </CardTitle>
        <CardDescription>Recipe insights and recommendations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2 text-base">
              <Utensils className="h-4 w-4 text-primary" />
              Recipe Overview
            </h3>
            <div className="space-y-2 bg-background/50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Difficulty:</span>
                <Badge
                  variant={
                    analysis.difficulty === "Easy"
                      ? "default"
                      : analysis.difficulty === "Hard"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {analysis.difficulty}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Prep Time:</span>
                <span className="font-medium flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {analysis.prepTime}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Health Rating:</span>
                <Badge
                  variant={
                    analysis.healthRating === "High"
                      ? "default"
                      : analysis.healthRating === "Low"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {analysis.healthRating}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2 text-base">
              <Activity className="h-4 w-4 text-primary" />
              Cooking Techniques
            </h3>
            <div className="flex flex-wrap gap-2 bg-background/50 p-3 rounded-lg">
              {analysis.cookingTechniques?.map((technique, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {technique}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium flex items-center gap-2 text-base">
            <Leaf className="h-4 w-4 text-primary" />
            Nutritional Highlights
          </h3>
          <div className="flex flex-wrap gap-2 bg-background/50 p-3 rounded-lg">
            {analysis.nutritionalHighlights?.map((highlight, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {highlight}
              </Badge>
            ))}
          </div>
        </div>

        {analysis.substitutionSuggestions?.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2 text-base">
              <Utensils className="h-4 w-4 text-primary" />
              Ingredient Substitutions
            </h3>
            <div className="bg-background/50 p-3 rounded-lg">
              <ul className="space-y-2 divide-y divide-border">
                {analysis.substitutionSuggestions.map((sub, index) => (
                  <li key={index} className={index > 0 ? "pt-2" : ""}>
                    <span className="font-medium text-primary">{sub.ingredient}:</span>{" "}
                    <span className="text-muted-foreground">{sub.alternatives?.join(", ")}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h3 className="font-medium flex items-center gap-2 text-base">
            <Wine className="h-4 w-4 text-primary" />
            Pairing Recommendations
          </h3>
          <div className="flex flex-wrap gap-2 bg-background/50 p-3 rounded-lg">
            {analysis.pairingRecommendations?.map((pairing, index) => (
              <Badge key={index} variant="outline" className="px-3 py-1">
                {pairing}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}