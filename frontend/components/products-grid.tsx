import type { Product } from "@/types/product";
import { ProductCard } from "@/components/product-card";

interface ProductsGridProps {
  products: Product[];
}

export function ProductsGrid({ products }: ProductsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
