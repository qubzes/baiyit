"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FeaturedProducts } from "@/components/featured-products";
import { CategoryGrid } from "@/components/category-grid";
import { BenefitSection } from "@/components/benefit-section";
import { ArrowRight, ShoppingBag, Zap, MessageSquare } from "lucide-react";

// Import the useAIAssistant hook
import { useAIAssistant } from "@/hooks/use-ai-assistant";

// Add this inside the HomePage component
export default function HomePage() {
  // Add this hook to access the openAssistant function
  const { openAssistant } = useAIAssistant();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-12 md:py-24 bg-gradient-to-r from-primary-navy to-primary-navy/90">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1556742208-999815fca738?q=80&w=2787')] bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Shop Smarter with AI
              </h1>
              <p className="text-lg text-white/80 mb-6">
                Baiyit combines traditional shopping with AI assistance to help
                you find exactly what you need.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <Button
                    size="lg"
                    className="bg-accent-sky hover:bg-accent-sky/90 text-white font-medium"
                  >
                    Browse Products
                    <ShoppingBag className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/10 text-white border-white hover:bg-white/20 font-medium"
                  onClick={openAssistant}
                >
                  Ask Baiyit
                  <MessageSquare className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="glass-panel p-4 rounded-2xl overflow-hidden transform rotate-3 shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=2070"
                  alt="Happy shopping experience"
                  width={600}
                  height={600}
                  className="rounded-xl"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-3 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3 max-w-xs">
                  <div className="bg-accent-sky rounded-full p-2">
                    <ShoppingBag className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-primary-navy">
                      Perfect match found!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile hero image */}
            <div className="md:hidden w-full max-w-xs mx-auto mt-6">
              <div className="glass-panel p-3 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=2070"
                  alt="Happy shopping experience"
                  width={400}
                  height={300}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of the page content remains the same */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary-navy mb-2">
                Shop by Category
              </h2>
              <p className="text-gray-600">
                Explore our wide selection of products
              </p>
            </div>
            <Link href="/products">
              <Button
                variant="ghost"
                className="text-accent-sky hover:text-accent-sky/80"
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <CategoryGrid />
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary-navy mb-2">
                Featured Products
              </h2>
              <p className="text-gray-600">
                Handpicked by our team and powered by AI recommendations
              </p>
            </div>
            <Link href="/products">
              <Button
                variant="ghost"
                className="text-accent-sky hover:text-accent-sky/80"
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <FeaturedProducts />
        </div>
      </section>

      {/* AI Assistant Promo */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-accent-sky/10 to-highlight-mint/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-navy mb-4">
                Shop with AI Assistance
              </h2>
              <p className="text-gray-700 mb-6">
                Our intelligent AI assistant is always ready to help you find
                the perfect products, answer your questions, and make your
                shopping experience seamless.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Ask questions about any product",
                  "Get personalized recommendations",
                  "Compare options side by side",
                  "Find the best deals and discounts",
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <div className="bg-accent-sky/20 p-1 rounded-full mr-3 mt-1">
                      <Zap className="h-4 w-4 text-accent-sky" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                size="lg"
                className="bg-primary-navy hover:bg-primary-navy/90"
                onClick={openAssistant}
              >
                Try Baiyit Assistant
                <MessageSquare className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <div className="relative">
                <div className="glass-panel p-4 rounded-2xl shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1887"
                    alt="AI Assistant"
                    width={300}
                    height={400}
                    className="rounded-xl"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-lg">
                  <div className="flex items-center space-x-4 max-w-xs">
                    <div className="bg-primary-navy rounded-full p-2">
                      <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-primary-navy">
                        I found the perfect laptop for you!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-navy mb-8 text-center">
            Why Shop with Baiyit
          </h2>
          <BenefitSection />
        </div>
      </section>
    </div>
  );
}
