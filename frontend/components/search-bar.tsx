"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  onClose?: () => void;
}

export function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      if (onClose) {
        onClose();
      }
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative">
        <Input
          type="search"
          placeholder="Search for products, brands, and more..."
          className="w-full rounded-full pl-5 pr-12 py-6 border-2 border-gray-200 focus-visible:ring-accent-sky"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-accent-sky hover:bg-accent-sky/90 rounded-full"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
}
