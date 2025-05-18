import { SearchBar } from "@/components/search-bar"
import { UtensilsCrossed } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background/50 to-background"></div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl"></div>

      <div className="container relative flex flex-col items-center text-center space-y-8 z-10">
        <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
          <UtensilsCrossed className="h-6 w-6 text-primary" />
        </div>

        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-gray-900 via-primary to-orange-500 dark:from-white dark:via-primary dark:to-orange-400 bg-clip-text text-transparent">
            Global Recipe Finder
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
            Discover delicious recipes from around the world with our AI-powered search
          </p>
        </div>

        <div className="w-full max-w-xl">
          <SearchBar />
        </div>
      </div>
    </section>
  )
}
