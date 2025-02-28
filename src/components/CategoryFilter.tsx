
import { categories } from '@/lib/data';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelect: (category: string | null) => void;
}

const CategoryFilter = ({ selectedCategory, onSelect }: CategoryFilterProps) => {
  return (
    <div className="mb-8 animate-fade-in">
      <h3 className="text-sm font-medium mb-3 text-muted-foreground">Categories</h3>
      <div className="flex flex-wrap gap-2">
        <button
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200",
            selectedCategory === null
              ? "bg-auction-accent text-white"
              : "bg-muted hover:bg-muted/80 text-muted-foreground"
          )}
          onClick={() => onSelect(null)}
        >
          All
        </button>
        
        {categories.map((category) => (
          <button
            key={category.id}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200",
              selectedCategory === category.name
                ? "bg-auction-accent text-white"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            )}
            onClick={() => onSelect(category.name)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
