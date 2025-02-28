
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import FeaturedAuction from '@/components/FeaturedAuction';
import AuctionCard from '@/components/AuctionCard';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import { getFeaturedItems, getActiveItems, searchItems, getItemsByCategory } from '@/lib/data';
import { AuctionItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const [featuredItems, setFeaturedItems] = useState<AuctionItem[]>([]);
  const [auctionItems, setAuctionItems] = useState<AuctionItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    // Get featured items
    setFeaturedItems(getFeaturedItems());
    
    // Initial items
    setAuctionItems(getActiveItems());
  }, []);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query) {
      setAuctionItems(searchItems(query));
      setSelectedCategory(null);
    } else if (selectedCategory) {
      setAuctionItems(getItemsByCategory(selectedCategory));
    } else {
      setAuctionItems(getActiveItems());
    }
  };
  
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    
    if (category) {
      setAuctionItems(getItemsByCategory(category));
      setSearchQuery('');
    } else {
      setAuctionItems(getActiveItems());
    }
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero section with featured auction */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 px-4 md:px-6">
        <div className="auction-container">
          {featuredItems.length > 0 && (
            <FeaturedAuction item={featuredItems[0]} />
          )}
        </div>
      </section>
      
      {/* Search and filter section */}
      <section className="py-8 px-4 md:px-6">
        <div className="auction-container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold mb-2">Active Auctions</h2>
              <p className="text-muted-foreground">Discover unique items and place your bids</p>
            </div>
            
            <SearchBar onSearch={handleSearch} />
          </div>
          
          <CategoryFilter 
            selectedCategory={selectedCategory} 
            onSelect={handleCategorySelect}
          />
          
          {/* Display search results */}
          {searchQuery && (
            <div className="mb-8 animate-fade-in">
              <h3 className="text-lg font-medium mb-4">
                Search results for "{searchQuery}"
              </h3>
              {auctionItems.length === 0 && (
                <p className="text-muted-foreground">No items found matching your search.</p>
              )}
            </div>
          )}
          
          {/* Auction items grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {auctionItems.map((item) => (
              <AuctionCard key={item.id} item={item} />
            ))}
          </div>
          
          {/* More items link */}
          <div className="mt-12 text-center">
            <Link 
              to="/categories" 
              className={cn(
                "auction-button-secondary inline-flex items-center",
                "hover:text-auction-accent transition-colors duration-300"
              )}
            >
              <span>View All Categories</span>
              <ArrowRight size={18} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* How it works section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-auction">
        <div className="auction-container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">How BidFlow Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple, secure, and transparent bidding process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background rounded-xl p-6 text-center shadow-sm animate-fade-in" style={{ animationDelay: '0ms' }}>
              <div className="w-12 h-12 bg-auction-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-semibold">1</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Browse Auctions</h3>
              <p className="text-muted-foreground">
                Explore our curated collection of unique items across various categories.
              </p>
            </div>
            
            <div className="bg-background rounded-xl p-6 text-center shadow-sm animate-fade-in" style={{ animationDelay: '150ms' }}>
              <div className="w-12 h-12 bg-auction-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-semibold">2</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Place Your Bid</h3>
              <p className="text-muted-foreground">
                Set your maximum bid and let our system automatically bid for you up to your limit.
              </p>
            </div>
            
            <div className="bg-background rounded-xl p-6 text-center shadow-sm animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="w-12 h-12 bg-auction-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-semibold">3</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Win & Collect</h3>
              <p className="text-muted-foreground">
                If you're the highest bidder when the auction ends, the item is yours to collect.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured categories preview */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="auction-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold mb-2">Featured Categories</h2>
              <p className="text-muted-foreground">Explore our most popular categories</p>
            </div>
            
            <Link 
              to="/categories" 
              className="text-sm font-medium flex items-center hover:text-auction-accent transition-colors"
            >
              <span>View All</span>
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Electronics', 'Art', 'Collectibles', 'Jewelry'].map((category) => (
              <Link 
                key={category} 
                to={`/categories`}
                className="rounded-xl bg-auction-muted p-6 text-center flex flex-col items-center justify-center aspect-square transition-all duration-300 hover:bg-auction-muted/80 animate-fade-in"
                onClick={() => handleCategorySelect(category)}
              >
                <h3 className="text-lg font-medium mb-2">{category}</h3>
                <p className="text-sm text-muted-foreground">
                  Explore auctions
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 md:py-12 px-4 md:px-6 border-t">
        <div className="auction-container">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold">BidFlow</h2>
            <p className="text-muted-foreground mt-2">Discover, Bid, Win</p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center md:space-x-8 space-y-4 md:space-y-0 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/categories" className="text-muted-foreground hover:text-foreground transition-colors">
              Categories
            </Link>
            <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
          </div>
          
          <div className="mt-8 text-center text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} BidFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
