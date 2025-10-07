import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Users,
  ArrowLeft,
  Copy,
  ExternalLink,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface PartnerDashboardProps {
  onBack: () => void;
  partnerId?: string;
}

interface PartnerStats {
  total_sales: number;
  total_commission: number;
  total_bookings: number;
  commission_rate: number;
}

interface Partner {
  id: string;
  name: string;
  email: string;
  company: string;
  commission_rate: number;
  total_sales: number;
  total_commission: number;
  created_at: string;
}

interface Booking {
  id: string;
  tenant_slug: string;
  type: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function PartnerDashboard({ onBack, partnerId = 'demo_partner' }: PartnerDashboardProps) {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [stats, setStats] = useState<PartnerStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-1f80af87`;
  
  // Generate partner referral links
  const referralLinks = {
    general: `${window.location.origin}?partner=${partnerId}`,
    boat: `${window.location.origin}?partner=${partnerId}&service=boat`,
    alcohol: `${window.location.origin}?partner=${partnerId}&service=alcohol`,
    transport: `${window.location.origin}?partner=${partnerId}&service=transportation`
  };

  useEffect(() => {
    fetchPartnerDashboard();
  }, [partnerId]);

  const fetchPartnerDashboard = async () => {
    try {
      const response = await fetch(`${serverUrl}/partner/${partnerId}/dashboard`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch partner data');
      }

      const data = await response.json();
      
      setPartner(data.partner);
      setStats(data.stats);
      setRecentBookings(data.recent_bookings || []);
    } catch (error) {
      console.log('Partner dashboard error:', error);
      toast.error('Failed to load partner dashboard');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-400/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };

  if (loading) {
    return (
      <div className="size-full flex items-center justify-center">
        <div className="text-white">Loading partner dashboard...</div>
      </div>
    );
  }

  return (
    <div className="size-full flex flex-col">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
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
              <TrendingUp className="w-8 h-8 text-green-400" />
              <div>
                <h1 className="text-3xl text-white">Partner Dashboard</h1>
                <p className="text-gray-300">Welcome back, {partner?.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h3 className="text-sm text-gray-300">Total Sales</h3>
                <p className="text-2xl text-white">{formatCurrency(stats?.total_sales || 0)}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <h3 className="text-sm text-gray-300">Total Commission</h3>
                <p className="text-2xl text-white">{formatCurrency(stats?.total_commission || 0)}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h3 className="text-sm text-gray-300">Total Bookings</h3>
                <p className="text-2xl text-white">{stats?.total_bookings || 0}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6 text-center">
                <Activity className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h3 className="text-sm text-gray-300">Commission Rate</h3>
                <p className="text-2xl text-white">{((stats?.commission_rate || 0) * 100).toFixed(1)}%</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Referral Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  Your Referral Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">General Referral Link</Label>
                    <div className="flex gap-2">
                      <Input
                        value={referralLinks.general}
                        readOnly
                        className="bg-white/10 border-white/20 text-white"
                      />
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(referralLinks.general, 'General link')}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Boat Rental Link</Label>
                    <div className="flex gap-2">
                      <Input
                        value={referralLinks.boat}
                        readOnly
                        className="bg-white/10 border-white/20 text-white"
                      />
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(referralLinks.boat, 'Boat rental link')}
                        className="bg-cyan-600 hover:bg-cyan-700"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Alcohol Delivery Link</Label>
                    <div className="flex gap-2">
                      <Input
                        value={referralLinks.alcohol}
                        readOnly
                        className="bg-white/10 border-white/20 text-white"
                      />
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(referralLinks.alcohol, 'Alcohol delivery link')}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Transportation Link</Label>
                    <div className="flex gap-2">
                      <Input
                        value={referralLinks.transport}
                        readOnly
                        className="bg-white/10 border-white/20 text-white"
                      />
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(referralLinks.transport, 'Transportation link')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
                  <h4 className="text-blue-400 mb-2">How to Use Your Links</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Share these links with your customers to earn commissions</li>
                    <li>• Each booking through your link will be tracked to your account</li>
                    <li>• You earn {((stats?.commission_rate || 0) * 100).toFixed(1)}% commission on all bookings</li>
                    <li>• Commissions are calculated automatically and updated in real-time</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Recent Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentBookings.length > 0 ? (
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                      >
                        <div className="space-y-1">
                          <h4 className="text-white capitalize">{booking.type} Booking</h4>
                          <p className="text-gray-400 text-sm">
                            Tenant: {booking.tenant_slug} • {formatDate(booking.created_at)}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-lg text-green-400">{formatCurrency(booking.total_amount)}</p>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <h4 className="text-white mb-2">No bookings yet</h4>
                    <p className="text-gray-400">
                      Start sharing your referral links to see bookings here!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Partner Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Partner Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Company</Label>
                    <p className="text-white">{partner?.company}</p>
                  </div>
                  <div>
                    <Label className="text-gray-300">Email</Label>
                    <p className="text-white">{partner?.email}</p>
                  </div>
                  <div>
                    <Label className="text-gray-300">Partner ID</Label>
                    <p className="text-white font-mono">{partner?.id}</p>
                  </div>
                  <div>
                    <Label className="text-gray-300">Member Since</Label>
                    <p className="text-white">{partner?.created_at ? formatDate(partner.created_at) : 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}