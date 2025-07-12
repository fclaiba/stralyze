export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    tables: {
      clients: {
        Row: {
          id: string
          company: string
          status: string
          industry: string
          contact: string
          email: string
          phone: string
          payment_method: string
          contract_status: string
          deposit: number
          final_payment: number
          total_amount: number
          budget?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company: string
          status: string
          industry: string
          contact: string
          email: string
          phone?: string
          payment_method?: string
          contract_status?: string
          deposit?: number
          final_payment?: number
          total_amount?: number
          budget?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company?: string
          status?: string
          industry?: string
          contact?: string
          email?: string
          phone?: string
          payment_method?: string
          contract_status?: string
          deposit?: number
          final_payment?: number
          total_amount?: number
          budget?: string
          created_at?: string
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          user_id: string
          action: string
          resource_type: string
          resource_id: string
          changes: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          resource_type: string
          resource_id: string
          changes: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          resource_type?: string
          resource_id?: string
          changes?: Json
          created_at?: string
        }
      }
    }
  }
}
