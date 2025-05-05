import { Suspense } from "react";
import type { Metadata } from "next";

import ProductsClientPage from "./ProductsClientPage";

export const metadata: Metadata = {
  title: "Products | Baiyit",
  description: "Browse our collection of luxury products",
};

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsClientPage
        initialCategory={searchParams.category}
        initialSearch={searchParams.search}
      />
    </Suspense>
  );
}
