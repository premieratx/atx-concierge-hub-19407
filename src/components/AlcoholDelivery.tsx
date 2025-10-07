import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Wine, ShoppingCart, Plus, Minus, Star } from 'lucide-react';
import { toast } from "sonner";

interface AlcoholDeliveryProps {
  onBack: () => void;
  tenantInfo?: TenantInfo | null;
  partnerId?: string | null;
}

interface TenantInfo {
  id: string;
  client_name: string;
  company_name: string;
  branding: {
    primary_color: string;
    welcome_message: string;
  };
}

const categories = [
  { id: 'liquor', label: 'Liquor' },
  { id: 'beer', label: 'Beer' },
  { id: 'wine', label: 'Wine' },
  { id: 'seltzers', label: 'Seltzers' },
  { id: 'cocktails', label: 'Cocktails' },
  { id: 'party-supplies', label: 'Party Supplies' }
];

const products = {
  liquor: [
    { id: 1, name: 'Grey Goose Vodka', price: 45, image: 'vodka premium', rating: 4.8, description: 'Premium French vodka, 750ml' },
    { id: 2, name: 'Macallan 18 Year', price: 350, image: 'whiskey premium', rating: 4.9, description: 'Single malt Scotch whiskey' },
    { id: 3, name: 'Patron Silver Tequila', price: 55, image: 'tequila premium', rating: 4.7, description: '100% Blue Agave, 750ml' },
    { id: 4, name: 'Hennessy VS Cognac', price: 65, image: 'cognac premium', rating: 4.6, description: 'French cognac, 750ml' }
  ],
  beer: [
    { id: 5, name: 'Corona Extra 12-Pack', price: 18, image: 'beer corona bottles', rating: 4.3, description: 'Mexican lager, 12 bottles' },
    { id: 6, name: 'Craft IPA Selection', price: 24, image: 'craft beer variety', rating: 4.5, description: 'Local brewery variety pack' },
    { id: 7, name: 'Heineken 6-Pack', price: 12, image: 'heineken beer bottles', rating: 4.2, description: 'Dutch premium lager' },
    { id: 8, name: 'Stella Artois 12-Pack', price: 20, image: 'stella artois beer', rating: 4.4, description: 'Belgian pilsner' }
  ],
  wine: [
    { id: 9, name: 'Dom Pérignon Champagne', price: 200, image: 'champagne luxury bottle', rating: 4.9, description: 'Vintage champagne, 750ml' },
    { id: 10, name: 'Caymus Cabernet', price: 85, image: 'red wine premium', rating: 4.7, description: 'Napa Valley Cabernet Sauvignon' },
    { id: 11, name: 'Kendall-Jackson Chardonnay', price: 35, image: 'white wine chardonnay', rating: 4.5, description: 'California Chardonnay' },
    { id: 12, name: 'Veuve Clicquot Rosé', price: 65, image: 'rose champagne bottle', rating: 4.6, description: 'French rosé champagne' }
  ],
  seltzers: [
    { id: 13, name: 'White Claw Variety Pack', price: 16, image: 'hard seltzer variety', rating: 4.2, description: '12-pack mixed flavors' },
    { id: 14, name: 'Truly Wild Berry Mix', price: 15, image: 'berry seltzer cans', rating: 4.1, description: 'Berry flavored seltzers' },
    { id: 15, name: 'High Noon Variety', price: 18, image: 'premium seltzer pack', rating: 4.4, description: 'Vodka & soda variety pack' },
    { id: 16, name: 'Bon & Viv Spiked', price: 14, image: 'spiked seltzer water', rating: 4.0, description: 'Spiked seltzer 8-pack' }
  ],
  cocktails: [
    { id: 17, name: 'Margarita Kit Premium', price: 45, image: 'margarita cocktail kit', rating: 4.6, description: 'Everything for perfect margaritas' },
    { id: 18, name: 'Old Fashioned Set', price: 55, image: 'whiskey cocktail kit', rating: 4.7, description: 'Bourbon, bitters, and garnish' },
    { id: 19, name: 'Moscow Mule Kit', price: 40, image: 'mule cocktail copper', rating: 4.5, description: 'Vodka, ginger beer, lime' },
    { id: 20, name: 'Cosmopolitan Kit', price: 42, image: 'pink cocktail kit', rating: 4.4, description: 'Vodka, cranberry, lime' }
  ],
  'party-supplies': [
    { id: 21, name: 'Premium Ice Bucket', price: 25, image: 'ice bucket silver', rating: 4.3, description: 'Stainless steel with tongs' },
    { id: 22, name: 'Cocktail Shaker Set', price: 35, image: 'cocktail shaker tools', rating: 4.5, description: 'Professional bartender kit' },
    { id: 23, name: 'Wine Glasses Set', price: 30, image: 'wine glasses elegant', rating: 4.4, description: 'Set of 6 crystal glasses' },
    { id: 24, name: 'Party Cooler Large', price: 45, image: 'party cooler ice', rating: 4.2, description: 'Holds 48 cans with ice' }
  ]
};

