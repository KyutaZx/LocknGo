export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type LockerStatus = 'ready' | 'reserved' | 'occupied' | 'maintenance';
export type BookingStatus =
  | 'pending_payment'
  | 'paid_unclaimed'
  | 'active'
  | 'completed'
  | 'late'
  | 'secured';
export type PaymentType = 'initial_booking' | 'extend' | 'late_penalty';
export type PaymentStatus = 'pending' | 'settlement' | 'expired' | 'failed';

export interface Database {
  public: {
    Tables: {
      locations: {
        Row: {
          id: string;
          name: string;
          category: 'mall' | 'stasiun' | 'stadion';
          category_label: string;
          area: string;
          open_at: number;
          closes_at: number;
          always_open: boolean;
          open_hours_label: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          category: 'mall' | 'stasiun' | 'stadion';
          category_label: string;
          area: string;
          open_at: number;
          closes_at: number;
          always_open?: boolean;
          open_hours_label: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: 'mall' | 'stasiun' | 'stadion';
          category_label?: string;
          area?: string;
          open_at?: number;
          closes_at?: number;
          always_open?: boolean;
          open_hours_label?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      lockers: {
        Row: {
          id: string;
          location_id: string;
          unit_number: string;
          size: 'M' | 'L';
          is_reserve: boolean;
          status: LockerStatus;
          updated_at: string;
        };
        Insert: {
          id?: string;
          location_id: string;
          unit_number: string;
          size: 'M' | 'L';
          is_reserve?: boolean;
          status?: LockerStatus;
          updated_at?: string;
        };
        Update: {
          id?: string;
          location_id?: string;
          unit_number?: string;
          size?: 'M' | 'L';
          is_reserve?: boolean;
          status?: LockerStatus;
          updated_at?: string;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          booking_code: string;
          user_phone: string;
          location_id: string;
          locker_id: string | null;
          size: 'M' | 'L';
          duration_hours: number;
          status: BookingStatus;
          base_price: number;
          extend_price: number;
          late_fee: number;
          total_paid: number;
          qr_deposit_token: string | null;
          qr_pickup_token: string | null;
          qr_pickup_expires_at: string | null;
          guard_code: string;
          guard_code_failures: number;
          deposit_started_at: string | null;
          rental_starts_at: string | null;
          rental_ends_at: string | null;
          completed_at: string | null;
          reopen_grace_used: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_code: string;
          user_phone: string;
          location_id: string;
          locker_id?: string | null;
          size: 'M' | 'L';
          duration_hours: number;
          status?: BookingStatus;
          base_price: number;
          extend_price?: number;
          late_fee?: number;
          total_paid?: number;
          qr_deposit_token?: string | null;
          qr_pickup_token?: string | null;
          qr_pickup_expires_at?: string | null;
          guard_code: string;
          guard_code_failures?: number;
          deposit_started_at?: string | null;
          rental_starts_at?: string | null;
          rental_ends_at?: string | null;
          completed_at?: string | null;
          reopen_grace_used?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_code?: string;
          user_phone?: string;
          location_id?: string;
          locker_id?: string | null;
          size?: 'M' | 'L';
          duration_hours?: number;
          status?: BookingStatus;
          base_price?: number;
          extend_price?: number;
          late_fee?: number;
          total_paid?: number;
          qr_deposit_token?: string | null;
          qr_pickup_token?: string | null;
          qr_pickup_expires_at?: string | null;
          guard_code?: string;
          guard_code_failures?: number;
          deposit_started_at?: string | null;
          rental_starts_at?: string | null;
          rental_ends_at?: string | null;
          completed_at?: string | null;
          reopen_grace_used?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          booking_id: string;
          payment_type: PaymentType;
          amount: number;
          qris_reference: string | null;
          qris_string: string | null;
          status: PaymentStatus;
          settled_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          payment_type: PaymentType;
          amount: number;
          qris_reference?: string | null;
          qris_string?: string | null;
          status?: PaymentStatus;
          settled_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          payment_type?: PaymentType;
          amount?: number;
          qris_reference?: string | null;
          qris_string?: string | null;
          status?: PaymentStatus;
          settled_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      activity_logs: {
        Row: {
          id: number;
          booking_id: string | null;
          event_type: string;
          description: string;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: number;
          booking_id?: string | null;
          event_type: string;
          description: string;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: number;
          booking_id?: string | null;
          event_type?: string;
          description?: string;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
