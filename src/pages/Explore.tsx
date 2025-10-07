import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Music, Utensils, TreePine, Moon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AddToItineraryButton } from '@/components/AddToItineraryButton';

const activities = {
  Food: [
    {
      id: 'franklins',
      title: "Franklin Barbecue",
      neighborhood: "East Austin",
      description: "World-famous BBQ joint with legendary brisket. Expect a wait, but it's worth it.",
      category: "Food"
    },
    {
      id: 'food-trucks',
      title: "South Austin Food Trucks",
      neighborhood: "South Austin",
      description: "A collection of the best food trucks serving everything from tacos to fusion cuisine.",
      category: "Food"
    }
  ],
  'Live Music': [
    {
      id: 'continental',
      title: "Continental Club",
      neighborhood: "South Austin",
      description: "Historic venue featuring live music every night with a retro atmosphere.",
      category: "Live Music"
    },
    {
      id: 'antones',
      title: "Antone's Nightclub",
      neighborhood: "East Austin",
      description: "Austin's home of the blues and a launching pad for emerging artists.",
      category: "Live Music"
    }
  ],
  Tours: [
    {
      id: 'capitol-tour',
      title: "Texas State Capitol Tour",
      neighborhood: "Downtown",
      description: "Free guided tours of the beautiful Texas State Capitol building and grounds.",
      category: "Tours"
    },
    {
      id: 'brewery-tour',
      title: "Austin Brewery Tour",
      neighborhood: "Various",
      description: "Hop between Austin's best craft breweries with guided transportation.",
      category: "Tours"
    }
  ],
  Outdoor: [
    {
      id: 'zilker',
      title: "Zilker Park",
      neighborhood: "Central Austin",
      description: "Large park perfect for picnics, festivals, and outdoor activities along Lady Bird Lake.",
      category: "Outdoor"
    },
    {
      id: 'barton-springs',
      title: "Barton Springs Pool",
      neighborhood: "Zilker",
      description: "Natural spring-fed pool maintaining 68-70°F year-round. Perfect for swimming.",
      category: "Outdoor"
    }
  ],
  Nightlife: [
    {
      id: 'rainey-street',
      title: "Rainey Street District",
      neighborhood: "Rainey Street",
      description: "Historic bungalows converted into bars and restaurants with outdoor patios.",
      category: "Nightlife"
    },
    {
      id: 'east-sixth',
      title: "East Sixth Street",
      neighborhood: "East Austin",
      description: "Hip area with craft cocktail lounges, dive bars, and late-night eats.",
      category: "Nightlife"
    }
  ]
};

const categoryIcons = {
  Food: Utensils,
  'Live Music': Music,
  Tours: MapPin,
  Outdoor: TreePine,
  Nightlife: Moon
};

const categories = Object.keys(activities) as Array<keyof typeof activities>;

export function Explore() {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof activities>('Food');

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-2">Explore Austin</h1>
          <p className="text-primary-foreground/90">Discover the best of what Austin has to offer</p>
        </motion.div>
      </div>

      <div className="p-6">
        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as keyof typeof activities)}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            {categories.slice(0, 2).map((category) => {
              const Icon = categoryIcons[category];
              return (
                <TabsTrigger key={category} value={category} className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span>{category}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
          
          <TabsList className="grid w-full grid-cols-3 mb-6">
            {categories.slice(2).map((category) => {
              const Icon = categoryIcons[category];
              return (
                <TabsTrigger key={category} value={category} className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span>{category}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="space-y-4">
                {activities[category].map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-border">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-foreground">{activity.title}</CardTitle>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                <MapPin className="h-3 w-3 mr-1" />
                                {activity.neighborhood}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">
                          {activity.description}
                        </p>
                        <AddToItineraryButton
                          item={{
                            type: 'activity',
                            title: activity.title,
                            date: new Date().toISOString().split('T')[0], // Default to today
                            meta: {
                              neighborhood: activity.neighborhood,
                              category: activity.category,
                              description: activity.description
                            }
                          }}
                          variant="outline"
                          size="sm"
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}