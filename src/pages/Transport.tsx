import { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Users, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AddToItineraryButton } from '@/components/AddToItineraryButton';
import { useToast } from '@/hooks/use-toast';

const vehicleOptions = [
  { size: 14, rate: 150, name: '14-Person Vehicle' },
  { size: 25, rate: 175, name: '25-Person Vehicle' },
  { size: 30, rate: 200, name: '30-Person Vehicle' },
  { size: 50, rate: 225, name: '50-Person Vehicle' },
  { size: 75, rate: 250, name: '75-Person Vehicle' },
];

export function Transport() {
  const [selectedVehicle, setSelectedVehicle] = useState<typeof vehicleOptions[0] | null>(null);
  const [formData, setFormData] = useState({
    people: '',
    dateTime: '',
    pickupAddress: '',
    dropoffAddress: '',
    estHours: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();

  const handleVehicleSelect = (vehicle: typeof vehicleOptions[0]) => {
    setSelectedVehicle(vehicle);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedVehicle || !formData.people || !formData.dateTime || !formData.pickupAddress || !formData.dropoffAddress || !formData.estHours) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select a vehicle.",
        variant: "destructive"
      });
      return;
    }

    if (parseInt(formData.people) > selectedVehicle.size) {
      toast({
        title: "Too Many Passengers",
        description: `Selected vehicle can only accommodate ${selectedVehicle.size} people.`,
        variant: "destructive"
      });
      return;
    }

    setShowConfirmation(true);
  };

  const total = selectedVehicle && formData.estHours 
    ? selectedVehicle.rate * parseInt(formData.estHours || '0')
    : 0;

  const itineraryItem = {
    type: 'transport' as const,
    title: `Transportation - ${selectedVehicle?.name}`,
    date: formData.dateTime.split('T')[0],
    startTime: formData.dateTime,
    meta: {
      people: formData.people,
      pickup: formData.pickupAddress,
      dropoff: formData.dropoffAddress,
      vehicleSize: selectedVehicle?.size,
      estimatedCost: total
    }
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-background pb-20 pt-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Request Confirmed</h1>
          <p className="text-primary-foreground/90 text-sm sm:text-base">Your transportation request has been submitted</p>
        </div>

        <div className="p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-center text-foreground text-lg sm:text-xl">Request Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-muted-foreground text-sm sm:text-base">Vehicle:</span>
                  <span className="font-medium text-foreground text-sm sm:text-base">{selectedVehicle?.name}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-muted-foreground text-sm sm:text-base">Passengers:</span>
                  <span className="font-medium text-foreground text-sm sm:text-base">{formData.people}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-muted-foreground text-sm sm:text-base">Date & Time:</span>
                  <span className="font-medium text-foreground text-sm sm:text-base text-right">
                    {new Date(formData.dateTime).toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm sm:text-base">Pickup:</span>
                  <span className="font-medium text-foreground text-sm sm:text-base break-words">{formData.pickupAddress}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm sm:text-base">Dropoff:</span>
                  <span className="font-medium text-foreground text-sm sm:text-base break-words">{formData.dropoffAddress}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-muted-foreground text-sm sm:text-base">Estimated Hours:</span>
                  <span className="font-medium text-foreground text-sm sm:text-base">{formData.estHours}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 text-base sm:text-lg font-semibold pt-2 border-t">
                  <span className="text-foreground">Estimated Total:</span>
                  <span className="text-primary">${total}</span>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 space-y-3">
              <AddToItineraryButton 
                item={itineraryItem}
                className="w-full"
                size="lg"
              />
              <Button
                onClick={() => setShowConfirmation(false)}
                variant="outline"
                className="w-full"
              >
                Make Another Request
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Transportation</h1>
          <p className="text-primary-foreground/90 text-sm sm:text-base">Luxury group transportation services</p>
        </motion.div>
      </div>

      <div className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vehicle Selection */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4">Select Vehicle Size</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {vehicleOptions.map((vehicle) => (
                <motion.div
                  key={vehicle.size}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card
                    className={`cursor-pointer transition-all border-2 hover:shadow-md ${
                      selectedVehicle?.size === vehicle.size
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleVehicleSelect(vehicle)}
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Car className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                          <div className="min-w-0">
                            <h3 className="font-semibold text-foreground text-sm sm:text-base line-clamp-1">{vehicle.name}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">Up to {vehicle.size} passengers</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <p className="text-base sm:text-lg font-bold text-primary">${vehicle.rate}/hr</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Request Form */}
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">Request Details</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="people" className="text-sm sm:text-base">Number of People *</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="people"
                    type="number"
                    min="1"
                    max="75"
                    value={formData.people}
                    onChange={(e) => setFormData({ ...formData, people: e.target.value })}
                    className="pl-10 touch-target"
                    placeholder="e.g. 8"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="dateTime" className="text-sm sm:text-base">Date & Time *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dateTime"
                    type="datetime-local"
                    value={formData.dateTime}
                    onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                    className="pl-10 touch-target"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="pickup" className="text-sm sm:text-base">Pickup Address *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="pickup"
                  value={formData.pickupAddress}
                  onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                  className="pl-10 touch-target"
                  placeholder="Enter pickup location"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="dropoff" className="text-sm sm:text-base">Dropoff Address *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="dropoff"
                  value={formData.dropoffAddress}
                  onChange={(e) => setFormData({ ...formData, dropoffAddress: e.target.value })}
                  className="pl-10 touch-target"
                  placeholder="Enter destination"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="estHours" className="text-sm sm:text-base">Estimated Hours *</Label>
              <Input
                id="estHours"
                type="number"
                min="1"
                step="0.5"
                value={formData.estHours}
                onChange={(e) => setFormData({ ...formData, estHours: e.target.value })}
                placeholder="e.g. 4"
                className="touch-target"
                required
              />
            </div>
          </div>

          {/* Price Estimate */}
          {selectedVehicle && formData.estHours && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary/5 border border-primary/20 rounded-lg p-4"
            >
              <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Price Estimate</h3>
              <div className="space-y-1 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hourly Rate:</span>
                  <span className="text-foreground">${selectedVehicle.rate}/hr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hours:</span>
                  <span className="text-foreground">{formData.estHours}</span>
                </div>
                <div className="flex justify-between font-semibold text-base sm:text-lg pt-2 border-t border-primary/20">
                  <span className="text-foreground">Estimated Total:</span>
                  <span className="text-primary">${total}</span>
                </div>
              </div>
            </motion.div>
          )}

          <Button type="submit" className="w-full touch-target" size="lg">
            Submit Request
          </Button>
        </form>
      </div>
    </div>
  );
}