import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Clock, Globe, Tag, Utensils } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RecipeSchema } from "@/components/recipe-schema";
import { RecipeAnalysis } from "@/components/recipe-analysis";
import { getAllRecipeIds, getRecipeById } from "@/lib/api";
import { RecipeImage } from "@/components/recipe-image";

interface RecipePageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  try {
    const ids = await getAllRecipeIds();
    return ids.slice(0, 50).map((id) => ({ id }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  try {
    const recipe = await getRecipeById(params.id);

    if (!recipe) {
      return {
        title: "Recipe Not Found",
        description: "The recipe could not be found.",
      };
    }

    return {
      title: `${recipe.strMeal} - Recipe Finder`,
      description: `Learn to make ${recipe.strMeal}, a ${recipe.strArea || ""} ${recipe.strCategory || ""} dish.`,
      openGraph: {
        title: recipe.strMeal,
        description: `Discover this ${recipe.strArea || ""} ${recipe.strCategory || ""} recipe.`,
        images: recipe.strMealThumb ? [{ url: recipe.strMealThumb, width: 800, height: 600, alt: recipe.strMeal }] : [],
        type: "article",
      },
      alternates: {
        canonical: `/recipe/${params.id}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Recipe Finder",
      description: "Discover recipes from around the world.",
    };
  }
}

export default async function RecipePage({ params }: RecipePageProps) {
  let recipe;
  try {
    recipe = await getRecipeById(params.id);
    if (!recipe || !recipe.idMeal) {
      notFound();
    }
  } catch (error) {
    console.error(`Error fetching recipe ${params.id}:`, error);
    notFound();
  }

  // Extract YouTube video ID
  let youtubeId: string | null = null;
  if (recipe.strYoutube) {
    try {
      const url = new URL(recipe.strYoutube);
      youtubeId = url.searchParams.get("v");
    } catch (error) {
      console.error("Error parsing YouTube URL:", error);
    }
  }

  // Format instructions
  const instructionParagraphs = recipe.strInstructions
    ? recipe.strInstructions
        .split(/\r\n|\n|\r/)
        .filter((p) => p.trim())
        .map((p) => p.trim())
    : [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <article className="py-8 md:py-12">
          <div className="container">
            <Link
              href="/"
              className="inline-flex items-center mb-8 text-primary hover:text-primary/80 transition-colors"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to recipes
            </Link>

            <div className="relative mb-12">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-3xl -z-10"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 p-6 md:p-8">
                <div className="relative aspect-video overflow-hidden rounded-2xl shadow-xl">
                  <RecipeImage src={recipe.strMealThumb} alt={recipe.strMeal} />
                </div>

                <div className="flex flex-col justify-center">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                    {recipe.strMeal}
                  </h1>

                  <div className="flex flex-wrap gap-3 mb-8">
                    {recipe.strArea && (
                      <div className="flex items-center gap-1.5 text-sm bg-background/80 px-3 py-1.5 rounded-full">
                        <Globe className="h-4 w-4 text-primary" />
                        <span>{recipe.strArea} Cuisine</span>
                      </div>
                    )}
                    {recipe.strCategory && (
                      <div className="flex items-center gap-1.5 text-sm bg-background/80 px-3 py-1.5 rounded-full">
                        <Tag className="h-4 w-4 text-primary" />
                        <span>{recipe.strCategory}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-sm bg-background/80 px-3 py-1.5 rounded-full">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>30-45 min</span>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Utensils className="h-5 w-5 text-primary" />
                      Ingredients
                    </h2>
                    <Card className="bg-background/80 border-0 shadow-lg">
                      <CardContent className="p-4">
                        {recipe.ingredients && recipe.ingredients.length > 0 ? (
                          <ul className="space-y-2 divide-y divide-border">
                            {recipe.ingredients
                              .filter((i) => i.ingredient && i.measure)
                              .map(({ ingredient, measure }, index) => (
                                <li key={index} className={`flex justify-between ${index > 0 ? "pt-2" : ""}`}>
                                  <span className="font-medium">{ingredient}</span>
                                  <span className="text-muted-foreground">{measure}</span>
                                </li>
                              ))}
                          </ul>
                        ) : (
                          <p className="text-muted-foreground">No ingredients listed</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-primary" />
                    Instructions
                  </h2>
                  {instructionParagraphs.length > 0 ? (
                    <div className="space-y-6">
                      {instructionParagraphs.map((paragraph, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                            {index + 1}
                          </div>
                          <p className="flex-1">{paragraph}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No instructions provided</p>
                  )}
                </div>

                {youtubeId && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-6">Video Tutorial</h2>
                    <div className="aspect-video relative rounded-2xl overflow-hidden shadow-lg">
                      <iframe
                        src={`https://www.youtube.com/embed/${youtubeId}`}
                        title={`${recipe.strMeal} video`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <RecipeAnalysis key={recipe.idMeal} recipe={recipe} />
              </div>
            </div>

            <div className="flex justify-center">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/">Discover More Recipes</Link>
              </Button>
            </div>

            <RecipeSchema recipe={recipe} />
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}