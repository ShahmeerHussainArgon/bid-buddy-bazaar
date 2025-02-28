
import { AuctionItem, Category, User } from './types';

// Mock users
export const users: User[] = [
  {
    id: 'user1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: '/placeholder.svg',
    rating: 4.8,
  },
  {
    id: 'user2',
    name: 'Sam Rodriguez',
    email: 'sam@example.com',
    avatar: '/placeholder.svg',
    rating: 4.9,
  },
  {
    id: 'user3',
    name: 'Jordan Lee',
    email: 'jordan@example.com',
    avatar: '/placeholder.svg',
    rating: 4.7,
  },
];

// Mock categories
export const categories: Category[] = [
  { id: 'cat1', name: 'Electronics' },
  { id: 'cat2', name: 'Art' },
  { id: 'cat3', name: 'Collectibles' },
  { id: 'cat4', name: 'Fashion' },
  { id: 'cat5', name: 'Home & Garden' },
  { id: 'cat6', name: 'Jewelry' },
];

// Helper function to create dates relative to now
const daysFromNow = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const hoursFromNow = (hours: number): Date => {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  return date;
};

// Mock auction items
export const auctionItems: AuctionItem[] = [
  {
    id: 'item1',
    title: 'Vintage Polaroid Camera',
    description: 'A beautifully preserved vintage Polaroid camera from the 1970s. Perfect working condition with original case and manual.',
    images: ['/placeholder.svg'],
    startingPrice: 50,
    currentBid: 120,
    bidCount: 8,
    startTime: daysFromNow(-3),
    endTime: daysFromNow(2),
    status: 'active',
    seller: users[0],
    category: 'Electronics',
    featured: true,
    bids: [
      { id: 'bid1', userId: 'user2', amount: 120, timestamp: hoursFromNow(-5) },
      { id: 'bid2', userId: 'user3', amount: 110, timestamp: hoursFromNow(-6) },
      { id: 'bid3', userId: 'user2', amount: 100, timestamp: hoursFromNow(-7) },
    ],
  },
  {
    id: 'item2',
    title: 'Modern Abstract Painting',
    description: 'Original acrylic painting on canvas. Signed by the artist. Size: 30" x 40".',
    images: ['/placeholder.svg'],
    startingPrice: 200,
    currentBid: 350,
    bidCount: 5,
    startTime: daysFromNow(-5),
    endTime: daysFromNow(1),
    status: 'active',
    seller: users[1],
    category: 'Art',
    featured: true,
    bids: [
      { id: 'bid4', userId: 'user1', amount: 350, timestamp: hoursFromNow(-2) },
      { id: 'bid5', userId: 'user3', amount: 300, timestamp: hoursFromNow(-10) },
    ],
  },
  {
    id: 'item3',
    title: 'Vintage Mechanical Watch',
    description: 'Rare mechanical watch from the 1960s. Recently serviced, keeps perfect time. Includes original box.',
    images: ['/placeholder.svg'],
    startingPrice: 1000,
    currentBid: 1250,
    bidCount: 7,
    startTime: daysFromNow(-7),
    endTime: daysFromNow(0.5),
    status: 'active',
    seller: users[2],
    category: 'Collectibles',
    featured: false,
    bids: [
      { id: 'bid6', userId: 'user1', amount: 1250, timestamp: hoursFromNow(-1) },
      { id: 'bid7', userId: 'user2', amount: 1200, timestamp: hoursFromNow(-8) },
    ],
  },
  {
    id: 'item4',
    title: 'Designer Handbag',
    description: 'Authentic designer handbag, gently used. Comes with dust bag and authenticity card.',
    images: ['/placeholder.svg'],
    startingPrice: 500,
    currentBid: 650,
    bidCount: 4,
    startTime: daysFromNow(-2),
    endTime: daysFromNow(3),
    status: 'active',
    seller: users[0],
    category: 'Fashion',
    featured: false,
    bids: [
      { id: 'bid8', userId: 'user3', amount: 650, timestamp: hoursFromNow(-4) },
      { id: 'bid9', userId: 'user1', amount: 600, timestamp: hoursFromNow(-12) },
    ],
  },
  {
    id: 'item5',
    title: 'Antique Ceramic Vase',
    description: 'Beautiful hand-painted ceramic vase from the early 20th century. Perfect condition with no chips or cracks.',
    images: ['/placeholder.svg'],
    startingPrice: 100,
    currentBid: 180,
    bidCount: 9,
    startTime: daysFromNow(-4),
    endTime: daysFromNow(1.5),
    status: 'active',
    seller: users[1],
    category: 'Home & Garden',
    featured: false,
    bids: [
      { id: 'bid10', userId: 'user2', amount: 180, timestamp: hoursFromNow(-3) },
      { id: 'bid11', userId: 'user3', amount: 160, timestamp: hoursFromNow(-9) },
    ],
  },
  {
    id: 'item6',
    title: 'Diamond Pendant Necklace',
    description: '14k white gold necklace with 0.5 carat diamond pendant. Certified and appraised.',
    images: ['/placeholder.svg'],
    startingPrice: 800,
    currentBid: 950,
    bidCount: 3,
    startTime: daysFromNow(-1),
    endTime: daysFromNow(4),
    status: 'active',
    seller: users[2],
    category: 'Jewelry',
    featured: true,
    bids: [
      { id: 'bid12', userId: 'user1', amount: 950, timestamp: hoursFromNow(-6) },
      { id: 'bid13', userId: 'user2', amount: 900, timestamp: hoursFromNow(-11) },
    ],
  },
  {
    id: 'item7',
    title: 'Vintage Record Player',
    description: 'Fully restored vintage record player from the 1960s. Beautiful sound quality.',
    images: ['/placeholder.svg'],
    startingPrice: 300,
    currentBid: 450,
    bidCount: 10,
    startTime: daysFromNow(-6),
    endTime: daysFromNow(0.2),
    status: 'active',
    seller: users[0],
    category: 'Electronics',
    featured: false,
    bids: [
      { id: 'bid14', userId: 'user3', amount: 450, timestamp: hoursFromNow(-2) },
      { id: 'bid15', userId: 'user1', amount: 420, timestamp: hoursFromNow(-13) },
    ],
  },
  {
    id: 'item8',
    title: 'Limited Edition Sneakers',
    description: 'Rare limited edition sneakers, brand new in box. Size 10. Only 500 pairs made worldwide.',
    images: ['/placeholder.svg'],
    startingPrice: 150,
    currentBid: 320,
    bidCount: 15,
    startTime: daysFromNow(-5),
    endTime: daysFromNow(0.8),
    status: 'active',
    seller: users[1],
    category: 'Fashion',
    featured: false,
    bids: [
      { id: 'bid16', userId: 'user2', amount: 320, timestamp: hoursFromNow(-1) },
      { id: 'bid17', userId: 'user3', amount: 300, timestamp: hoursFromNow(-7) },
    ],
  },
];

// Filter functions
export const getFeaturedItems = (): AuctionItem[] => {
  return auctionItems.filter(item => item.featured);
};

export const getItemsByCategory = (category: string): AuctionItem[] => {
  return auctionItems.filter(item => item.category === category);
};

export const getItemById = (id: string): AuctionItem | undefined => {
  return auctionItems.find(item => item.id === id);
};

export const getActiveItems = (): AuctionItem[] => {
  return auctionItems.filter(item => item.status === 'active');
};

export const searchItems = (query: string): AuctionItem[] => {
  const lowercaseQuery = query.toLowerCase();
  return auctionItems.filter(item => 
    item.title.toLowerCase().includes(lowercaseQuery) || 
    item.description.toLowerCase().includes(lowercaseQuery)
  );
};
