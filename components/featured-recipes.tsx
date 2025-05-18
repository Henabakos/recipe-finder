import type { Recipe } from "@/lib/types"
import { RecipeCard } from "@/components/recipe-card"
import { ChefHat } from "lucide-react"

interface FeaturedRecipesProps {
  recipes: Recipe[]
}

export function FeaturedRecipes({ recipes }: FeaturedRecipesProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <ChefHat className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-4">Featured Recipes</h2>
          <p className="text-muted-foreground max-w-2xl">
            Explore our handpicked selection of delicious recipes from around the world
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.idMeal} recipe={recipe} />
          ))}
        </div>
      </div>
    </section>
  )
}
