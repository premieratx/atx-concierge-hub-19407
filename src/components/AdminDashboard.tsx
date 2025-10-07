import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Building, 
  Calendar,
  Settings,
  ArrowLeft,
  Edit,
  ExternalLink,
  Plus,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '@/utils/supabase/info';
import { supabase } from '@/integrations/supabase/client';

interface AdminDashboardProps {
  onBack: () => void;
}

interface AdminStats {
  total_tenants: number;
  total_partners: number;
  total_bookings: number;
  total_revenue: number;
  total_commissions: number;
}

interface Tenant {
  id: string;
  client_name: string;
  company_name: string;
  email: string;
  created_at: string;
  status: string;
  branding: {
    primary_color: string;
    welcome_message: string;
  };
}

interface Partner {
  id: string;
  name: string;
  email: string;
  company_name?: string;
  affiliate_code: string;
  commission_rate: number;
  total_referrals: number;
  total_commission_earned: number;
  created_at: string;
  status: string;
}

interface Booking {
  id: string;
  user_id: string;
  tenant_slug: string;
  partner_id?: string;
  type: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPartner, setEditingPartner] = useState<string | null>(null);
  const [newCommissionRate, setNewCommissionRate] = useState<string>('');
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [newPartnerData, setNewPartnerData] = useState({
    name: '',
    email: '',
    company_name: '',
    commission_rate: '10'
  });
  // Title screen (cover page) editable fields
  const [coverTitle, setCoverTitle] = useState('Premier Concierge');
  const [coverWelcome, setCoverWelcome] = useState('Everything you need for an awesome weekend in Austin.');
  const [coverPrimaryColor, setCoverPrimaryColor] = useState('#6366f1');
  const [savingCover, setSavingCover] = useState(false);
  const [coverId, setCoverId] = useState<string | null>(null);

  // Partner app customization state
  const [customizingPartner, setCustomizingPartner] = useState<string | null>(null);
  const [partnerAppData, setPartnerAppData] = useState({
    app_name: '',
    business_name: '',
    logo_url: '',
    discount_code: '',
    enabled_tiles: {
      delivery: true,
      boats: true,
      transport: true,
      activities: true
    },
    primary_color: '#6366f1',
    welcome_message: ''
  });

  const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-1f80af87`;

  useEffect(() => {
    fetchAdminOverview();
    fetchCoverPageData();
  }, []);

  const fetchAdminOverview = async () => {
    try {
      const response = await fetch(`${serverUrl}/admin/overview`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch admin data');
      }

      const data = await response.json();
      
      setStats(data.stats);
      setTenants(data.recent_tenants || []);
      setPartners(data.recent_partners || []);
      setBookings(data.recent_bookings || []);
    } catch (error) {
      console.log('Admin overview error:', error);
      toast.error('Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchCoverPageData = async () => {
    try {
      const { data, error } = await supabase
        .from('cover_pages')
        .select('id, title, content, slug')
        .eq('slug', 'home')
        .maybeSingle();

      if (error) {
        console.log('Cover page fetch error:', error);
        return;
      }

      if (data) {
        setCoverId(data.id);
        setCoverTitle(data.title || 'Premier Concierge');
        const content = (data as any).content || {};
        setCoverWelcome(content.welcome_message ?? 'Everything you need for an awesome weekend in Austin.');
        setCoverPrimaryColor(content.primary_color ?? '#6366f1');
      }
    } catch (err) {
      console.log('Cover page fetch error:', err);
    }
  };

  const saveCoverPage = async () => {
    setSavingCover(true);
    try {
      const payload = {
        title: coverTitle,
        slug: 'home',
        content: {
          welcome_message: coverWelcome,
          primary_color: coverPrimaryColor,
        },
      } as any;

      if (coverId) {
        const { error } = await supabase
          .from('cover_pages')
          .update(payload)
          .eq('id', coverId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('cover_pages')
          .insert(payload)
          .select('id')
          .single();
        if (error) throw error;
        setCoverId(data?.id ?? null);
      }

      toast.success('Title screen updated');
    } catch (err) {
      console.log('Cover page save error:', err);
      toast.error('Failed to save title screen');
    } finally {
      setSavingCover(false);
    }
  };

  const savePartnerApp = async (partnerId: string) => {
    try {
      const response = await fetch(`${serverUrl}/admin/partner/${partnerId}/app`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(partnerAppData)
      });

      if (!response.ok) {
        throw new Error('Failed to save partner app');
      }

      toast.success('Partner app configuration saved!');
      setCustomizingPartner(null);
      fetchAdminOverview();
    } catch (error) {
      console.log('Save partner app error:', error);
      toast.error('Failed to save partner app');
    }
  };

  const openPartnerCustomizer = (partner: any) => {
    setCustomizingPartner(partner.id);
    setPartnerAppData({
      app_name: partner.company_name || '',
      business_name: partner.company_name || '',
      logo_url: '',
      discount_code: `${partner.affiliate_code}SAVE`,
      enabled_tiles: {
        delivery: true,
        boats: true,
        transport: true,
        activities: true
      },
      primary_color: '#6366f1',
      welcome_message: `Welcome to ${partner.company_name || partner.name}!`
    });
  };
  const createPartner = async () => {
    try {
      const response = await fetch(`${serverUrl}/admin/partner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          ...newPartnerData,
          commission_rate: parseFloat(newPartnerData.commission_rate)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create partner');
      }

      const data = await response.json();
      
      toast.success(`Partner created! Affiliate code: ${data.affiliate.affiliate_code}`);
      setShowAddPartner(false);
      setNewPartnerData({ name: '', email: '', company_name: '', commission_rate: '10' });
      fetchAdminOverview(); // Refresh data
    } catch (error) {
      console.log('Create partner error:', error);
      toast.error('Failed to create partner');
    }
  };

  const updatePartnerCommission = async (partnerId: string) => {
    try {
      const response = await fetch(`${serverUrl}/admin/partner/${partnerId}/commission`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          commission_rate: parseFloat(newCommissionRate)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update commission');
      }

      toast.success('Commission rate updated successfully');
      setEditingPartner(null);
      setNewCommissionRate('');
      fetchAdminOverview(); // Refresh data
    } catch (error) {
      console.log('Update commission error:', error);
      toast.error('Failed to update commission rate');
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
      case 'active': return 'bg-green-500/20 text-green-400 border-green-400/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
      case 'confirmed': return 'bg-blue-500/20 text-blue-400 border-blue-400/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };

  if (loading) {
    return (
      <div className="size-full flex items-center justify-center">
        <div className="text-white">Loading admin dashboard...</div>
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
              <Settings className="w-8 h-8 text-purple-400" />
              <h1 className="text-3xl text-white">Admin Dashboard</h1>
            </div>
          </div>
          <p className="text-gray-300 mt-2">Manage tenants, partners, and track performance</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6" style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #5b21b6 50%, #7c3aed 100%)'
      }}>
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6 text-center">
                <Building className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h3 className="text-sm text-gray-300">Total Tenants</h3>
                <p className="text-2xl text-white">{stats?.total_tenants || 0}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h3 className="text-sm text-gray-300">Total Partners</h3>
                <p className="text-2xl text-white">{stats?.total_partners || 0}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h3 className="text-sm text-gray-300">Total Bookings</h3>
                <p className="text-2xl text-white">{stats?.total_bookings || 0}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <h3 className="text-sm text-gray-300">Total Revenue</h3>
                <p className="text-2xl text-white">{formatCurrency(stats?.total_revenue || 0)}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <h3 className="text-sm text-gray-300">Commissions</h3>
                <p className="text-2xl text-white">{formatCurrency(stats?.total_commissions || 0)}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Detailed Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Tabs defaultValue="tenants" className="w-full">
              <TabsList className="grid grid-cols-3 w-full bg-white/10 backdrop-blur-md mb-8">
                <TabsTrigger value="tenants" className="text-white data-[state=active]:bg-purple-600">
                  Tenants
                </TabsTrigger>
                <TabsTrigger value="partners" className="text-white data-[state=active]:bg-purple-600">
                  Partners/Affiliates
                </TabsTrigger>
                <TabsTrigger value="bookings" className="text-white data-[state=active]:bg-purple-600">
                  Recent Bookings
                </TabsTrigger>
              </TabsList>

              {/* Tenants Tab */}
              <TabsContent value="tenants">
                <div className="space-y-4">
                  {tenants.map((tenant) => (
                    <Card key={tenant.id} className="bg-white/10 backdrop-blur-md border-white/20">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <h3 className="text-xl text-white">{tenant.client_name}</h3>
                            <p className="text-gray-300">{tenant.company_name}</p>
                            <p className="text-gray-400">{tenant.email}</p>
                            <Badge className={getStatusColor(tenant.status)}>
                              {tenant.status}
                            </Badge>
                          </div>
                          <div className="text-right space-y-2">
                            <p className="text-sm text-gray-400">Created: {formatDate(tenant.created_at)}</p>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-white/20 text-white hover:bg-white/10"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View App
                            </Button>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-white/5 rounded-lg">
                          <p className="text-sm text-gray-300 italic">
                            "{tenant.branding.welcome_message}"
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Partners Tab */}
              <TabsContent value="partners">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl text-white">Partners & Affiliates</h2>
                    <Button
                      onClick={() => setShowAddPartner(true)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Partner
                    </Button>
                  </div>

                  {/* Add Partner Form */}
                  {showAddPartner && (
                    <Card className="bg-white/10 backdrop-blur-md border-white/20">
                      <CardHeader>
                        <CardTitle className="text-white">Add New Partner/Affiliate</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name" className="text-white">Name *</Label>
                            <Input
                              id="name"
                              value={newPartnerData.name}
                              onChange={(e) => setNewPartnerData(prev => ({ ...prev, name: e.target.value }))}
                              className="bg-white/10 border-white/20 text-white"
                              placeholder="Partner name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email" className="text-white">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={newPartnerData.email}
                              onChange={(e) => setNewPartnerData(prev => ({ ...prev, email: e.target.value }))}
                              className="bg-white/10 border-white/20 text-white"
                              placeholder="partner@example.com"
                            />
                          </div>
                          <div>
                            <Label htmlFor="company" className="text-white">Company</Label>
                            <Input
                              id="company"
                              value={newPartnerData.company_name}
                              onChange={(e) => setNewPartnerData(prev => ({ ...prev, company_name: e.target.value }))}
                              className="bg-white/10 border-white/20 text-white"
                              placeholder="Company name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="commission" className="text-white">Commission Rate (%)</Label>
                            <Input
                              id="commission"
                              type="number"
                              value={newPartnerData.commission_rate}
                              onChange={(e) => setNewPartnerData(prev => ({ ...prev, commission_rate: e.target.value }))}
                              className="bg-white/10 border-white/20 text-white"
                              placeholder="10"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={createPartner}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Create Partner
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowAddPartner(false)}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {partners.map((partner) => (
                    <Card key={partner.id} className="bg-white/10 backdrop-blur-md border-white/20">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <h3 className="text-xl text-white">{partner.name}</h3>
                            <p className="text-gray-300">{partner.company_name}</p>
                            <p className="text-gray-400">{partner.email}</p>
                            <div className="flex gap-2 flex-wrap">
                              <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30">
                                {partner.total_referrals} referrals
                              </Badge>
                              <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
                                {formatCurrency(partner.total_commission_earned)} earned
                              </Badge>
                              <Badge className="bg-purple-500/20 text-purple-400 border-purple-400/30">
                                Code: {partner.affiliate_code}
                              </Badge>
                            </div>
                             <div className="flex gap-2 mt-2">
                               <Button
                                 size="sm"
                                 variant="outline"
                                 onClick={() => copyToClipboard(`${window.location.origin}?ref=${partner.affiliate_code}`, 'Referral link')}
                                 className="border-white/20 text-white hover:bg-white/10"
                               >
                                 <Copy className="w-3 h-3 mr-1" />
                                 Copy Link
                               </Button>
                               <Button
                                 size="sm"
                                 variant="outline"
                                 onClick={() => copyToClipboard(`${partner.affiliate_code}SAVE`, 'Discount code')}
                                 className="border-white/20 text-white hover:bg-white/10"
                               >
                                 <Copy className="w-3 h-3 mr-1" />
                                 Copy Discount
                               </Button>
                               <Button
                                 size="sm"
                                 onClick={() => openPartnerCustomizer(partner)}
                                 className="bg-blue-600 hover:bg-blue-700"
                               >
                                 <Settings className="w-3 h-3 mr-1" />
                                 Customize App
                               </Button>
                             </div>
                          </div>
                          <div className="text-right space-y-2">
                            <p className="text-sm text-gray-400">Created: {formatDate(partner.created_at)}</p>
                            <div className="flex items-center gap-2">
                              {editingPartner === partner.id ? (
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    placeholder="10"
                                    value={newCommissionRate}
                                    onChange={(e) => setNewCommissionRate(e.target.value)}
                                    className="w-20 bg-white/10 border-white/20 text-white"
                                  />
                                  <span className="text-white">%</span>
                                  <Button
                                    size="sm"
                                    onClick={() => updatePartnerCommission(partner.id)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setEditingPartner(null);
                                      setNewCommissionRate('');
                                    }}
                                    className="border-white/20 text-white hover:bg-white/10"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span className="text-white">{partner.commission_rate.toFixed(1)}% commission</span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setEditingPartner(partner.id);
                                      setNewCommissionRate(partner.commission_rate.toString());
                                    }}
                                    className="border-white/20 text-white hover:bg-white/10"
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                   ))}

                   {/* Partner App Customizer Modal */}
                   {customizingPartner && (
                     <Card className="bg-white/10 backdrop-blur-md border-white/20 mt-4">
                       <CardHeader>
                         <CardTitle className="text-white flex items-center gap-2">
                           <Settings className="w-5 h-5" />
                           Customize Partner App
                         </CardTitle>
                       </CardHeader>
                       <CardContent className="space-y-6">
                         {/* App Branding */}
                         <div className="space-y-4">
                           <h3 className="text-lg text-white">App Branding</h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                               <Label className="text-white">App Name</Label>
                               <Input
                                 value={partnerAppData.app_name}
                                 onChange={(e) => setPartnerAppData(prev => ({ ...prev, app_name: e.target.value }))}
                                 className="bg-white/10 border-white/20 text-white"
                                 placeholder="My Delivery App"
                               />
                             </div>
                             <div>
                               <Label className="text-white">Business Name</Label>
                               <Input
                                 value={partnerAppData.business_name}
                                 onChange={(e) => setPartnerAppData(prev => ({ ...prev, business_name: e.target.value }))}
                                 className="bg-white/10 border-white/20 text-white"
                                 placeholder="My Business"
                               />
                             </div>
                             <div>
                               <Label className="text-white">Logo URL</Label>
                               <Input
                                 value={partnerAppData.logo_url}
                                 onChange={(e) => setPartnerAppData(prev => ({ ...prev, logo_url: e.target.value }))}
                                 className="bg-white/10 border-white/20 text-white"
                                 placeholder="https://example.com/logo.png"
                               />
                             </div>
                             <div>
                               <Label className="text-white">Primary Color</Label>
                               <Input
                                 type="color"
                                 value={partnerAppData.primary_color}
                                 onChange={(e) => setPartnerAppData(prev => ({ ...prev, primary_color: e.target.value }))}
                                 className="bg-white/10 border-white/20 text-white h-10"
                               />
                             </div>
                           </div>
                           <div>
                             <Label className="text-white">Welcome Message</Label>
                             <Input
                               value={partnerAppData.welcome_message}
                               onChange={(e) => setPartnerAppData(prev => ({ ...prev, welcome_message: e.target.value }))}
                               className="bg-white/10 border-white/20 text-white"
                               placeholder="Welcome to our app!"
                             />
                           </div>
                         </div>

                         {/* Discount Code */}
                         <div className="space-y-4">
                           <h3 className="text-lg text-white">Discount Configuration</h3>
                           <div>
                             <Label className="text-white">Custom Discount Code</Label>
                             <Input
                               value={partnerAppData.discount_code}
                               onChange={(e) => setPartnerAppData(prev => ({ ...prev, discount_code: e.target.value }))}
                               className="bg-white/10 border-white/20 text-white"
                               placeholder="SAVE20"
                             />
                             <p className="text-gray-400 text-sm mt-1">
                               This code will be displayed to customers in your app
                             </p>
                           </div>
                         </div>

                         {/* Enabled Services */}
                         <div className="space-y-4">
                           <h3 className="text-lg text-white">Enabled Services</h3>
                           <p className="text-gray-400">Choose which services to show in your app</p>
                           <div className="grid grid-cols-2 gap-4">
                             <label className="flex items-center space-x-2 cursor-pointer">
                               <input
                                 type="checkbox"
                                 checked={partnerAppData.enabled_tiles.delivery}
                                 onChange={(e) => setPartnerAppData(prev => ({
                                   ...prev,
                                   enabled_tiles: { ...prev.enabled_tiles, delivery: e.target.checked }
                                 }))}
                                 className="w-4 h-4"
                               />
                               <span className="text-white">Alcohol Delivery</span>
                             </label>
                             <label className="flex items-center space-x-2 cursor-pointer">
                               <input
                                 type="checkbox"
                                 checked={partnerAppData.enabled_tiles.boats}
                                 onChange={(e) => setPartnerAppData(prev => ({
                                   ...prev,
                                   enabled_tiles: { ...prev.enabled_tiles, boats: e.target.checked }
                                 }))}
                                 className="w-4 h-4"
                               />
                               <span className="text-white">Boat Rentals</span>
                             </label>
                             <label className="flex items-center space-x-2 cursor-pointer">
                               <input
                                 type="checkbox"
                                 checked={partnerAppData.enabled_tiles.transport}
                                 onChange={(e) => setPartnerAppData(prev => ({
                                   ...prev,
                                   enabled_tiles: { ...prev.enabled_tiles, transport: e.target.checked }
                                 }))}
                                 className="w-4 h-4"
                               />
                               <span className="text-white">Transportation</span>
                             </label>
                             <label className="flex items-center space-x-2 cursor-pointer">
                               <input
                                 type="checkbox"
                                 checked={partnerAppData.enabled_tiles.activities}
                                 onChange={(e) => setPartnerAppData(prev => ({
                                   ...prev,
                                   enabled_tiles: { ...prev.enabled_tiles, activities: e.target.checked }
                                 }))}
                                 className="w-4 h-4"
                               />
                               <span className="text-white">Activities</span>
                             </label>
                           </div>
                         </div>

                         {/* Actions */}
                         <div className="flex gap-2">
                           <Button
                             onClick={() => savePartnerApp(customizingPartner)}
                             className="bg-green-600 hover:bg-green-700"
                           >
                             Save App Configuration
                           </Button>
                           <Button
                             variant="outline"
                             onClick={() => setCustomizingPartner(null)}
                             className="border-white/20 text-white hover:bg-white/10"
                           >
                             Cancel
                           </Button>
                         </div>
                       </CardContent>
                     </Card>
                   )}
                 </div>
               </TabsContent>

              {/* Bookings Tab */}
              <TabsContent value="bookings">
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id} className="bg-white/10 backdrop-blur-md border-white/20">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <h3 className="text-lg text-white capitalize">{booking.type} Booking</h3>
                            <p className="text-gray-300">Booking ID: {booking.id}</p>
                            <p className="text-gray-400">Tenant: {booking.tenant_slug}</p>
                            {booking.partner_id && (
                              <Badge className="bg-purple-500/20 text-purple-400 border-purple-400/30">
                                Partner: {booking.partner_id}
                              </Badge>
                            )}
                          </div>
                          <div className="text-right space-y-2">
                            <p className="text-2xl text-green-400">{formatCurrency(booking.total_amount)}</p>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                            <p className="text-sm text-gray-400">{formatDate(booking.created_at)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
}