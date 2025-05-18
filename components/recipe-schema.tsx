import type { Recipe } from "@/lib/types"

interface RecipeSchemaProps {
  recipe: Recipe
}

export function RecipeSchema({ recipe }: RecipeSchemaProps) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.strMeal,
    image: recipe.strMealThumb,
    description: `${recipe.strMeal} - ${recipe.strArea} ${recipe.strCategory} recipe`,
    recipeCategory: recipe.strCategory,
    recipeCuisine: recipe.strArea,
    recipeIngredient: recipe.ingredients?.map(({ ingredient, measure }) => `${measure} ${ingredient}`),
    recipeInstructions: recipe.strInstructions
      ?.split(/\r\n|\n|\r/)
      .filter(Boolean)
      .map((step, index) => ({
        "@type": "HowToStep",
        text: step,
        position: index + 1,
      })),
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
}
