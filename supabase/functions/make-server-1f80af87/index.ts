import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Database {
  public: {
    Tables: {
      affiliates: {
        Row: {
          id: string
          name: string
          email: string
          company_name: string | null
          affiliate_code: string
          commission_rate: number
          total_referrals: number
          total_commission_earned: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          email: string
          company_name?: string | null
          affiliate_code: string
          commission_rate?: number
          status?: string
        }
      }
    }
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    const url = new URL(req.url)
    const pathname = url.pathname
    const functionName = 'make-server-1f80af87'
    // Normalize path to always be the part after the function name, whether the
    // platform keeps /functions/v1 in the pathname or not
    let path = pathname
    if (path.startsWith(`/functions/v1/${functionName}`)) {
      path = path.replace(`/functions/v1/${functionName}`, '')
    } else if (path.startsWith(`/${functionName}`)) {
      path = path.replace(`/${functionName}`, '')
    }

    console.log('Raw pathname:', pathname)
    console.log('Request path:', path)
    console.log('Request method:', req.method)

    // Admin Overview
    if (path === '/admin/overview' && req.method === 'GET') {
      console.log('Fetching admin overview data...')

      // Get affiliates data
      const { data: affiliates, error: affiliatesError } = await supabaseClient
        .from('affiliates')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      if (affiliatesError) {
        console.error('Error fetching affiliates:', affiliatesError)
      }

      // Mock data for now since we don't have all tables yet
      const stats = {
        total_tenants: 5,
        total_partners: affiliates?.length || 0,
        total_bookings: 45,
        total_revenue: 12500,
        total_commissions: 1250
      }

      const mockTenants = [
        {
          id: '1',
          client_name: 'Downtown Delivery',
          company_name: 'Metro Foods Inc',
          email: 'admin@metrofoods.com',
          status: 'active',
          created_at: new Date().toISOString(),
          branding: {
            primary_color: '#6366f1',
            welcome_message: 'Welcome to Downtown Delivery - Your local food delivery service'
          }
        }
      ]

      const mockBookings = [
        {
          id: '1',
          user_id: 'user123',
          tenant_slug: 'downtown-delivery',
          partner_id: affiliates?.[0]?.id,
          type: 'delivery',
          total_amount: 45.99,
          status: 'confirmed',
          created_at: new Date().toISOString()
        }
      ]

      return new Response(
        JSON.stringify({
          stats,
          recent_tenants: mockTenants,
          recent_partners: affiliates || [],
          recent_bookings: mockBookings
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Create Partner/Affiliate
    if (path === '/admin/partner' && req.method === 'POST') {
      const body = await req.json()
      const { name, email, company_name, commission_rate } = body

      // Generate unique affiliate code
      const affiliateCode = `${name.substring(0, 3).toUpperCase()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`

      const { data: newAffiliate, error } = await supabaseClient
        .from('affiliates')
        .insert({
          name,
          email,
          company_name,
          affiliate_code: affiliateCode,
          commission_rate: commission_rate || 10.0,
          status: 'active'
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating affiliate:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ 
          affiliate: newAffiliate,
          referral_link: `${url.origin}?ref=${affiliateCode}`,
          discount_code: `${affiliateCode}SAVE` 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Save Partner App Configuration
    if (path.startsWith('/admin/partner/') && path.endsWith('/app') && req.method === 'POST') {
      const partnerId = path.split('/')[3]
      const body = await req.json()
      const { app_name, business_name, logo_url, discount_code, enabled_tiles, primary_color, welcome_message } = body

      // Create app slug from business name
      const appSlug = business_name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')

      // First check if app already exists for this partner
      const { data: existingApp } = await supabaseClient
        .from('delivery_app_variations')
        .select('id')
        .eq('app_slug', appSlug)
        .single()

      const appConfig = {
        main_app_config: {
          title: app_name,
          welcome_message,
          primary_color,
          discount_code,
          enabled_services: enabled_tiles
        }
      }

      let result
      if (existingApp) {
        // Update existing app
        result = await supabaseClient
          .from('delivery_app_variations')
          .update({
            app_name,
            business_name,
            logo_url: logo_url || null,
            main_app_config: appConfig.main_app_config,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingApp.id)
          .select()
          .single()
      } else {
        // Create new app
        result = await supabaseClient
          .from('delivery_app_variations')
          .insert({
            app_name,
            business_name,
            app_slug: appSlug,
            logo_url: logo_url || null,
            main_app_config: appConfig.main_app_config,
            is_active: true
          })
          .select()
          .single()
      }

      if (result.error) {
        console.error('Error saving partner app:', result.error)
        return new Response(
          JSON.stringify({ error: result.error.message }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ app: result.data }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Update Partner Commission
    if (path.startsWith('/admin/partner/') && path.endsWith('/commission') && req.method === 'POST') {
      const partnerId = path.split('/')[3]
      const body = await req.json()
      const { commission_rate } = body

      const { data: updatedAffiliate, error } = await supabaseClient
        .from('affiliates')
        .update({ commission_rate })
        .eq('id', partnerId)
        .select()
        .single()

      if (error) {
        console.error('Error updating commission:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ affiliate: updatedAffiliate }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get Partner Dashboard
    if (path.match(/^\/partner\/[^\/]+\/dashboard$/) && req.method === 'GET') {
      const partnerId = path.split('/')[2]
      
      const { data: affiliate, error } = await supabaseClient
        .from('affiliates')
        .select('*')
        .eq('id', partnerId)
        .single()

      if (error || !affiliate) {
        return new Response(
          JSON.stringify({ error: 'Partner not found' }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // Mock data for demo - in real app, fetch from actual bookings/orders
      const mockStats = {
        total_sales: affiliate.total_referrals * 150,
        total_commission: affiliate.total_commission_earned,
        total_bookings: affiliate.total_referrals,
        commission_rate: affiliate.commission_rate / 100
      }

      const mockBookings = [
        {
          id: '1',
          tenant_slug: 'austin-services',
          type: 'boat rental',
          total_amount: 299.99,
          status: 'confirmed',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          tenant_slug: 'austin-services',
          type: 'alcohol delivery',
          total_amount: 89.50,
          status: 'pending',
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ]

      return new Response(
        JSON.stringify({
          partner: {
            id: affiliate.id,
            name: affiliate.name,
            email: affiliate.email,
            company: affiliate.company_name,
            commission_rate: affiliate.commission_rate / 100,
            total_sales: mockStats.total_sales,
            total_commission: affiliate.total_commission_earned,
            created_at: affiliate.created_at
          },
          stats: mockStats,
          recent_bookings: mockBookings
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get Partner by Affiliate Code
    if (path.startsWith('/partner/') && !path.includes('/dashboard') && req.method === 'GET') {
      const affiliateCode = path.split('/')[2]
      
      const { data: affiliate, error } = await supabaseClient
        .from('affiliates')
        .select('*')
        .eq('affiliate_code', affiliateCode)
        .single()

      if (error || !affiliate) {
        return new Response(
          JSON.stringify({ error: 'Affiliate not found' }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      return new Response(
        JSON.stringify({ affiliate }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Server error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})