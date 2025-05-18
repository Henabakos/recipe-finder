import type { Metadata } from "next"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturedRecipes } from "@/components/featured-recipes"
import { BrowseByLetter } from "@/components/browse-by-letter"
import { Footer } from "@/components/footer"
import { getFeaturedRecipes } from "@/lib/api"

export const metadata: Metadata = {
  title: "Global Recipe Finder - Discover Delicious Recipes from Around the World",
  description:
    "Search for international recipes using ingredients, cuisine, or dish name with our AI-powered recipe finder.",
}

export const revalidate = 86400 // Revalidate at most once per day

export default async function HomePage() {
  const featuredRecipes = await getFeaturedRecipes()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedRecipes recipes={featuredRecipes} />
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <BrowseByLetter />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
