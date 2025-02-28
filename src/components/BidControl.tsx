
import { useState, useEffect } from 'react';
import { AuctionItem } from '@/lib/types';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from "@/components/ui/use-toast";

interface BidControlProps {
  item: AuctionItem;
}

const BidControl = ({ item }: BidControlProps) => {
  const [bidAmount, setBidAmount] = useState<number>(
    (item.currentBid || item.startingPrice) + 10
  );
  const [timeLeft, setTimeLeft] = useState<string>('');
  const { toast } = useToast();
  
  useEffect(() => {
    // Initial time calculation
    updateTimeLeft();
    
    // Update time left every minute
    const interval = setInterval(updateTimeLeft, 60000);
    return () => clearInterval(interval);
  }, [item]);
  
  const updateTimeLeft = () => {
    setTimeLeft(formatDistanceToNow(item.endTime, { addSuffix: true }));
  };
  
  const incrementBid = () => {
    setBidAmount(prev => prev + 10);
  };
  
  const decrementBid = () => {
    if (bidAmount > (item.currentBid || item.startingPrice) + 5) {
      setBidAmount(prev => prev - 10);
    }
  };
  
  const handleBidSubmit = () => {
    if (bidAmount <= (item.currentBid || item.startingPrice)) {
      toast({
        title: "Bid too low",
        description: "Your bid must be higher than the current bid.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would submit the bid to the server
    toast({
      title: "Bid placed!",
      description: `You've successfully bid $${bidAmount} on "${item.title}".`,
    });
  };
  
  const isActive = item.status === 'active';
  const minBid = (item.currentBid || item.startingPrice) + 5;
  
  return (
    <div className="bg-card border rounded-xl p-5 animate-slide-in-right shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="text-sm text-muted-foreground">Current Bid</div>
          <div className="text-2xl font-semibold">${item.currentBid || item.startingPrice}</div>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock size={16} className="mr-2" />
          <span>{timeLeft}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">Your Bid</div>
        <div className="text-xs text-muted-foreground">Min. Bid: ${minBid}</div>
      </div>
      
      <div className="flex items-center mb-5">
        <div className="relative flex-1">
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(Number(e.target.value))}
            className="auction-input pr-12"
            min={minBid}
            step={5}
            disabled={!isActive}
          />
          <span className="absolute right-12 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
          
          <div className="absolute right-0 top-0 h-full flex flex-col">
            <button 
              className="h-1/2 px-3 flex items-center justify-center text-muted-foreground hover:text-foreground"
              onClick={incrementBid}
              disabled={!isActive}
            >
              <ChevronUp size={16} />
            </button>
            <button 
              className="h-1/2 px-3 flex items-center justify-center text-muted-foreground hover:text-foreground"
              onClick={decrementBid}
              disabled={!isActive || bidAmount <= minBid}
            >
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </div>
      
      <button
        className={cn(
          "w-full py-3 rounded-lg font-medium transition-all duration-200",
          isActive 
            ? "bg-auction-accent text-white hover:bg-auction-accent/90" 
            : "bg-muted text-muted-foreground cursor-not-allowed"
        )}
        onClick={handleBidSubmit}
        disabled={!isActive}
      >
        {isActive ? "Place Bid" : "Auction Ended"}
      </button>
      
      <div className="mt-5 text-center text-sm text-muted-foreground">
        {item.bidCount} bids so far
      </div>
      
      {/* Additional bidding information */}
      <div className="mt-5 pt-5 border-t">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Starting Price</span>
          <span className="font-medium">${item.startingPrice}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Item Category</span>
          <span className="font-medium">{item.category}</span>
        </div>
      </div>
    </div>
  );
};

export default BidControl;
