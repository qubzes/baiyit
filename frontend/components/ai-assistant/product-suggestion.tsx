"use client";

import Image from "next/image";

import type { Product } from "@/types/product";
import { useAIAssistant } from "@/hooks/use-ai-assistant";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProductSuggestionProps {
  product: Product;
}

export function ProductSuggestion({ product }: ProductSuggestionProps) {
  const { selectProduct } = useAIAssistant();

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 200px"
        />
      </div>
      <CardContent className="p-3">
        <div className="mb-2 line-clamp-1 font-medium">{product.name}</div>
        <div className="mb-2 text-sm font-bold">
          ${product.price.toFixed(2)}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => selectProduct(product)}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
