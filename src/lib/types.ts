
export type AuctionStatus = 'active' | 'upcoming' | 'ended';

export interface Bid {
  id: string;
  userId: string;
  amount: number;
  timestamp: Date;
}

export interface AuctionItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  startingPrice: number;
  currentBid: number | null;
  bidCount: number;
  startTime: Date;
  endTime: Date;
  status: AuctionStatus;
  seller: {
    id: string;
    name: string;
    rating: number;
  };
  category: string;
  featured: boolean;
  bids: Bid[];
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  rating: number;
}
