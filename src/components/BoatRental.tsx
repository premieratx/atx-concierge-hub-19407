import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Anchor, Users, Clock, Waves, Fuel, Wifi, Music } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TenantInfo {
  id: string;
  client_name: string;
  company_name: string;
  branding: {
    primary_color: string;
    welcome_message: string;
  };
}

interface BoatRentalProps {
  onBack: () => void;
  tenantInfo?: TenantInfo | null;
  partnerId?: string | null;
}

const BoatRental: React.FC<BoatRentalProps> = ({ onBack, tenantInfo, partnerId }) => {
  const [selectedBoat, setSelectedBoat] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string>('4h');

  const boats = [
    {
      id: 'pontoon-deluxe',
      name: 'Deluxe Pontoon',
      description: 'Perfect for groups, comfortable seating with shade',
      capacity: '8-12 people',
      length: '24 feet',
      features: ['Bluetooth speakers', 'Cooler', 'Shade canopy', 'Swimming ladder'],
      hourlyRate: 85,
      image: '/api/placeholder/400/250',
      rating: 4.8,
      availability: 'Available today'
    },
    {
      id: 'speedboat',
      name: 'Sport Speedboat',
      description: 'High-performance boat for water sports and cruising',
      capacity: '6-8 people',
      length: '22 feet',
      features: ['Water sports equipment', 'Premium sound', 'GPS navigation', 'Safety equipment'],
      hourlyRate: 125,
      image: '/api/placeholder/400/250',
      rating: 4.9,
      availability: 'Available today'
    },
    {
      id: 'yacht',
      name: 'Luxury Yacht',
      description: 'Premium experience with full amenities',
      capacity: '10-15 people',
      length: '35 feet',
      features: ['Full kitchen', 'Bathroom', 'Air conditioning', 'Professional captain'],
      hourlyRate: 250,
      image: '/api/placeholder/400/250',
      rating: 5.0,
      availability: 'Book in advance'
    },
    {
      id: 'fishing-boat',
      name: 'Fishing Charter',
      description: 'Equipped for serious fishing with expert guidance',
      capacity: '4-6 people',
      length: '26 feet',
      features: ['Fishing equipment', 'Bait included', 'Fish cleaning station', 'Expert guide'],
      hourlyRate: 180,
      image: '/api/placeholder/400/250',
      rating: 4.7,
      availability: 'Available today'
    }
  ];

  const durations = [
    { id: '2h', label: '2 Hours', multiplier: 2 },
    { id: '4h', label: '4 Hours', multiplier: 4 },
    { id: '6h', label: '6 Hours', multiplier: 6 },
    { id: '8h', label: 'Full Day', multiplier: 8 }
  ];

  const calculatePrice = (hourlyRate: number) => {
    const duration = durations.find(d => d.id === selectedDuration);
    return duration ? hourlyRate * duration.multiplier : hourlyRate * 4;
  };

  const popularLocations = [
    { name: 'Lake Austin', description: 'Scenic lake perfect for relaxation' },
    { name: 'Lady Bird Lake', description: 'Downtown Austin waterfront' },
    { name: 'Lake Travis', description: 'Large lake ideal for water sports' },
    { name: 'Devil\'s Cove', description: 'Popular party cove destination' }
  ];

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #1e1b4b 0%, #5b21b6 50%, #7c3aed 100%)'
    }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 pt-8"
        >
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-white hover:bg-white/20 mr-4"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Boat Rental</h1>
              <p className="text-white/80">Explore Austin's beautiful lakes and waterways</p>
            </div>
          </div>
        </motion.div>

        {/* Duration Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="text-white text-lg font-semibold mb-3">Select Duration</h2>
          <div className="flex gap-3">
            {durations.map((duration) => (
              <Button
                key={duration.id}
                variant={selectedDuration === duration.id ? "default" : "outline"}
                onClick={() => setSelectedDuration(duration.id)}
                className={selectedDuration === duration.id ? "" : "border-white/30 text-white hover:bg-white/20"}
              >
                {duration.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Popular Locations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-white text-lg font-semibold mb-4">Popular Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularLocations.map((location, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Waves className="w-6 h-6 text-white/70 mx-auto mb-2" />
                  <h3 className="text-white font-semibold mb-1">{location.name}</h3>
                  <p className="text-white/70 text-sm">{location.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Boat Fleet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-white text-lg font-semibold mb-6">Available Boats</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {boats.map((boat, index) => (
              <motion.div
                key={boat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.4 }}
              >
                <Card className={`bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer ${
                  selectedBoat === boat.id ? 'border-white/40 bg-white/20' : ''
                }`}>
                  <CardHeader className="p-4">
                    <div className="aspect-[4/3] bg-white/20 rounded-lg mb-3 flex items-center justify-center">
                      <Anchor className="w-12 h-12 text-white/60" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {boat.availability}
                      </Badge>
                      <div className="flex items-center text-yellow-400">
                        <span className="text-sm font-semibold mr-1">★ {boat.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <h3 className="text-white font-semibold text-lg mb-2">{boat.name}</h3>
                    <p className="text-white/70 text-sm mb-3">{boat.description}</p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center text-white/80">
                        <Users className="w-4 h-4 mr-2" />
                        <span className="text-sm">{boat.capacity}</span>
                      </div>
                      <div className="flex items-center text-white/80">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="text-sm">{boat.length}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-white/80 text-sm font-semibold mb-2">Included features:</h4>
                      <div className="grid grid-cols-2 gap-1">
                        {boat.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-white/70 text-xs">
                            <span className="w-1 h-1 bg-white/50 rounded-full mr-2"></span>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-white">
                        <span className="text-sm text-white/70">Total for {durations.find(d => d.id === selectedDuration)?.label}</span>
                        <p className="font-bold text-lg">${calculatePrice(boat.hourlyRate)}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="secondary" 
                        className="flex-1"
                        onClick={() => setSelectedBoat(boat.id)}
                      >
                        Select Boat
                      </Button>
                      <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/20">
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Booking Summary */}
        {selectedBoat && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Card className="bg-white/20 backdrop-blur-md border-white/30">
              <CardHeader>
                <CardTitle className="text-white">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <p className="font-semibold">{boats.find(b => b.id === selectedBoat)?.name}</p>
                    <p className="text-white/70 text-sm">
                      {durations.find(d => d.id === selectedDuration)?.label} rental
                    </p>
                    <p className="font-bold text-lg mt-1">
                      ${calculatePrice(boats.find(b => b.id === selectedBoat)?.hourlyRate || 0)}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setSelectedBoat(null)} className="border-white/30 text-white hover:bg-white/20">
                      Change
                    </Button>
                    <Button variant="default" size="lg">
                      Book Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BoatRental;