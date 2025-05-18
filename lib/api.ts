import type { Recipe, SearchFilters } from "@/lib/types"

const THEMEALDB_API_URL = "https://www.themealdb.com/api/json/v1/1"

export async function getFeaturedRecipes(): Promise<Recipe[]> {
  try {
    const recipes: Recipe[] = []
    const seenIds = new Set<string>()
    const maxRetries = 3
    let attempts = 0

    while (recipes.length < 6 && attempts < maxRetries) {
      try {
        const response = await fetch(`${THEMEALDB_API_URL}/random.php`, {
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`)
        }

        const data = await response.json()
        if (data.meals && data.meals[0]) {
          const recipe = formatRecipe(data.meals[0])
          // Only add if we haven't seen this recipe before
          if (!seenIds.has(recipe.idMeal)) {
            recipes.push(recipe)
            seenIds.add(recipe.idMeal)
          }
        }
      } catch (error) {
        console.error("Error fetching random recipe:", error)
      }
      attempts++
    }

    // If we still don't have enough recipes, try getting them by category
    if (recipes.length < 6) {
      const categories = ["Beef", "Chicken", "Dessert", "Pasta", "Seafood", "Vegetarian"]
      for (const category of categories) {
        if (recipes.length >= 6) break

        try {
          const response = await fetch(`${THEMEALDB_API_URL}/filter.php?c=${encodeURIComponent(category)}`, {
            cache: "no-store",
          })

          if (!response.ok) continue

          const data = await response.json()
          if (data.meals) {
            // Get a random recipe from this category
            const randomIndex = Math.floor(Math.random() * data.meals.length)
            const meal = data.meals[randomIndex]
            
            // Get full recipe details
            const detailResponse = await fetch(`${THEMEALDB_API_URL}/lookup.php?i=${meal.idMeal}`, {
              cache: "no-store",
            })

            if (!detailResponse.ok) continue

            const detailData = await detailResponse.json()
            if (detailData.meals && detailData.meals[0]) {
              const recipe = formatRecipe(detailData.meals[0])
              if (!seenIds.has(recipe.idMeal)) {
                recipes.push(recipe)
                seenIds.add(recipe.idMeal)
              }
            }
          }
        } catch (error) {
          console.error(`Error fetching recipe from category ${category}:`, error)
        }
      }
    }

    return recipes
  } catch (error) {
    console.error("Error fetching featured recipes:", error)
    return []
  }
}

export async function searchRecipes(filters: SearchFilters): Promise<Recipe[]> {
  try {
    let url = ""
    let searchType = ""

    // Search by name using search.php endpoint
    if (filters.query) {
      url = `${THEMEALDB_API_URL}/search.php?s=${encodeURIComponent(filters.query)}`
      searchType = "name"
      console.log("Searching by name:", filters.query)
    }
    // Search by first letter if it's a single character
    else if (filters.firstLetter && filters.firstLetter.length === 1) {
      url = `${THEMEALDB_API_URL}/search.php?f=${filters.firstLetter}`
      searchType = "letter"
      console.log("Searching by first letter:", filters.firstLetter)
    }
    // Search by ingredient
    else if (filters.ingredient) {
      url = `${THEMEALDB_API_URL}/filter.php?i=${encodeURIComponent(filters.ingredient)}`
      searchType = "ingredient"
      console.log("Searching by ingredient:", filters.ingredient)
    }
    // Search by cuisine (area)
    else if (filters.cuisine) {
      url = `${THEMEALDB_API_URL}/filter.php?a=${encodeURIComponent(filters.cuisine)}`
      searchType = "cuisine"
      console.log("Searching by cuisine:", filters.cuisine)
    }
    // Search by category
    else if (filters.category) {
      url = `${THEMEALDB_API_URL}/filter.php?c=${encodeURIComponent(filters.category)}`
      searchType = "category"
      console.log("Searching by category:", filters.category)
    } else {
      console.log("No search filters provided")
      return []
    }

    console.log("Fetching recipes from:", url)
    const response = await fetch(url, { 
      cache: "no-store",
      headers: {
        'Accept': 'application/json',
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API Error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("API Response:", data)

    if (!data.meals) {
      console.log("No meals found in response")
      return []
    }

    // For filter endpoints, we need to fetch full recipe details
    if (searchType === "ingredient" || searchType === "cuisine" || searchType === "category") {
      console.log("Fetching full recipe details for filtered results")
      const recipePromises = data.meals.map(async (meal: any) => {
        try {
          const detailResponse = await fetch(`${THEMEALDB_API_URL}/lookup.php?i=${meal.idMeal}`, {
            cache: "no-store",
            headers: {
              'Accept': 'application/json',
            }
          })

          if (!detailResponse.ok) {
            throw new Error(`Failed to fetch recipe details: ${detailResponse.status}`)
          }

          const detailData = await detailResponse.json()
          if (!detailData.meals?.[0]) return null

          const recipe = formatRecipe(detailData.meals[0])

          // Apply additional filters if present
          if (filters.dietary) {
            const isVegetarian = recipe.ingredients?.every(i => 
              !["beef", "chicken", "pork", "lamb", "meat", "fish"].includes(i.ingredient.toLowerCase())
            )
            if (filters.dietary.toLowerCase() === "vegetarian" && !isVegetarian) return null
          }

          if (filters.cookingMethod) {
            const cookingMethod = filters.cookingMethod.toLowerCase()
            const instructions = recipe.strInstructions?.toLowerCase() || ""
            if (!instructions.includes(cookingMethod)) return null
          }

          return recipe
        } catch (error) {
          console.error(`Error fetching details for recipe ${meal.idMeal}:`, error)
          return null
        }
      })

      const recipes = await Promise.all(recipePromises)
      const validRecipes = recipes.filter(Boolean) as Recipe[]
      console.log(`Found ${validRecipes.length} valid recipes`)
      return validRecipes
    }

    // For search.php endpoints, we already have full recipe details
    const recipes = data.meals.map(formatRecipe)
    console.log(`Found ${recipes.length} recipes`)
    return recipes
  } catch (error) {
    console.error("Error searching recipes:", error)
    throw error // Re-throw to be handled by the UI
  }
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  console.log("getRecipeById called for ID:", id);
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`, {
      cache: "no-store",
    });
    const data = await response.json();
    // console.log("getRecipeById response:", data);
    if (!data.meals || data.meals.length === 0) {
      console.error("No recipe found for ID:", id);
      return null;
    }
    const meal = data.meals[0];
    const recipe = {
      idMeal: meal.idMeal,
      strMeal: meal.strMeal,
      strCategory: meal.strCategory,
      strArea: meal.strArea,
      strInstructions: meal.strInstructions,
      strMealThumb: meal.strMealThumb,
      strTags: meal.strTags,
      strYoutube: meal.strYoutube,
      ingredients: Array.from({ length: 20 }, (_, i) => ({
        ingredient: meal[`strIngredient${i + 1}`],
        measure: meal[`strMeasure${i + 1}`],
      })).filter((i) => i.ingredient && i.ingredient.trim()),
      mainIngredients: Array.from({ length: 20 }, (_, i) => meal[`strIngredient${i + 1}`])
        .filter((i) => i && i.trim())
        .slice(0, 5),
    };
    // console.log("getRecipeById returning recipe:", recipe.strMeal);
    return recipe;
  } catch (error) {
    console.error("Error fetching recipe by ID:", id, error);
    return null;
  }
}

export async function getRandomRecipe(): Promise<Recipe | null> {
  try {
    const response = await fetch(`${THEMEALDB_API_URL}/random.php`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch random recipe: ${response.status}`)
    }

    const data = await response.json()

    if (!data.meals || !data.meals[0]) return null

    return formatRecipe(data.meals[0])
  } catch (error) {
    console.error("Error fetching random recipe:", error)
    return null
  }
}

async function fetchWithRetry(url: string, retries = 3, timeout = 10000): Promise<any> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        cache: "no-store",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (attempt === retries) {
        console.error(`Failed to fetch ${url} after ${retries} attempts:`, error);
        return { meals: [] }; // Return empty result to continue processing
      }
      // Wait before retrying (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
}

// Utility to process requests in batches
async function processInBatches<T>(
  items: string[],
  batchSize: number,
  callback: (item: string) => Promise<T>
): Promise<T[]> {
  const results: T[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(callback));
    results.push(...batchResults);
    // Optional: Add delay between batches to avoid rate limiting
    if (i + batchSize < items.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  return results;
}

export async function getAllRecipeIds(): Promise<string[]> {
  try {
    const letters = "abcdefghijklmnopqrstuvwxyz".split("");
    const batchSize = 5; // Process 5 letters at a time

    const recipeIdsArrays = await processInBatches(letters, batchSize, async (letter) => {
      const url = `${THEMEALDB_API_URL}/search.php?f=${letter}`;
      console.log(`Fetching recipes for letter: ${letter}`);
      const data = await fetchWithRetry(url, 3, 10000); // 3 retries, 10s timeout
      return data.meals ? data.meals.map((meal: any) => meal.idMeal) : [];
    });

    // Flatten and deduplicate the array of IDs
    const uniqueIds = Array.from(new Set(recipeIdsArrays.flat()));
    console.log(`Fetched ${uniqueIds.length} unique recipe IDs`);
    return uniqueIds;
  } catch (error) {
    console.error("Error fetching all recipe IDs:", error);
    return [];
  }
}

function formatRecipe(meal: any): Recipe {
  if (!meal)
    return {
      idMeal: "",
      strMeal: "Unknown Recipe",
      strMealThumb: "",
    }

  // Extract ingredients and measures
  const ingredients: { ingredient: string; measure: string }[] = []
  const mainIngredients: string[] = []

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]
    const measure = meal[`strMeasure${i}`]

    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure ? measure.trim() : "",
      })

      // Add to main ingredients list for card display
      mainIngredients.push(ingredient.trim())
    }
  }

  return {
    idMeal: meal.idMeal || "",
    strMeal: meal.strMeal || "Unknown Recipe",
    strCategory: meal.strCategory || "",
    strArea: meal.strArea || "",
    strInstructions: meal.strInstructions || "",
    strMealThumb: meal.strMealThumb || "",
    strTags: meal.strTags || "",
    strYoutube: meal.strYoutube || "",
    ingredients,
    mainIngredients,
  }
}
