"use client"

import { useBag as useContextBag } from "@/contexts/bag-context"

export function useBag() {
  return useContextBag()
}
