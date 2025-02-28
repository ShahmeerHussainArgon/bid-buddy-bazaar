
import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
}

const SearchBar = ({ onSearch, className }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };
  
  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };
  
  return (
    <form 
      onSubmit={handleSearch} 
      className={cn(
        "relative w-full max-w-lg group animate-fade-in",
        className
      )}
    >
      <div 
        className={cn(
          "relative transition-all duration-300 rounded-xl",
          isFocused ? "shadow-md" : ""
        )}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for items..."
          className={cn(
            "w-full bg-card h-12 pl-12 pr-4 rounded-xl border",
            "focus:outline-none focus:ring-1 focus:ring-auction-accent transition-all duration-300",
            isFocused ? "border-auction-accent" : "border-input"
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={20} className={cn(
            "text-muted-foreground transition-colors duration-300", 
            isFocused ? "text-auction-accent" : ""
          )} />
        </div>
        
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X size={18} className="text-muted-foreground hover:text-foreground transition-colors" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
