"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useProducts } from "@/hooks/use-products";
import { CategoryFilter } from "@/components/category-filter";
import { ProductsGrid } from "@/components/products-grid";

export default function ProductsClientPage({
  initialCategory,
  initialSearch,
}: {
  initialCategory?: string;
  initialSearch?: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [category, setCategory] = useState(initialCategory || "all");
  const [search, setSearch] = useState(initialSearch || "");

  const { products, isLoading } = useProducts();

  // Filter products based on category and search
  const filteredProducts = products?.filter((product) => {
    const matchesCategory = category === "all" || product.category === category;
    const matchesSearch =
      !search ||
      product.title.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Update URL when category changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (category && category !== "all") {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.push(`/products${newUrl}`, { scroll: false });
  }, [category, search, router, searchParams]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Products</h1>

      <div className="mb-8">
        <CategoryFilter
          selectedCategory={category}
          onCategoryChange={setCategory}
        />
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredProducts && filteredProducts.length > 0 ? (
        <ProductsGrid products={filteredProducts} />
      ) : (
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <h3 className="text-xl font-medium">No products found</h3>
          <p className="mt-2 text-muted-foreground">
            Try changing your search or category filters
          </p>
        </div>
      )}
    </div>
  );
}
