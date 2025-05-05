"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  Share2,
  ShoppingCart,
  Star,
  ChevronRight,
  Truck,
  RotateCw,
  Shield,
  MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProducts } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import { useAIAssistant } from "@/hooks/use-ai-assistant";
import { useMobile } from "@/hooks/use-mobile";
import Link from "next/link";

export default function ProductPage() {
  const params = useParams();
  const productId = params?.id as string;
  const { products } = useProducts();
  const { addItem } = useCart();
  const { updateContextInfo, openAssistant } = useAIAssistant();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const isMobile = useMobile();

  // Find the product with the matching ID
  const product = products.find((p) => p.id === productId);

  // Update AI context when product changes
  useEffect(() => {
    if (product) {
      updateContextInfo({
        page: "product",
        path: `/products/${productId}`,
        data: product,
      });
    }
  }, [product, productId, updateContextInfo]);

  // Handle direct loading when product might not be immediately available
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>

              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link
            href="/products"
            className="text-gray-600 hover:text-primary-navy flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Product Images */}
          <div>
            <motion.div
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="aspect-square relative">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>

          {/* Product Info */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold text-primary-navy mb-2">
              {product.title}
            </h1>

            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating} ({Math.floor(Math.random() * 500) + 50}{" "}
                reviews)
              </span>
            </div>

            <div className="flex items-baseline mb-6">
              <span className="text-2xl md:text-3xl font-bold text-primary-navy">
                ${product.price.toFixed(2)}
              </span>

              {product.originalPrice && (
                <>
                  <span className="text-base md:text-lg text-gray-500 line-through ml-3">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className="ml-3 bg-accent-sky/10 text-accent-sky text-sm font-medium px-2 py-1 rounded">
                    {product.discount}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-700 mb-6">{product.description}</p>

            {/* Specs List */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-primary-navy mb-2">
                Key Features
              </h3>
              <ul className="space-y-2">
                {product.specs?.map((spec, index) => (
                  <li key={index} className="flex items-start">
                    <ChevronRight className="h-4 w-4 text-accent-sky mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center mb-6">
              <span className="text-gray-700 mr-4">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  className="px-3 py-1 border-r border-gray-300"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="px-4 py-1">{quantity}</span>
                <button
                  className="px-3 py-1 border-l border-gray-300"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Button
                className="flex-1 bg-primary-navy hover:bg-primary-navy/90 py-6"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-[52px] w-[52px]"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart
                  className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
                />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-[52px] w-[52px]"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Ask AI Button */}
            <Button
              className="w-full mb-6 bg-accent-sky hover:bg-accent-sky/90 py-6"
              onClick={openAssistant}
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Ask Baiyit About This Product
            </Button>

            {/* Shipping Info */}
            <div className="space-y-3 mb-8">
              <div className="flex items-start">
                <Truck className="h-5 w-5 text-accent-sky mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-primary-navy">
                    Free Shipping
                  </h4>
                  <p className="text-sm text-gray-600">
                    On orders over $50. Estimated delivery: 3-5 business days
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <RotateCw className="h-5 w-5 text-accent-sky mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-primary-navy">
                    30-Day Returns
                  </h4>
                  <p className="text-sm text-gray-600">
                    Return or exchange within 30 days
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Shield className="h-5 w-5 text-accent-sky mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-primary-navy">Warranty</h4>
                  <p className="text-sm text-gray-600">
                    1 year limited warranty
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-medium text-primary-navy mb-4">
                  Product Description
                </h3>
                <p className="text-gray-700 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam in metus at justo malesuada consequat. Cras varius
                  ipsum vel semper egestas. Proin ac egestas lorem, a tincidunt
                  enim. Vivamus varius rhoncus ex, nec venenatis erat lacinia
                  vel.
                </p>
                <p className="text-gray-700 mb-4">
                  Phasellus ut ex at nulla iaculis rhoncus. Aliquam erat
                  volutpat. Nulla facilisi. Sed in eros nec neque efficitur
                  tincidunt. Nulla facilisi. Proin consequat, magna vel
                  convallis convallis, nisi nulla fermentum enim, vel lacinia
                  neque libero at lacus.
                </p>
                <p className="text-gray-700">
                  Fusce vel dolor eget tortor dignissim interdum. Praesent
                  tempor auctor nisl, eu lobortis sem tempus eget. Integer ut
                  odio risus. Integer pretium imperdiet nisl, vel mollis sem
                  tempus eget.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-medium text-primary-navy mb-4">
                  Technical Specifications
                </h3>
                <table className="w-full border-collapse">
                  <tbody>
                    {/* Dynamically generate based on product category */}
                    {[
                      { label: "Model", value: `${product.title} (2023)` },
                      { label: "Dimensions", value: "12.3 x 8.7 x 0.7 inches" },
                      { label: "Weight", value: "3.2 pounds" },
                      { label: "Warranty", value: "1 Year Limited Warranty" },
                      ...(product.specs?.map((spec) => {
                        const parts = spec.split(":");
                        return {
                          label: parts[0] || spec,
                          value: parts.length > 1 ? parts[1].trim() : "",
                        };
                      }) || []),
                    ].map((spec, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                        <td className="py-3 px-4 font-medium text-primary-navy">
                          {spec.label}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {spec.value || spec.label}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-medium text-primary-navy mb-4">
                  Customer Reviews
                </h3>
                <p className="text-gray-700">
                  Reviews would be displayed here.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="faq" className="mt-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-medium text-primary-navy mb-4">
                  Frequently Asked Questions
                </h3>
                <p className="text-gray-700">
                  FAQ content would be displayed here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
