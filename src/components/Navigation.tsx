import { Home, Calendar, ShoppingCart, Car, Ship, MapPin } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Calendar, label: 'Itinerary', path: '/itinerary' },
  { icon: ShoppingCart, label: 'Delivery', path: '/delivery' },
  { icon: Car, label: 'Transport', path: '/transport' },
  { icon: Ship, label: 'Boats', path: '/boats' },
  { icon: MapPin, label: 'Explore', path: '/explore' },
];

export function Navigation() {
  const location = useLocation();
  const cart = useAppStore((state) => state.cart);
  const cartItemsCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/20 backdrop-blur-md border-t border-white/10 z-50 mobile-safe">
      <div className="flex items-center justify-around py-2 px-1 max-w-lg mx-auto">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          const isDelivery = path === '/delivery';
          
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-2 sm:px-3 rounded-lg transition-colors relative touch-target min-w-0 flex-1",
                isActive
                  ? "text-white bg-white/20"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
            >
              <Icon className="h-4 w-4 sm:h-5 sm:w-5 mb-1 flex-shrink-0" />
              <span className="text-xs font-medium text-center line-clamp-1">{label}</span>
              {isDelivery && cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-bold text-xs">
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}