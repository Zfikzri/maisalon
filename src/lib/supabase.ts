import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// TypeScript types for database tables
export interface Service {
    id: string
    name: string
    description: string
    duration_minutes: number
    base_price: number
    category: string
    image_url: string
    created_at?: string
}

export interface Stylist {
    id: string
    name: string
    bio: string
    specialties: string[]
    rating: number
    image_url: string
    portfolio_images: string[]
    created_at?: string
}

export interface Profile {
    id: string
    email: string
    full_name: string
    phone?: string
    avatar_url?: string
    created_at?: string
    updated_at?: string
}

export interface Booking {
    id: string
    user_id: string
    service_id: string
    stylist_id: string
    booking_date: string
    booking_time: string
    status: 'confirmed' | 'cancelled' | 'completed'
    notes?: string
    total_price: number
    created_at?: string
    // Joined data
    service?: Service
    stylist?: Stylist
}
