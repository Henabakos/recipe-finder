"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ItalicIcon as AlphabetIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrowseByLetter() {
  const router = useRouter();
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const handleLetterClick = (letter: string) => {
    router.push(`/search?letter=${letter.toLowerCase()}`);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
          <AlphabetIcon className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">
          Browse Recipes by First Letter
        </h2>
        <p className="text-muted-foreground max-w-2xl">
          Explore our recipe collection alphabetically. Click on any letter to
          see all recipes that start with it.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {alphabet.map((letter) => (
          <Button
            key={letter}
            variant="outline"
            size="sm"
            onClick={() => handleLetterClick(letter)}
            className={cn(
              "w-10 h-10 p-0 rounded-md transition-colors",
              "hover:bg-primary/10 hover:text-primary",
              "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              "active:scale-95"
            )}
          >
            {letter}
          </Button>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Can&apos t find what you&aposre looking for? Try our{" "}
          <Button
            variant="link"
            className="p-0 h-auto font-medium"
            onClick={() => router.push("/search")}
          >
            advanced search
          </Button>
        </p>
      </div>
    </div>
  );
}
