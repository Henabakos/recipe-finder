export interface Recipe {
  idMeal: string;
  strMeal: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strMealThumb: string;
  strTags?: string;
  strYoutube?: string;
  mainIngredients?: string[];
  ingredients?: {
    ingredient: string;
    measure: string;
  }[];
}

export interface SearchFilters {
  ingredient?: string;
  cuisine?: string;
  category?: string;
  query?: string;
  firstLetter?: string;
  dietary?: string;
  cookingMethod?: string;
}

export interface RecipeAnalysis {
  difficulty: string;
  prepTime: string;
  cookingTechniques: string[];
  healthRating: string;
  nutritionalHighlights: string[];
  substitutionSuggestions: {
    ingredient: string;
    alternatives: string[];
  }[];
  pairingRecommendations: string[];
}
