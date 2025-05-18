import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { SearchBar } from "@/components/search-bar"
import { RecipeCard } from "@/components/recipe-card"
import { Footer } from "@/components/footer"
import { processSearchQuery } from "@/lib/ai"
import { searchRecipes } from "@/lib/api"
import { Filter, SearchIcon, AlertCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { Recipe } from "@/lib/types"

interface SearchPageProps {
  searchParams: { 
    q?: string
    letter?: string
    dietary?: string
    method?: string
  }
}

export const metadata: Metadata = {
  title: "Search Recipes - Global Recipe Finder",
  description: "Search for recipes by name, ingredients, cuisine, or first letter.",
}

// Force dynamic rendering to ensure fresh data on each search
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ""
  const letter = searchParams.letter || ""
  const dietary = searchParams.dietary || ""
  const method = searchParams.method || ""

  let recipes: Recipe[] = []
  let error = null
  let isLoading = true

  try {
    if (letter) {
      // If letter parameter is provided, search by first letter
      console.log("Searching recipes by first letter:", letter)
      recipes = await searchRecipes({ firstLetter: letter })
    } else if (query) {
      // Process the query with AI to extract search parameters
      console.log("Processing search query:", query)
      const searchFilters = await processSearchQuery(query)
      console.log("Search filters:", searchFilters)

      // Add any additional filters from URL parameters
      if (dietary) searchFilters.dietary = dietary
      if (method) searchFilters.cookingMethod = method

      // Search for recipes based on the extracted parameters
      recipes = await searchRecipes(searchFilters)
    }
  } catch (err) {
    console.error("Error fetching recipes:", err)
    error = "Failed to fetch recipes. Please try again later."
    toast.error("Failed to fetch recipes")
  } finally {
    isLoading = false
  }

  const searchTerm = letter 
    ? `recipes starting with '${letter.toUpperCase()}'` 
    : query 
      ? `"${query}"` 
      : ""

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <SearchBar />
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Searching recipes...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16 max-w-md mx-auto">
                <div className="inline-flex items-center justify-center p-4 bg-destructive/10 rounded-full mb-4">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">Error</h2>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Button asChild>
                  <Link href="/">Return to homepage</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">{recipes.length}</span> results for{" "}
                      <span className="font-medium text-foreground">{searchTerm}</span>
                    </p>
                  </div>
                </div>

                {recipes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recipes.map((recipe) => (
                      <RecipeCard key={recipe.idMeal} recipe={recipe} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 max-w-md mx-auto">
                    <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
                      <SearchIcon className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">No recipes found</h2>
                    <p className="text-muted-foreground mb-6">
                      Try searching with different keywords or browse our featured recipes.
                    </p>
                    <Button asChild>
                      <Link href="/">Return to homepage</Link>
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
