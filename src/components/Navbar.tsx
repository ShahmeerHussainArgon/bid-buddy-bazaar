
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const closeMobileMenu = () => setMobileMenuOpen(false);
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Categories', path: '/categories' },
    { name: 'Featured', path: '/featured' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-6',
        isScrolled 
          ? 'py-3 glass-effect shadow-sm' 
          : 'py-5 bg-transparent'
      )}
    >
      <div className="auction-container">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-semibold tracking-tight">
            BidFlow
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-auction-accent',
                  location.pathname === link.path 
                    ? 'text-auction-accent' 
                    : 'text-foreground/80'
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-5">
            <button className="h-9 w-9 rounded-full flex items-center justify-center bg-muted/80 text-muted-foreground hover:bg-muted transition-colors">
              <Search size={20} />
            </button>
            <button className="h-9 w-9 rounded-full flex items-center justify-center bg-muted/80 text-muted-foreground hover:bg-muted transition-colors">
              <Heart size={20} />
            </button>
            <button className="h-9 w-9 rounded-full flex items-center justify-center bg-muted/80 text-muted-foreground hover:bg-muted transition-colors">
              <ShoppingBag size={20} />
            </button>
            
            <button 
              className="md:hidden h-9 w-9 rounded-full flex items-center justify-center bg-muted/80 text-muted-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div 
        className={cn(
          'md:hidden fixed inset-0 z-50 glass-effect transition-all duration-300 ease-in-out',
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'text-xl font-medium transition-colors hover:text-auction-accent',
                location.pathname === link.path 
                  ? 'text-auction-accent' 
                  : 'text-foreground/80'
              )}
              onClick={closeMobileMenu}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
