import Link from "next/link"
import { ModeToggle } from "./mode-toggle"
import { Search } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
            🌍 Global Recipe Finder
          </span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link
            href="/search"
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </Link>
          <ModeToggle />
        </nav>
      </div>
    </header>
  )
}
