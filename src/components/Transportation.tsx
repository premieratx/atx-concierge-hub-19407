import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Car, Users, Clock, MapPin } from 'lucide-react';
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

interface TransportationProps {
  onBack: () => void;
  tenantInfo?: TenantInfo | null;
  partnerId?: string | null;
}

const Transportation: React.FC<TransportationProps> = ({ onBack, tenantInfo, partnerId }) => {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const transportServices = [
    {
      id: 'luxury-sedan',
      name: 'Luxury Sedan',
      description: 'Premium sedan for airport transfers and city rides',
      capacity: '1-3 passengers',
      price: '$85/hour',
      features: ['Professional driver', 'Leather seats', 'WiFi', 'Water bottles'],
      image: '/api/placeholder/300/200',
      rating: 4.9,
      availability: 'Available now'
    },
    {
      id: 'suv',
      name: 'Luxury SUV',
      description: 'Spacious SUV perfect for groups and luggage',
      capacity: '1-6 passengers',
      price: '$125/hour',
      features: ['Professional driver', 'Extra space', 'Premium sound', 'Refreshments'],
      image: '/api/placeholder/300/200',
      rating: 4.8,
      availability: 'Available in 15 min'
    },
    {
      id: 'party-bus',
      name: 'Party Bus',
      description: 'Ultimate group transportation with entertainment',
      capacity: '8-20 passengers',
      price: '$200/hour',
      features: ['Professional driver', 'Sound system', 'LED lights', 'Mini bar'],
      image: '/api/placeholder/300/200',
      rating: 4.7,
      availability: 'Book in advance'
    },
    {
      id: 'helicopter',
      name: 'Helicopter Tours',
      description: 'See Austin from above with scenic helicopter rides',
      capacity: '1-4 passengers',
      price: '$450/hour',
      features: ['Licensed pilot', 'Scenic routes', 'Photo opportunities', 'Luxury experience'],
      image: '/api/placeholder/300/200',
      rating: 5.0,
      availability: 'Weather dependent'
    }
  ];

  const quickBookOptions = [
    { id: 'airport', title: 'Airport Transfer', description: 'To/from Austin-Bergstrom', price: '$65' },
    { id: 'downtown', title: 'Downtown Austin', description: '2-hour city tour', price: '$180' },
    { id: 'lake', title: 'Lake Austin', description: 'Scenic lake district ride', price: '$95' },
    { id: 'hill-country', title: 'Hill Country', description: 'Half-day wine tour', price: '$350' }
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
              <h1 className="text-3xl font-bold text-white">Transportation</h1>
              <p className="text-white/80">Luxury transportation services in Austin</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Book Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Quick Book</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickBookOptions.map((option) => (
              <Card key={option.id} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer">
                <CardContent className="p-4 text-center">
                  <h3 className="text-white font-semibold mb-1">{option.title}</h3>
                  <p className="text-white/70 text-sm mb-2">{option.description}</p>
                  <Badge variant="secondary" className="text-sm">{option.price}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Transportation Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-white mb-6">Available Vehicles</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {transportServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <Card className={`bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer ${
                  selectedService === service.id ? 'border-white/40 bg-white/20' : ''
                }`}>
                  <CardHeader className="p-4">
                    <div className="aspect-[3/2] bg-white/20 rounded-lg mb-3 flex items-center justify-center">
                      <Car className="w-12 h-12 text-white/60" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {service.availability}
                      </Badge>
                      <div className="flex items-center text-yellow-400">
                        <span className="text-sm font-semibold mr-1">★ {service.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <h3 className="text-white font-semibold text-lg mb-2">{service.name}</h3>
                    <p className="text-white/70 text-sm mb-3">{service.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-white/80">
                        <Users className="w-4 h-4 mr-1" />
                        <span className="text-sm">{service.capacity}</span>
                      </div>
                      <span className="text-white font-bold">{service.price}</span>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-white/80 text-sm font-semibold mb-2">Features included:</h4>
                      <div className="grid grid-cols-2 gap-1">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-white/70 text-xs">
                            <span className="w-1 h-1 bg-white/50 rounded-full mr-2"></span>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="secondary" 
                        className="flex-1"
                        onClick={() => setSelectedService(service.id)}
                      >
                        Select Vehicle
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
        {selectedService && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Card className="bg-white/20 backdrop-blur-md border-white/30">
              <CardHeader>
                <CardTitle className="text-white">Ready to Book</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <p className="font-semibold">{transportServices.find(s => s.id === selectedService)?.name}</p>
                    <p className="text-white/70 text-sm">Selected for your transportation needs</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setSelectedService(null)} className="border-white/30 text-white hover:bg-white/20">
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

export default Transportation;