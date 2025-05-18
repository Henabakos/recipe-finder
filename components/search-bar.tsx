"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Loader2, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const DIETARY_OPTIONS = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten-free", label: "Gluten Free" },
]

const COOKING_METHODS = [
  { value: "baked", label: "Baked" },
  { value: "grilled", label: "Grilled" },
  { value: "fried", label: "Fried" },
  { value: "steamed", label: "Steamed" },
  { value: "roasted", label: "Roasted" },
]

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") || searchParams.get("letter") || "")
  const [isLoading, setIsLoading] = useState(false)
  const [dietary, setDietary] = useState<string | null>(searchParams.get("dietary"))
  const [cookingMethod, setCookingMethod] = useState<string | null>(searchParams.get("method"))
  const [showFilters, setShowFilters] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) {
      toast.error("Please enter a search term")
      return
    }

    setIsLoading(true)
    try {
      // Build search URL with all parameters
      const params = new URLSearchParams()
      
      // If the query is a single letter, use letter search
      if (query.length === 1 && /^[a-zA-Z]$/.test(query)) {
        params.set("letter", query.toLowerCase())
      } else {
        params.set("q", query.trim())
      }

      // Add filters if present
      if (dietary) params.set("dietary", dietary)
      if (cookingMethod) params.set("method", cookingMethod)

      router.push(`/search?${params.toString()}`, { scroll: false })
    } catch (error) {
      console.error("Search error:", error)
      toast.error("Failed to perform search")
    } finally {
      setIsLoading(false)
    }
  }

  const clearFilters = () => {
    setDietary(null)
    setCookingMethod(null)
    setShowFilters(false)
  }

  const hasActiveFilters = dietary || cookingMethod

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="relative flex w-full items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Search recipes by name, ingredients, or first letter..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-20 h-12 rounded-full border-primary/20 focus-visible:ring-primary"
            aria-label="Search recipes"
            disabled={isLoading}
          />
        </div>
        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant={hasActiveFilters ? "default" : "outline"}
              size="icon"
              className="h-12 w-12 rounded-full"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filters</h4>
                {hasActiveFilters && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-8 px-2"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Dietary</label>
                  <Select value={dietary || ""} onValueChange={setDietary}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select dietary preference" />
                    </SelectTrigger>
                    <SelectContent>
                      {DIETARY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cooking Method</label>
                  <Select value={cookingMethod || ""} onValueChange={setCookingMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cooking method" />
                    </SelectTrigger>
                    <SelectContent>
                      {COOKING_METHODS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Button 
          type="submit" 
          className="h-12 px-6 rounded-full" 
          aria-label="Search"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Search"
          )}
        </Button>
      </div>
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {dietary && (
            <Badge variant="secondary" className="px-3 py-1">
              {DIETARY_OPTIONS.find(opt => opt.value === dietary)?.label}
              <button
                type="button"
                onClick={() => setDietary(null)}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {cookingMethod && (
            <Badge variant="secondary" className="px-3 py-1">
              {COOKING_METHODS.find(opt => opt.value === cookingMethod)?.label}
              <button
                type="button"
                onClick={() => setCookingMethod(null)}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </form>
  )
}
