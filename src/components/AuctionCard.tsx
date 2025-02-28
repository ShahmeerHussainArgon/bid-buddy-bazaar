
import { Link } from 'react-router-dom';
import { AuctionItem } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Heart, Clock } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AuctionCardProps {
  item: AuctionItem;
  featured?: boolean;
}

const AuctionCard = ({ item, featured = false }: AuctionCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const timeLeft = formatDistanceToNow(item.endTime, { addSuffix: true });
  const isEnding = new Date(item.endTime).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000;
  
  return (
    <div 
      className={cn(
        'auction-card group animate-fade-in', 
        featured ? 'col-span-2 md:col-span-2' : 'col-span-2 md:col-span-1', 
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <Link to={`/item/${item.id}`}>
          <div className="aspect-square md:aspect-[4/3] overflow-hidden bg-muted">
            <img 
              src={item.images[0]} 
              alt={item.title} 
              className={cn(
                "h-full w-full object-cover transition-all duration-500",
                isHovered ? "scale-105" : "scale-100"
              )}
            />
          </div>
        </Link>
        
        <button 
          className={cn(
            "absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300",
            isFavorite 
              ? "bg-auction-accent text-white" 
              : "bg-white/80 text-foreground/70 hover:bg-white hover:text-auction-accent"
          )}
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <Heart 
            size={18} 
            className={isFavorite ? "fill-current" : ""}
          />
        </button>
        
        {isEnding && (
          <div className="absolute bottom-3 left-3 bg-auction-accent text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
            <Clock size={12} />
            <span>Ending Soon</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="text-xs text-muted-foreground">{item.category}</div>
            <Link to={`/item/${item.id}`} className="group-hover:text-auction-accent transition-colors">
              <h3 className="font-medium text-base md:text-lg line-clamp-1">{item.title}</h3>
            </Link>
          </div>
        </div>
        
        <div className="flex justify-between items-end mt-3">
          <div>
            <div className="text-xs text-muted-foreground">Current Bid</div>
            <div className="text-lg md:text-xl font-semibold">${item.currentBid || item.startingPrice}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground flex items-center space-x-1">
              <Clock size={12} />
              <span>{timeLeft}</span>
            </div>
            <div className="text-xs text-muted-foreground">{item.bidCount} bids</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
