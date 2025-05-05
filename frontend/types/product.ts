export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  rating: number;
  category?: string;
  featured?: boolean;
  specs?: string[];
}
