import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface StickyNavigationProps {
  className?: string;
}

const routes = [
  { path: '/', title: 'Home' },
  { path: '/itinerary', title: 'Itinerary' },
  { path: '/delivery', title: 'Delivery' },
  { path: '/transport', title: 'Transport' },
  { path: '/boats', title: 'Boats' },
  { path: '/explore', title: 'Explore' },
  { path: '/admin', title: 'Admin' }
];

export default function StickyNavigation({ className }: StickyNavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const currentIndex = routes.findIndex(route => route.path === location.pathname);
  const currentRoute = routes[currentIndex];
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < routes.length - 1;

  const goToPrevious = () => {
    if (canGoPrevious) {
      navigate(routes[currentIndex - 1].path);
    }
  };

  const goToNext = () => {
    if (canGoNext) {
      navigate(routes[currentIndex + 1].path);
    }
  };

  const goHome = () => {
    navigate('/');
  };

  if (location.pathname === '/') return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={goHome}
              className="text-white hover:bg-white/10"
            >
              <Home className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrevious}
              disabled={!canGoPrevious}
              className="text-white hover:bg-white/10 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-center">
            <h2 className="text-white font-medium">{currentRoute?.title || 'Page'}</h2>
            <div className="flex items-center gap-1 mt-1">
              {routes.map((route, index) => (
                <div
                  key={route.path}
                  className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
                    route.path === location.pathname ? 'bg-purple-400' : 'bg-white/30'
                  }`}
                  onClick={() => navigate(route.path)}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNext}
              disabled={!canGoNext}
              className="text-white hover:bg-white/10 disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}