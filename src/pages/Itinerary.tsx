import { motion } from 'framer-motion';
import { Calendar, Clock, Trash2, Share2, Download } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';
import { useToast } from '@/hooks/use-toast';

export function Itinerary() {
  const { itinerary, removeFromItinerary } = useAppStore();
  const { toast } = useToast();

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied",
      description: "Itinerary link copied to clipboard",
    });
  };

  const handleExportPDF = () => {
    toast({
      title: "PDF Export",
      description: "PDF export functionality coming soon",
    });
  };

  const groupedByDate = itinerary.reduce((groups, item) => {
    const date = item.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {} as Record<string, typeof itinerary>);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-2">Your Itinerary</h1>
          <p className="text-primary-foreground/90">Your planned Austin experience</p>
        </motion.div>
      </div>

      <div className="p-6">
        {/* Action Buttons */}
        <div className="flex gap-2 mb-6">
          <Button onClick={handleShare} variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button onClick={handleExportPDF} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>

        {/* Itinerary Items */}
        {Object.keys(groupedByDate).length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No items in your itinerary</h3>
            <p className="text-muted-foreground">Start planning by adding activities from our services</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByDate)
              .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
              .map(([date, items]) => (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
                  </h3>
                  
                  <div className="space-y-3">
                    {items
                      .sort((a, b) => {
                        if (!a.startTime || !b.startTime) return 0;
                        return a.startTime.localeCompare(b.startTime);
                      })
                      .map((item) => (
                        <Card key={item.id} className="border-border">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-foreground">{item.title}</h4>
                                <p className="text-sm text-muted-foreground capitalize mb-2">
                                  {item.type}
                                </p>
                                {(item.startTime || item.endTime) && (
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {item.startTime && format(parseISO(item.startTime), 'h:mm a')}
                                    {item.startTime && item.endTime && ' - '}
                                    {item.endTime && format(parseISO(item.endTime), 'h:mm a')}
                                  </div>
                                )}
                              </div>
                              <Button
                                onClick={() => removeFromItinerary(item.id)}
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}