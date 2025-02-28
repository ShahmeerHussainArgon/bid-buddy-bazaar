
import { AuctionItem } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface FeaturedAuctionProps {
  item: AuctionItem;
}

const FeaturedAuction = ({ item }: FeaturedAuctionProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const timeLeft = formatDistanceToNow(item.endTime, { addSuffix: true });
  
  return (
    <div 
      className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
      
      <img 
        src={item.images[0]} 
        alt={item.title} 
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-transform duration-[2s]",
          isHovered ? "scale-105" : "scale-100"
        )}
      />
      
      <div className="absolute top-6 left-6 z-20">
        <div className="text-xs font-medium uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white/90">
          Featured
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20">
        <div className="mb-1 text-white/80">{item.category}</div>
        <h2 className="text-2xl md:text-4xl font-semibold text-white mb-4">{item.title}</h2>
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-white/70 text-sm mb-1">Current Bid</div>
            <div className="text-2xl md:text-3xl font-bold text-white">${item.currentBid || item.startingPrice}</div>
          </div>
          
          <div className="flex items-center text-white/80 text-sm">
            <Clock size={16} className="mr-2" />
            <span>Auction ends {timeLeft}</span>
          </div>
        </div>
        
        <Link 
          to={`/item/${item.id}`}
          className={cn(
            "auction-button-primary inline-flex items-center",
            "bg-white text-auction-foreground hover:bg-white/90"
          )}
        >
          <span>Bid Now</span>
          <ArrowRight size={18} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
      
      {/* Abstract animated background decoration */}
      <div 
        className="fancy-blur absolute -top-20 -right-20 bg-auction-accent/30 animate-spin-slow" 
        style={{ animationDelay: '-3s' }}
      />
      <div 
        className="fancy-blur absolute -bottom-20 -left-20 bg-white/20 animate-spin-slow" 
        style={{ animationDirection: 'reverse', animationDelay: '-7s' }}
      />
    </div>
  );
};

export default FeaturedAuction;
