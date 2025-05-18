"use client";

import type React from "react";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Recipe } from "@/lib/types";
import Image from "next/image";

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = "/placeholder.svg?height=300&width=400";
  };

  return (
    <Link href={`/recipe/${recipe.idMeal}`} passHref>
      <Card className="h-full overflow-hidden transition-all hover:shadow-xl hover:translate-y-[-5px] duration-300 border-0 shadow-lg">
        <div className="aspect-video relative overflow-hidden">
          {recipe.strMealThumb ? (
            <Image
              src={recipe.strMealThumb || "/placeholder.svg"}
              alt={recipe.strMeal}
              width={400}
              height={300}
              className="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-105 duration-500"
              onError={handleImageError}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
          {recipe.strCategory && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="shadow-md">
                {recipe.strCategory}
              </Badge>
            </div>
          )}
        </div>
        <CardHeader className="p-5">
          <CardTitle className="line-clamp-2 text-xl">
            {recipe.strMeal}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <div className="flex flex-wrap gap-2">
            {recipe.strArea && (
              <Badge variant="outline" className="bg-primary/10">
                {recipe.strArea}
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-5 pt-0">
          <p className="text-sm text-muted-foreground">
            {recipe.mainIngredients?.slice(0, 3).join(", ")}
            {recipe.mainIngredients &&
              recipe.mainIngredients.length > 3 &&
              "..."}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}
