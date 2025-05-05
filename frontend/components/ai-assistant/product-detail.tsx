"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import type { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const handleViewProduct = () => {
    router.push(`/products/${product.id}`);
  };

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 350px"
        />
      </div>

      <div>
        <h3 className="text-lg font-medium">{product.name}</h3>
        <p className="text-xl font-bold">${product.price.toFixed(2)}</p>
      </div>

      <p className="text-sm text-muted-foreground">{product.description}</p>

      <div className="flex flex-col space-y-2">
        <Button onClick={handleViewProduct}>View Details</Button>
        <Button variant="outline" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
