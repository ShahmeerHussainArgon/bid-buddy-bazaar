
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getItemById } from '@/lib/data';
import { AuctionItem } from '@/lib/types';
import Navbar from '@/components/Navbar';
import BidControl from '@/components/BidControl';
import { cn } from '@/lib/utils';
import { 
  Clock, 
  User, 
  Star,
  ArrowLeft,
  Share2,
  Heart,
  Shield,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

const ItemDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<AuctionItem | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [isWishlist, setIsWishlist] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    if (id) {
      // In a real app, this would be an API call
      const auctionItem = getItemById(id);
      
      if (auctionItem) {
        setItem(auctionItem);
      }
      
      setLoading(false);
    }
  }, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-subtle">Loading...</div>
      </div>
    );
  }
  
  if (!item) {
    return (
      <div className="min-h-screen pt-24 px-4 md:px-6">
        <div className="auction-container text-center">
          <h2 className="text-2xl font-semibold mb-4">Item Not Found</h2>
          <p className="text-muted-foreground mb-6">The auction item you're looking for doesn't exist or may have been removed.</p>
          <Link to="/" className="auction-button-secondary">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 md:px-6">
        <div className="auction-container">
          {/* Navigation and actions */}
          <div className="flex justify-between items-center mb-6">
            <Link 
              to="/" 
              className="flex items-center text-sm font-medium hover:text-auction-accent transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              <span>Back to Auctions</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <button className="auction-button-outline text-sm flex items-center">
                <Share2 size={16} className="mr-2" />
                <span>Share</span>
              </button>
              
              <button 
                className={cn(
                  "auction-button-outline text-sm flex items-center",
                  isWishlist && "text-auction-accent border-auction-accent"
                )}
                onClick={() => setIsWishlist(!isWishlist)}
              >
                <Heart 
                  size={16} 
                  className={cn(
                    "mr-2",
                    isWishlist && "fill-auction-accent"
                  )} 
                />
                <span>Wishlist</span>
              </button>
            </div>
          </div>
          
          {/* Main content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Image gallery */}
            <div className="lg:col-span-2">
              <div className="bg-muted rounded-xl overflow-hidden mb-4 animate-fade-in">
                <img 
                  src={item.images[selectedImage]} 
                  alt={item.title} 
                  className="w-full aspect-[4/3] object-cover" 
                />
              </div>
              
              {item.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {item.images.map((image, index) => (
                    <button
                      key={index}
                      className={cn(
                        "rounded-lg overflow-hidden border-2 transition-all duration-200",
                        selectedImage === index 
                          ? "border-auction-accent" 
                          : "border-transparent hover:border-muted-foreground/30"
                      )}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img 
                        src={image} 
                        alt={`${item.title} - View ${index + 1}`} 
                        className="w-full aspect-square object-cover" 
                      />
                    </button>
                  ))}
                </div>
              )}
              
              {/* Item details */}
              <div className="mt-8">
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <span>{item.category}</span>
                  <span className="mx-2">•</span>
                  <Clock size={14} className="mr-1" />
                  <span>
                    {item.status === 'active' 
                      ? `Ends ${formatDistanceToNow(item.endTime, { addSuffix: true })}` 
                      : `Ended ${formatDistanceToNow(item.endTime, { addSuffix: true })}`
                    }
                  </span>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-semibold mb-4 animate-slide-in-left">
                  {item.title}
                </h1>
                
                <div className="flex items-center mb-6">
                  <div className="flex items-center bg-muted text-muted-foreground px-3 py-1.5 rounded-lg text-sm animate-slide-in-left" style={{ animationDelay: '100ms' }}>
                    <User size={14} className="mr-1" />
                    <span className="mr-1">Seller:</span>
                    <span className="font-medium text-foreground">{item.seller.name}</span>
                    <div className="flex items-center ml-2">
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      <span className="ml-1">{item.seller.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="prose prose-sm max-w-none mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
                
                {/* Auction details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
                  <div className="bg-auction rounded-xl p-4">
                    <h3 className="text-sm font-medium mb-3">Auction Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Starting Price</span>
                        <span className="font-medium">${item.startingPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current Bid</span>
                        <span className="font-medium">${item.currentBid || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bid Count</span>
                        <span className="font-medium">{item.bidCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Start Date</span>
                        <span className="font-medium">{format(item.startTime, 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">End Date</span>
                        <span className="font-medium">{format(item.endTime, 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-auction rounded-xl p-4">
                    <h3 className="text-sm font-medium mb-3">Shipping & Returns</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start">
                        <Truck size={16} className="mr-2 mt-0.5 text-muted-foreground" />
                        <span>Ships within 3 business days after payment</span>
                      </div>
                      <div className="flex items-start">
                        <Shield size={16} className="mr-2 mt-0.5 text-muted-foreground" />
                        <span>Returns accepted within 14 days</span>
                      </div>
                      <div className="flex items-start">
                        <ShieldCheck size={16} className="mr-2 mt-0.5 text-muted-foreground" />
                        <span>Buyer protection with secure payments</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bid history on mobile */}
                <div className="md:hidden mt-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
                  <h3 className="text-lg font-medium mb-3">Bid History</h3>
                  {item.bids.length > 0 ? (
                    <div className="bg-card border rounded-xl divide-y">
                      {item.bids.map((bid) => (
                        <div key={bid.id} className="p-3 flex justify-between items-center">
                          <div>
                            <div className="font-medium">${bid.amount}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatDistanceToNow(bid.timestamp, { addSuffix: true })}
                            </div>
                          </div>
                          <div className="text-sm">{bid.userId}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground">No bids yet</div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Bidding and history sidebar */}
            <div>
              {/* Bidding control */}
              <BidControl item={item} />
              
              {/* Bid history */}
              <div className="hidden md:block mt-8 animate-slide-in-right" style={{ animationDelay: '200ms' }}>
                <h3 className="text-lg font-medium mb-3">Bid History</h3>
                {item.bids.length > 0 ? (
                  <div className="bg-card border rounded-xl divide-y">
                    {item.bids.map((bid) => (
                      <div key={bid.id} className="p-3 flex justify-between items-center">
                        <div>
                          <div className="font-medium">${bid.amount}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(bid.timestamp, { addSuffix: true })}
                          </div>
                        </div>
                        <div className="text-sm">{bid.userId}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground">No bids yet</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
