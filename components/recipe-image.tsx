"use client";

import Image from "next/image";
import { useState } from "react";

interface RecipeImageProps {
  src: string | undefined;
  alt: string;
}

export function RecipeImage({ src, alt }: RecipeImageProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-muted-foreground">No image available</span>
      </div>
    );
  }

  // Use regular img tag for external images
  if (src.startsWith("http")) {
    return (
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={500}
        height={500}
        className="absolute inset-0 w-full h-full object-cover"
        onError={() => setError(true)}
      />
    );
  }

  // Use Next.js Image for internal images
  return (
    <Image
      src={src || "/placeholder.svg"}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, 50vw"
      className="object-cover"
      priority
      onError={() => setError(true)}
    />
  );
}
