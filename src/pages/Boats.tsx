import { useState } from 'react';
import { motion } from 'framer-motion';
import { Ship, Users, Clock, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AddToItineraryButton } from '@/components/AddToItineraryButton';
import { WidgetEmbed } from '@/components/WidgetEmbed';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Slider } from '@/components/ui/slider';

const boatCapacities = [14, 25, 30, 50, 75];
const guestPresets = [14, 25, 30, 50, 75];

type TimeSlot = '12-4' | '4:30-8:30' | '11-3' | '3:30-7:30';

const getAvailableSlots = (date: string): TimeSlot[] => {
  const dayOfWeek = new Date(date).getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
  
  if (isWeekend) {
    return ['11-3', '3:30-7:30'];
  } else {
    return ['12-4', '4:30-8:30'];
  }
};

const formatTimeSlot = (slot: TimeSlot) => {
  switch (slot) {
    case '12-4': return '12:00 PM - 4:00 PM';
    case '4:30-8:30': return '4:30 PM - 8:30 PM';
    case '11-3': return '11:00 AM - 3:00 PM';
    case '3:30-7:30': return '3:30 PM - 7:30 PM';
  }
};

type BookingStep = 'capacity' | 'date' | 'timeSlot' | 'guests' | 'summary';

export function Boats() {
  const [step, setStep] = useState<BookingStep>('capacity');
  const [selectedCapacity, setSelectedCapacity] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [guestCount, setGuestCount] = useState<number>(2);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showWidgetEmbed, setShowWidgetEmbed] = useState(false);
  const [widgetHtmlCode, setWidgetHtmlCode] = useState('');
  const [globalFooterCode, setGlobalFooterCode] = useState('');
  const { toast } = useToast();

  const availableSlots = selectedDate ? getAvailableSlots(selectedDate.toISOString().split('T')[0]) : [];

  const handleCapacitySelect = (capacity: number) => {
    setSelectedCapacity(capacity);
    setStep('date');
  };

  const handleDateSelect = () => {
    if (!selectedDate) {
      toast({
        title: "Please select a date",
        variant: "destructive"
      });
      return;
    }
    setStep('timeSlot');
  };

  const handleTimeSlotSelect = () => {
    if (!selectedSlot) {
      toast({
        title: "Please select a time slot",
        variant: "destructive"
      });
      return;
    }
    setStep('guests');
  };

  const handleGuestsSelect = () => {
    if (guestCount > (selectedCapacity || 0)) {
      toast({
        title: "Too many guests",
        description: `Selected boat can only accommodate ${selectedCapacity} guests.`,
        variant: "destructive"
      });
      return;
    }
    setStep('summary');
  };

  const handleReserve = () => {
    setShowConfirmation(true);
  };

  const resetBooking = () => {
    setStep('capacity');
    setSelectedCapacity(null);
    setSelectedDate(undefined);
    setSelectedSlot(null);
    setGuestCount(2);
    setShowConfirmation(false);
  };

  const itineraryItem = {
    type: 'boat' as const,
    title: `Boat Rental - ${selectedCapacity} person capacity`,
    date: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
    startTime: selectedDate && selectedSlot ? `${selectedDate.toISOString().split('T')[0]}T${selectedSlot.split('-')[0] === '11' ? '11:00' : selectedSlot.split('-')[0] === '12' ? '12:00' : selectedSlot.includes('4:30') ? '16:30' : '15:30'}:00` : undefined,
    endTime: selectedDate && selectedSlot ? `${selectedDate.toISOString().split('T')[0]}T${selectedSlot.includes('4:00') ? '16:00' : selectedSlot.includes('8:30') ? '20:30' : selectedSlot.includes('3:00') ? '15:00' : '19:30'}:00` : undefined,
    meta: {
      capacity: selectedCapacity,
      slot: selectedSlot,
      guests: guestCount
    }
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
          <h1 className="text-3xl font-bold mb-2">Reservation Confirmed</h1>
          <p className="text-primary-foreground/90">Your boat rental is pending confirmation</p>
        </div>

        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-center text-foreground">Reservation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Boat Capacity:</span>
                  <span className="font-medium text-foreground">{selectedCapacity} people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium text-foreground">
                    {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time Slot:</span>
                  <span className="font-medium text-foreground">
                    {selectedSlot && formatTimeSlot(selectedSlot)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Guests:</span>
                  <span className="font-medium text-foreground">{guestCount}</span>
                </div>
                <div className="text-center pt-4 border-t">
                  <span className="text-lg font-semibold text-primary">Status: Pending Confirmation</span>
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
                onClick={resetBooking}
                variant="outline"
                className="w-full"
              >
                Make Another Reservation
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
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Boat Rentals</h1>
          <p className="text-primary-foreground/90 text-sm sm:text-base">Austin lake adventures await</p>
          
          {/* Widget Management Buttons */}
          <div className="flex gap-2 mt-4">
            <Button
              onClick={() => setShowWidgetEmbed(!showWidgetEmbed)}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10 text-xs sm:text-sm"
            >
              <Settings className="w-4 h-4 mr-2" />
              {showWidgetEmbed ? 'Hide' : 'Show'} Booking Widget
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Widget Embed Section */}
        {showWidgetEmbed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Booking Widget Integration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="widget-html">HTML Widget Code</Label>
                  <textarea
                    id="widget-html"
                    className="w-full h-32 p-3 border border-border rounded-md bg-background text-foreground font-mono text-sm"
                    placeholder="Paste your HTML widget code here..."
                    value={widgetHtmlCode}
                    onChange={(e) => setWidgetHtmlCode(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="global-code">Global Footer Code (Optional)</Label>
                  <textarea
                    id="global-code"
                    className="w-full h-24 p-3 border border-border rounded-md bg-background text-foreground font-mono text-sm"
                    placeholder="Paste global JavaScript code here (will be added to footer)..."
                    value={globalFooterCode}
                    onChange={(e) => setGlobalFooterCode(e.target.value)}
                  />
                </div>
                
                {/* Widget Preview */}
                {widgetHtmlCode && (
                  <div className="mt-6">
                    <Label>Widget Preview</Label>
                    <div className="border border-border rounded-md p-4 bg-muted/10">
                      <WidgetEmbed 
                        htmlContent={widgetHtmlCode}
                        title="Boat Booking Widget"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-2">
            {(['capacity', 'date', 'timeSlot', 'guests', 'summary'] as BookingStep[]).map((stepName, index) => (
              <div key={stepName} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === stepName || (['capacity', 'date', 'timeSlot', 'guests', 'summary'] as BookingStep[]).indexOf(step) > index
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {index + 1}
                </div>
                {index < 4 && <div className={`w-8 h-0.5 ${
                  (['capacity', 'date', 'timeSlot', 'guests', 'summary'] as BookingStep[]).indexOf(step) > index
                    ? 'bg-primary'
                    : 'bg-muted'
                }`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Capacity Selection */}
        {step === 'capacity' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-foreground mb-4">Select Boat Capacity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {boatCapacities.map((capacity) => (
                <Card
                  key={capacity}
                  className="cursor-pointer transition-all border-2 hover:border-primary/50 border-border"
                  onClick={() => handleCapacitySelect(capacity)}
                >
                  <CardContent className="p-6 text-center">
                    <Ship className="h-8 w-8 mx-auto text-primary mb-3" />
                    <h3 className="text-lg font-semibold text-foreground">{capacity}-Person Boat</h3>
                    <p className="text-muted-foreground">Up to {capacity} guests</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Date Selection */}
        {step === 'date' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button onClick={() => setStep('capacity')} variant="ghost" className="mb-4">
              ← Back to Capacity
            </Button>
            <h2 className="text-xl font-semibold text-foreground mb-4">Select your date</h2>
            <div className="max-w-md">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                className="rounded-md border border-border p-3 pointer-events-auto"
                initialFocus
              />
              <Button onClick={handleDateSelect} className="w-full mt-4" disabled={!selectedDate}>
                Continue to Time Selection
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Time Slot Selection */}
        {step === 'timeSlot' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button onClick={() => setStep('date')} variant="ghost" className="mb-4">
              ← Back to Date
            </Button>
            <h2 className="text-xl font-semibold text-foreground mb-4">Select Time Slot</h2>
            <div className="text-sm text-muted-foreground mb-4">
              Available slots for {selectedDate && format(selectedDate, 'EEEE, MMMM d')}:
            </div>
            <RadioGroup value={selectedSlot || ''} onValueChange={(value) => setSelectedSlot(value as TimeSlot)}>
              <div className="space-y-3">
                {availableSlots.map((slot) => (
                  <div key={slot} className="flex items-center space-x-2">
                    <RadioGroupItem value={slot} id={slot} />
                    <Label htmlFor={slot} className="flex-1 cursor-pointer">
                      <Card className="p-4 hover:bg-accent transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Clock className="h-5 w-5 text-primary" />
                            <span className="font-medium text-foreground">{formatTimeSlot(slot)}</span>
                          </div>
                        </div>
                      </Card>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            <Button onClick={handleTimeSlotSelect} className="w-full mt-6" disabled={!selectedSlot}>
              Continue to Guest Count
            </Button>
          </motion.div>
        )}

        {/* Step 4: Guest Count */}
        {step === 'guests' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button onClick={() => setStep('timeSlot')} variant="ghost" className="mb-4">
              ← Back to Time Slot
            </Button>
            <h2 className="text-xl font-semibold text-foreground mb-4">Number of Guests</h2>
            <div className="max-w-md">
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-foreground">Select using slider (2-50 guests)</Label>
                  <div className="mt-3 px-2">
                    <div className="flex items-center space-x-4">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <Slider
                          value={[guestCount]}
                          onValueChange={(value) => setGuestCount(value[0])}
                          max={50}
                          min={2}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground min-w-[3rem] text-center">
                        {guestCount}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground">Or choose boat capacity</Label>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {guestPresets.map((preset) => (
                      <Button
                        key={preset}
                        variant={guestCount === preset ? "default" : "outline"}
                        size="sm"
                        onClick={() => setGuestCount(preset)}
                        className="text-sm"
                      >
                        {preset} guests
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  Current selection: {guestCount} guests
                  {selectedCapacity && guestCount > selectedCapacity && (
                    <p className="text-destructive mt-1">
                      Warning: Exceeds boat capacity of {selectedCapacity}
                    </p>
                  )}
                </div>
              </div>

              <Button onClick={handleGuestsSelect} className="w-full mt-6">
                Continue to Summary
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 5: Summary */}
        {step === 'summary' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button onClick={() => setStep('guests')} variant="ghost" className="mb-4">
              ← Back to Guest Count
            </Button>
            <h2 className="text-xl font-semibold text-foreground mb-4">Reservation Summary</h2>
            <Card className="border-border">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Boat Capacity:</span>
                  <span className="font-medium text-foreground">{selectedCapacity} people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium text-foreground">
                    {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time Slot:</span>
                  <span className="font-medium text-foreground">
                    {selectedSlot && formatTimeSlot(selectedSlot)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Guests:</span>
                  <span className="font-medium text-foreground">{guestCount}</span>
                </div>
              </CardContent>
            </Card>
            <Button onClick={handleReserve} className="w-full mt-6" size="lg">
              Reserve Boat
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}