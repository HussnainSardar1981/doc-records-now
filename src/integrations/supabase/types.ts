export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      inmates: {
        Row: {
          id: string
          doc_number: string
          first_name: string
          last_name: string
          full_name: string
          age: string | null
          current_location: string | null
          status: string
          is_dummy: boolean
          phone_records_available: boolean
          visitor_records_available: boolean
          phone_records_available_date: string | null
          visitor_records_available_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          doc_number: string
          first_name: string
          last_name: string
          full_name: string
          age?: string | null
          current_location?: string | null
          status?: string
          is_dummy?: boolean
          phone_records_available?: boolean
          visitor_records_available?: boolean
          phone_records_available_date?: string | null
          visitor_records_available_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          doc_number?: string
          first_name?: string
          last_name?: string
          full_name?: string
          age?: string | null
          current_location?: string | null
          status?: string
          is_dummy?: boolean
          phone_records_available?: boolean
          visitor_records_available?: boolean
          phone_records_available_date?: string | null
          visitor_records_available_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          currency: string
          id: string
          inmate_id: string
          paid_amount: number
          payment_status: string
          process_status: string
          record_types: string[]
          stripe_session_id: string | null
          updated_at: string
          user_email: string
          user_id: string
          inmate_doc_number: string | null
          phone_record_id: string | null
          visitor_record_id: string | null
          records_unlocked: boolean
          fulfillment_status: string
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          inmate_id: string
          paid_amount: number
          payment_status?: string
          process_status?: string
          record_types: string[]
          stripe_session_id?: string | null
          updated_at?: string
          user_email: string
          user_id: string
          inmate_doc_number?: string | null
          phone_record_id?: string | null
          visitor_record_id?: string | null
          records_unlocked?: boolean
          fulfillment_status?: string
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          inmate_id?: string
          paid_amount?: number
          payment_status?: string
          process_status?: string
          record_types?: string[]
          stripe_session_id?: string | null
          updated_at?: string
          user_email?: string
          user_id?: string
          inmate_doc_number?: string | null
          phone_record_id?: string | null
          visitor_record_id?: string | null
          records_unlocked?: boolean
          fulfillment_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_phone_record_id_fkey"
            columns: ["phone_record_id"]
            isOneToOne: false
            referencedRelation: "phone_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_visitor_record_id_fkey"
            columns: ["visitor_record_id"]
            isOneToOne: false
            referencedRelation: "visitation_records"
            referencedColumns: ["id"]
          }
        ]
      }
      phone_records: {
        Row: {
          id: string
          inmate_id: string
          doc_number: string
          call_history: Json
          total_calls: number
          total_approved_numbers: number
          raw_data: string | null
          last_updated: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          inmate_id: string
          doc_number: string
          call_history?: Json
          total_calls?: number
          total_approved_numbers?: number
          raw_data?: string | null
          last_updated?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          inmate_id?: string
          doc_number?: string
          call_history?: Json
          total_calls?: number
          total_approved_numbers?: number
          raw_data?: string | null
          last_updated?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "phone_records_inmate_id_fkey"
            columns: ["inmate_id"]
            isOneToOne: true
            referencedRelation: "inmates"
            referencedColumns: ["id"]
          }
        ]
      }
      visitation_records: {
        Row: {
          id: string
          inmate_id: string
          doc_number: string
          approved_visitors: Json
          visit_history: Json
          total_approved_visitors: number
          total_visits: number
          raw_data: string | null
          last_updated: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          inmate_id: string
          doc_number: string
          approved_visitors?: Json
          visit_history?: Json
          total_approved_visitors?: number
          total_visits?: number
          raw_data?: string | null
          last_updated?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          inmate_id?: string
          doc_number?: string
          approved_visitors?: Json
          visit_history?: Json
          total_approved_visitors?: number
          total_visits?: number
          raw_data?: string | null
          last_updated?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "visitation_records_inmate_id_fkey"
            columns: ["inmate_id"]
            isOneToOne: true
            referencedRelation: "inmates"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
          state: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          state: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          state?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
