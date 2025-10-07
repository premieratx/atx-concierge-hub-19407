import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus, ArrowLeft, Wine, Star } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const categories = [
  { id: 'liquor', label: 'Liquor' },
  { id: 'beer', label: 'Beer' },
  { id: 'wine', label: 'Wine' },
  { id: 'seltzers', label: 'Seltzers' },
  { id: 'cocktails', label: 'Cocktails' },
  { id: 'party-supplies', label: 'Party supplies' }
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

export function Delivery() {
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
    <div className="min-h-screen bg-background pb-20 pt-16">
      {/* Header */}
      <div className="bg-card/20 backdrop-blur-md border-b border-border sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="text-foreground hover:bg-accent/20 flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <Wine className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl text-foreground font-bold">
                    Alcohol Delivery
                  </h1>
                  <p className="text-muted-foreground text-sm sm:text-base">Premium spirits delivered in 30-60 minutes</p>
                </div>
              </div>
            </div>
            
            {getCartItemCount() > 0 && (
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right text-foreground">
                  <p className="text-xs sm:text-sm text-muted-foreground">Cart Total</p>
                  <p className="text-lg sm:text-xl font-bold">${getCartTotal()}</p>
                </div>
                <Button className="bg-primary hover:bg-primary/90 relative flex-shrink-0">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Checkout</span>
                  <span className="sm:hidden">Cart</span>
                  <Badge className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs min-w-[1.25rem] h-5 flex items-center justify-center rounded-full">
                    {getCartItemCount()}
                  </Badge>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Mobile optimized tabs */}
            <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 w-full bg-card/20 backdrop-blur-md mb-6 sm:mb-8 h-auto gap-1 p-1">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm py-2 px-2 sm:px-4 whitespace-nowrap"
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
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6"
                >
                  {products[category.id].map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="w-full"
                    >
                      <Card className="bg-card/50 backdrop-blur-md border-border overflow-hidden h-full hover:shadow-lg transition-shadow">
                        <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                          <Wine className="w-12 h-12 sm:w-16 sm:h-16 text-primary" />
                        </div>
                        <CardContent className="p-3 sm:p-4 flex flex-col h-full">
                          <div className="flex items-start justify-between mb-2 gap-2">
                            <h3 className="text-card-foreground font-medium leading-tight text-sm sm:text-base line-clamp-2 flex-1">
                              {product.name}
                            </h3>
                            <div className="flex items-center gap-1 text-yellow-400 flex-shrink-0">
                              <Star className="w-3 h-3 fill-current" />
                              <span className="text-xs">{product.rating}</span>
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground text-xs sm:text-sm mb-3 line-clamp-2 flex-1">
                            {product.description}
                          </p>
                          
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-auto">
                            <span className="text-lg sm:text-xl text-card-foreground font-bold">
                              ${product.price}
                            </span>
                            
                            {cart[product.id] ? (
                              <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => removeFromCart(product.id)}
                                  className="w-8 h-8 p-0 border-primary text-primary hover:bg-primary hover:text-primary-foreground flex-shrink-0"
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="text-card-foreground w-8 text-center font-medium">
                                  {cart[product.id]}
                                </span>
                                <Button
                                  size="sm"
                                  onClick={() => addToCart(product.id)}
                                  className="w-8 h-8 p-0 bg-primary hover:bg-primary/90 flex-shrink-0"
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => addToCart(product.id)}
                                className="bg-primary hover:bg-primary/90 w-full sm:w-auto text-sm"
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
}