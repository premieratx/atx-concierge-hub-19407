import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { Itinerary } from "./pages/Itinerary";
import { Delivery } from "./pages/Delivery";
import { Transport } from "./pages/Transport";
import { Boats } from "./pages/Boats";
import { Explore } from "./pages/Explore";
import { Checkout } from "./pages/Checkout";
import { Admin } from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { Navigation } from "@/components/Navigation";
import StickyNavigation from "@/components/StickyNavigation";
import { GlobalFooter } from "@/components/GlobalFooter";

const queryClient = new QueryClient();

const App = () => {
  const isHomePage = window.location.pathname === '/';
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <StickyNavigation />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/itinerary" element={<Itinerary />} />
              <Route path="/delivery" element={<Delivery />} />
              <Route path="/transport" element={<Transport />} />
              <Route path="/boats" element={<Boats />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/admin" element={<Admin />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            {!isHomePage && window.location.pathname !== '*' && <Navigation />}
            <GlobalFooter />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
