export type Category = 
  | 'All Delights'
  | 'Cakes'
  | 'Cupcakes'
  | 'Cookies'
  | 'Brownies'
  | 'Pastries'
  | 'Macarons'
  | 'Croissants'
  | 'Signature Cakes'
  | 'Tarts'
  | 'Vegan';

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  image: string;
  bannerImage?: string;
  badge?: 'New Arrival' | 'Best Seller' | 'Chef Choice' | 'Limited Edition';
  tag?: string; // e.g. "Indulgent", "Seasonal", "Classic"
  subtitle?: string; // e.g. "Signature Artisanal Series", "Daily Small Batch"
  features?: string[]; // e.g. ["Box of 6", "Seasonal Flavors", "Gift Ready"]
  ingredients?: string;
  personalization?: string;
  pairsWithIds?: string[]; // IDs of products to suggest pairing with
  isChefSelection?: boolean;
  chefTag?: string;
  chefActionText?: string;
  calories?: number;
  allergens?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type ActiveScreen = 'home' | 'products' | 'detail' | 'cart' | 'assistant';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedProducts?: Product[];
}
