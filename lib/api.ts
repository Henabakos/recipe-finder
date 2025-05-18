import type { Recipe, SearchFilters } from "@/lib/types";

// Interface for MealDB meal response
interface MealDBMeal {
  idMeal: string;
  strMeal: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strMealThumb?: string;
  strTags?: string;
  strYoutube?: string;
  [key: `strIngredient${number}`]: string | null;
  [key: `strMeasure${number}`]: string | null;
}

// Interface for MealDB API responses
interface MealDBResponse {
  meals: MealDBMeal[] | null;
}

// Interface for filtered MealDB response (used in filter.php endpoints)
interface MealDBFilterResponse {
  meals: { idMeal: string }[] | null;
}

const THEMEALDB_API_URL = "https://www.themealdb.com/api/json/v1/1";

export async function getFeaturedRecipes(): Promise<Recipe[]> {
  try {
    // Fetch initial random meal
    const response = await fetch(`${THEMEALDB_API_URL}/random.php`);
    const data: MealDBResponse = await response.json();

    if (!data.meals) return [];

    const recipes = data.meals.map(formatRecipe);

    // If we only get one recipe, fetch more to have at least 6
    if (recipes.length < 6) {
      const additionalRecipes: Recipe[] = [];
      for (let i = 0; i < 5; i++) {
        const res = await fetch(`${THEMEALDB_API_URL}/random.php`);
        const moreData: MealDBResponse = await res.json();
        if (moreData.meals && moreData.meals[0]) {
          additionalRecipes.push(formatRecipe(moreData.meals[0]));
        }
      }
      return [...recipes, ...additionalRecipes].slice(0, 6);
    }

    return recipes;
  } catch (error) {
    console.error("Error fetching featured recipes:", error);
    return [];
  }
}

export async function searchRecipes(filters: SearchFilters): Promise<Recipe[]> {
  try {
    let url = "";

    // Prioritize search by ingredient if available
    if (filters.ingredient) {
      url = `${THEMEALDB_API_URL}/filter.php?i=${encodeURIComponent(
        filters.ingredient
      )}`;
    }
    // Then by cuisine (area)
    else if (filters.cuisine) {
      url = `${THEMEALDB_API_URL}/filter.php?a=${encodeURIComponent(
        filters.cuisine
      )}`;
    }
    // Then by category
    else if (filters.category) {
      url = `${THEMEALDB_API_URL}/filter.php?c=${encodeURIComponent(
        filters.category
      )}`;
    }
    // Fallback to search by name
    else if (filters.query) {
      url = `${THEMEALDB_API_URL}/search.php?s=${encodeURIComponent(
        filters.query
      )}`;
    } else {
      // If no filters, return empty array
      return [];
    }

    const response = await fetch(url);
    const data: MealDBResponse | MealDBFilterResponse = await response.json();

    if (!data.meals) return [];

    // For filter endpoints, we need to fetch full recipe details
    if (filters.ingredient || filters.cuisine || filters.category) {
      const recipePromises = data.meals.map(
        async (meal: { idMeal: string }) => {
          const detailResponse = await fetch(
            `${THEMEALDB_API_URL}/lookup.php?i=${meal.idMeal}`
          );
          const detailData: MealDBResponse = await detailResponse.json();
          return detailData.meals && detailData.meals[0]
            ? formatRecipe(detailData.meals[0])
            : null;
        }
      );

      const recipes = await Promise.all(recipePromises);
      return recipes.filter((recipe): recipe is Recipe => recipe !== null);
    }

    return data.meals.map(formatRecipe);
  } catch (error) {
    console.error("Error searching recipes:", error);
    return [];
  }
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  try {
    const response = await fetch(`${THEMEALDB_API_URL}/lookup.php?i=${id}`);
    const data: MealDBResponse = await response.json();

    if (!data.meals || !data.meals[0]) return null;

    return formatRecipe(data.meals[0]);
  } catch (error) {
    console.error(`Error fetching recipe with ID ${id}:`, error);
    return null;
  }
}

export async function getAllRecipeIds(): Promise<string[]> {
  try {
    // Fetch recipes by first letter to get a good sample
    const letters = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
    ];
    const recipeIdsPromises = letters.map(async (letter) => {
      const response = await fetch(
        `${THEMEALDB_API_URL}/search.php?f=${letter}`
      );
      const data: MealDBResponse = await response.json();
      return data.meals ? data.meals.map((meal) => meal.idMeal) : [];
    });

    const recipeIdsArrays = await Promise.all(recipeIdsPromises);
    return recipeIdsArrays.flat();
  } catch (error) {
    console.error("Error fetching all recipe IDs:", error);
    return [];
  }
}

function formatRecipe(meal: MealDBMeal): Recipe {
  // Extract ingredients and measures
  const ingredients: { ingredient: string; measure: string }[] = [];
  const mainIngredients: string[] = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure ? measure.trim() : "",
      });
      mainIngredients.push(ingredient.trim());
    }
  }

  return {
    idMeal: meal.idMeal,
    strMeal: meal.strMeal,
    strCategory: meal.strCategory,
    strArea: meal.strArea,
    strInstructions: meal.strInstructions,
    strMealThumb: meal.strMealThumb,
    strTags: meal.strTags,
    strYoutube: meal.strYoutube,
    ingredients,
    mainIngredients,
  };
}
