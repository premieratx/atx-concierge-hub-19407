export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      abandoned_orders: {
        Row: {
          abandonment_stage: string
          created_at: string
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          delivery_address: Json | null
          delivery_fee: number | null
          delivery_instructions: string | null
          delivery_time_preference: string | null
          discount_applied: Json | null
          id: string
          order_items: Json
          order_total: number | null
          session_data: Json | null
          special_requests: string | null
          tip_amount: number | null
          updated_at: string
        }
        Insert: {
          abandonment_stage: string
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          delivery_address?: Json | null
          delivery_fee?: number | null
          delivery_instructions?: string | null
          delivery_time_preference?: string | null
          discount_applied?: Json | null
          id?: string
          order_items: Json
          order_total?: number | null
          session_data?: Json | null
          special_requests?: string | null
          tip_amount?: number | null
          updated_at?: string
        }
        Update: {
          abandonment_stage?: string
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          delivery_address?: Json | null
          delivery_fee?: number | null
          delivery_instructions?: string | null
          delivery_time_preference?: string | null
          discount_applied?: Json | null
          id?: string
          order_items?: Json
          order_total?: number | null
          session_data?: Json | null
          special_requests?: string | null
          tip_amount?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      affiliates: {
        Row: {
          affiliate_code: string
          commission_rate: number | null
          company_name: string | null
          created_at: string
          email: string
          id: string
          name: string
          notes: string | null
          payment_info: Json | null
          status: string | null
          total_commission_earned: number | null
          total_referrals: number | null
          updated_at: string
        }
        Insert: {
          affiliate_code: string
          commission_rate?: number | null
          company_name?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          notes?: string | null
          payment_info?: Json | null
          status?: string | null
          total_commission_earned?: number | null
          total_referrals?: number | null
          updated_at?: string
        }
        Update: {
          affiliate_code?: string
          commission_rate?: number | null
          company_name?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          notes?: string | null
          payment_info?: Json | null
          status?: string | null
          total_commission_earned?: number | null
          total_referrals?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      automation_sessions: {
        Row: {
          created_at: string
          id: string
          session_data: Json
          session_type: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          session_data: Json
          session_type: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          session_data?: Json
          session_type?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      cover_pages: {
        Row: {
          content: Json
          created_at: string
          id: string
          slug: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content: Json
          created_at?: string
          id?: string
          slug: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          slug?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      customer_orders: {
        Row: {
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          delivery_address: Json
          delivery_fee: number | null
          delivery_instructions: string | null
          delivery_time_preference: string | null
          discount_applied: Json | null
          id: string
          order_items: Json
          order_status: string | null
          order_total: number
          payment_status: string | null
          special_requests: string | null
          tip_amount: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          delivery_address: Json
          delivery_fee?: number | null
          delivery_instructions?: string | null
          delivery_time_preference?: string | null
          discount_applied?: Json | null
          id?: string
          order_items: Json
          order_status?: string | null
          order_total: number
          payment_status?: string | null
          special_requests?: string | null
          tip_amount?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          delivery_address?: Json
          delivery_fee?: number | null
          delivery_instructions?: string | null
          delivery_time_preference?: string | null
          discount_applied?: Json | null
          id?: string
          order_items?: Json
          order_status?: string | null
          order_total?: number
          payment_status?: string | null
          special_requests?: string | null
          tip_amount?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      delivery_app_variations: {
        Row: {
          app_name: string
          app_slug: string
          business_hours: Json | null
          business_name: string | null
          collections_config: Json | null
          created_at: string
          custom_post_checkout_config: Json | null
          delivery_areas: Json | null
          id: string
          is_active: boolean
          is_homepage: boolean
          logo_url: string | null
          main_app_config: Json | null
          updated_at: string
        }
        Insert: {
          app_name: string
          app_slug: string
          business_hours?: Json | null
          business_name?: string | null
          collections_config?: Json | null
          created_at?: string
          custom_post_checkout_config?: Json | null
          delivery_areas?: Json | null
          id?: string
          is_active?: boolean
          is_homepage?: boolean
          logo_url?: string | null
          main_app_config?: Json | null
          updated_at?: string
        }
        Update: {
          app_name?: string
          app_slug?: string
          business_hours?: Json | null
          business_name?: string | null
          collections_config?: Json | null
          created_at?: string
          custom_post_checkout_config?: Json | null
          delivery_areas?: Json | null
          id?: string
          is_active?: boolean
          is_homepage?: boolean
          logo_url?: string | null
          main_app_config?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      kv_store_1f80af87: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      shopify_discount_codes_cache: {
        Row: {
          code: string
          created_at: string
          customer_selection: string | null
          ends_at: string | null
          id: string
          is_recomsale_code: boolean | null
          minimum_order_amount: number | null
          once_per_customer: boolean | null
          raw_data: Json | null
          shopify_discount_id: string
          shopify_price_rule_id: string | null
          starts_at: string | null
          target_type: string | null
          title: string | null
          updated_at: string
          usage_count: number | null
          usage_limit: number | null
          value: string | null
          value_type: string | null
        }
        Insert: {
          code: string
          created_at?: string
          customer_selection?: string | null
          ends_at?: string | null
          id?: string
          is_recomsale_code?: boolean | null
          minimum_order_amount?: number | null
          once_per_customer?: boolean | null
          raw_data?: Json | null
          shopify_discount_id: string
          shopify_price_rule_id?: string | null
          starts_at?: string | null
          target_type?: string | null
          title?: string | null
          updated_at?: string
          usage_count?: number | null
          usage_limit?: number | null
          value?: string | null
          value_type?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          customer_selection?: string | null
          ends_at?: string | null
          id?: string
          is_recomsale_code?: boolean | null
          minimum_order_amount?: number | null
          once_per_customer?: boolean | null
          raw_data?: Json | null
          shopify_discount_id?: string
          shopify_price_rule_id?: string | null
          starts_at?: string | null
          target_type?: string | null
          title?: string | null
          updated_at?: string
          usage_count?: number | null
          usage_limit?: number | null
          value?: string | null
          value_type?: string | null
        }
        Relationships: []
      }
      shopify_products_cache: {
        Row: {
          collection_handles: string[] | null
          created_at: string
          id: string
          product_data: Json
          shopify_product_id: string
          updated_at: string
        }
        Insert: {
          collection_handles?: string[] | null
          created_at?: string
          id?: string
          product_data: Json
          shopify_product_id: string
          updated_at?: string
        }
        Update: {
          collection_handles?: string[] | null
          created_at?: string
          id?: string
          product_data?: Json
          shopify_product_id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
