"use client";

import { useState, useEffect } from "react";
import type { Acquisition } from "@/types/acquisition";

export function useAcquisitions() {
  const [acquisitions, setAcquisitions] = useState<Acquisition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchAcquisitions = async () => {
      setIsLoading(true);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data
      const mockAcquisitions: Acquisition[] = [
        {
          id: "ACQ-1234",
          date: "2023-04-15T10:30:00Z",
          total: 1299.99,
          status: "Delivered",
          items: [
            {
              id: "laptop-1",
              title: "UltraBook Pro 16",
              price: 1299.99,
              quantity: 1,
              image: "/placeholder.svg?height=100&width=100",
            },
          ],
        },
        {
          id: "ACQ-5678",
          date: "2023-03-22T14:45:00Z",
          total: 249.97,
          status: "Shipped",
          items: [
            {
              id: "audio-1",
              title: "SoundMaster Pro",
              price: 199.99,
              quantity: 1,
              image: "/placeholder.svg?height=100&width=100",
            },
            {
              id: "accessory-1",
              title: "Wireless Charging Pad",
              price: 49.98,
              quantity: 1,
              image: "/placeholder.svg?height=100&width=100",
            },
          ],
        },
        {
          id: "ACQ-9012",
          date: "2023-02-10T09:15:00Z",
          total: 999.99,
          status: "Delivered",
          items: [
            {
              id: "phone-2",
              title: "iPhone 14 Pro",
              price: 999.99,
              quantity: 1,
              image: "/placeholder.svg?height=100&width=100",
            },
          ],
        },
      ];

      setAcquisitions(mockAcquisitions);
      setIsLoading(false);
    };

    fetchAcquisitions();
  }, []);

  return { acquisitions, isLoading };
}
