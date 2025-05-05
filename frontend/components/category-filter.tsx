"use client";

import { Button } from "@/components/ui/button";

const categories = [
  { id: "all", name: "All Products" },
  { id: "clothing", name: "Clothing" },
  { id: "accessories", name: "Accessories" },
  { id: "footwear", name: "Footwear" },
  { id: "jewelry", name: "Jewelry" },
  { id: "watches", name: "Watches" },
];

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({
  selectedCategory = "all",
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.id)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}