const AlcoholDelivery: React.FC<AlcoholDeliveryProps> = ({ onBack, tenantInfo, partnerId }) => {
  // Extract tenant info for personalization
  const clientName = tenantInfo?.client_name;
  const primaryColor = tenantInfo?.branding?.primary_color || '#6366f1';
  const companyName = tenantInfo?.company_name;

  const [cart, setCart] = useState<{[key: number]: number}>({});
  const [activeTab, setActiveTab] = useState('liquor');

  const addToCart = (productId: number) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
    toast.success('Added to cart');
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = Object.values(products).flat().find(p => p.id === parseInt(productId));
      return total + (product?.price || 0) * quantity;
    }, 0);
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #5b21b6 50%, #7c3aed 100%)'
      }}
    >
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <Wine className="w-8 h-8 text-purple-400" />
                <div>
                  <h1 className="text-3xl text-white">
                    {clientName ? `${clientName}'s Alcohol Delivery` : 'Alcohol Delivery'}
                  </h1>
                  {companyName && (
                    <p className="text-purple-300">{companyName}</p>
                  )}
                </div>
              </div>
            </div>
            
            {getCartItemCount() > 0 && (
              <div className="flex items-center gap-4">
                <div className="text-right text-white">
                  <p className="text-sm text-gray-300">Cart Total</p>
                  <p className="text-xl">${getCartTotal()}</p>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700 relative">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Checkout
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                    {getCartItemCount()}
                  </Badge>
                </Button>
              </div>
            )}
          </div>
          <p className="text-gray-300 mt-2">Premium spirits delivered in 30-60 minutes</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-6 w-full bg-white/10 backdrop-blur-md mb-8">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="text-white data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                >
                  {products[category.id as keyof typeof products].map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <Card className="bg-white/10 backdrop-blur-md border-white/20 overflow-hidden h-full">
                        <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                          <Wine className="w-16 h-16 text-purple-300" />
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-white font-medium leading-tight">{product.name}</h3>
                            <div className="flex items-center gap-1 text-yellow-400">
                              <Star className="w-3 h-3 fill-current" />
                              <span className="text-xs">{product.rating}</span>
                            </div>
                          </div>
                          
                          <p className="text-gray-300 text-sm mb-3">{product.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xl text-white">${product.price}</span>
                            
                            {cart[product.id] ? (
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => removeFromCart(product.id)}
                                  className="w-8 h-8 p-0 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="text-white w-8 text-center">{cart[product.id]}</span>
                                <Button
                                  size="sm"
                                  onClick={() => addToCart(product.id)}
                                  className="w-8 h-8 p-0 bg-purple-600 hover:bg-purple-700"
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => addToCart(product.id)}
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                Add to Cart
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AlcoholDelivery;