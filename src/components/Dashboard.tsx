import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Calendar, 
  Wine, 
  Car, 
  Anchor, 
  MapPin, 
  Crown,
  ArrowRight,
  Settings 
} from 'lucide-react';

type AppView = 'intro' | 'dashboard' | 'itinerary' | 'alcohol' | 'transportation' | 'boat' | 'activities' | 'admin' | 'access-demo';

interface DashboardProps {
  onNavigate: (view: AppView) => void;
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

const services = [
  {
    id: 'itinerary',
    title: 'View Itinerary',
    description: 'Check your upcoming reservations and bookings',
    icon: Calendar,
    gradient: 'from-blue-500 to-blue-700',
    delay: 0.1
  },
  {
    id: 'alcohol',
    title: 'Alcohol Delivery',
    description: 'Premium spirits, wine, and cocktails delivered',
    icon: Wine,
    gradient: 'from-purple-500 to-purple-700',
    delay: 0.2
  },
  {
    id: 'transportation',
    title: 'Transportation',
    description: 'Luxury vehicle booking and ride arrangements',
    icon: Car,
    gradient: 'from-green-500 to-green-700',
    delay: 0.3
  },
  {
    id: 'boat',
    title: 'Boat Rental',
    description: 'Reserve boats for 14-75 people on Austin waters',
    icon: Anchor,
    gradient: 'from-cyan-500 to-cyan-700',
    delay: 0.4
  },
  {
    id: 'activities',
    title: 'Austin Activities',
    description: 'Discover the best experiences in Austin',
    icon: MapPin,
    gradient: 'from-orange-500 to-orange-700',
    delay: 0.5
  }
];

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, tenantInfo, partnerId }) => {
  const clientName = tenantInfo?.client_name;
  
  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #1e1b4b 0%, #5b21b6 50%, #7c3aed 100%)'
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-black/20 backdrop-blur-md border-b border-white/10"
      >
        <div className="max-w-lg mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-3">
            <Crown className="w-8 h-8 text-yellow-400" />
            <div>
              <h1 className="text-2xl text-white font-semibold">
                Concierge Services
              </h1>
            </div>
          </div>
          <p className="text-gray-300 text-sm">
            Select a service to get started
          </p>
          
          {/* Demo mode notification */}
          <div className="mt-4 p-3 bg-blue-600/30 border border-blue-400/30 rounded-lg">
            <p className="text-blue-200 text-sm">
              🎉 <strong>Demo Mode:</strong> This is a fully functional demo. 
              <button 
                onClick={() => onNavigate('access-demo' as AppView)}
                className="ml-2 underline hover:text-blue-100"
              >
                View all demo features →
              </button>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-lg mx-auto space-y-4">
          {/* Admin Dashboard Button */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.6,
              ease: "easeOut"
            }}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onNavigate('admin' as AppView)}
            className="cursor-pointer"
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-500 to-gray-700 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
              <div className="w-full h-full p-8 flex flex-col items-center justify-center text-center gap-4">
                <div className="p-4 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl text-white font-medium group-hover:text-white transition-colors">
                    Admin Dashboard
                  </h3>
                  <p className="text-gray-300 group-hover:text-gray-200 transition-colors leading-relaxed text-sm">
                    Manage tenants, partners, and track performance
                  </p>
                </div>
                
                <motion.div
                  className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors mt-2"
                  initial={{ x: 0 }}
                  whileHover={{ x: 3 }}
                >
                  <span className="text-sm">Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </div>
            </Card>
          </motion.div>

          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: service.delay,
                  ease: "easeOut"
                }}
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onNavigate(service.id as AppView)}
                className="cursor-pointer"
              >
                <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 group overflow-hidden relative">
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  />
                  <div className="w-full h-full p-8 flex flex-col items-center justify-center text-center gap-4">
                    <div className={`p-4 rounded-full bg-gradient-to-br ${service.gradient} shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl text-white font-medium group-hover:text-white transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-gray-300 group-hover:text-gray-200 transition-colors leading-relaxed text-sm">
                        {service.description}
                      </p>
                    </div>
                    
                    <motion.div
                      className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors mt-2"
                      initial={{ x: 0 }}
                      whileHover={{ x: 3 }}
                    >
                      <span className="text-sm">Get Started</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="bg-black/20 backdrop-blur-md border-t border-white/10 p-6"
      >
        <div className="max-w-lg mx-auto text-center">
          <p className="text-gray-400 text-sm">
            Premium concierge services available 24/7 in Austin, Texas
          </p>
          <p className="text-gray-500 mt-1 text-xs">
            For immediate assistance, call +1 (512) 555-CONCIERGE
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;