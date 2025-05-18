import Link from "next/link"
import { Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t py-12 md:py-16 bg-muted/30">
      <div className="container flex flex-col items-center justify-center gap-4 text-center md:gap-6">
        <div className="flex flex-col items-center gap-4">
          <Link
            href="/"
            className="text-xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent"
          >
            🌍 Global Recipe Finder
          </Link>
          <p className="text-sm text-muted-foreground max-w-md">
            Discover delicious recipes from around the world with our AI-powered recipe finder
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Global Recipe Finder. All rights reserved.</p>
          <p>Powered by TheMealDB and Groq AI</p>
        </div>
      </div>
    </footer>
  )
}
