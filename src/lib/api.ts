import { Service, Stylist } from './store'

// Mock services data
export const mockServices: Service[] = [
    {
        id: '1',
        name: 'Hair Styling',
        description: 'Expert precision cuts, bridal styling, and transformative hair therapy tailored to your texture.',
        duration_minutes: 45,
        base_price: 85,
        category: 'Hair',
        image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80'
    },
    {
        id: '2',
        name: 'Skincare',
        description: 'Premium facials, rejuvenation peels, and advanced dermaplaning for a radiant glow.',
        duration_minutes: 60,
        base_price: 120,
        category: 'Skin',
        image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80'
    },
    {
        id: '3',
        name: 'Artistic Color',
        description: 'Bespoke balayage, dimensional foils, and high-fashion color by master colorists.',
        duration_minutes: 120,
        base_price: 150,
        category: 'Hair',
        image_url: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80'
    },
    {
        id: '4',
        name: 'Manicure & Pedicure',
        description: 'Luxurious hand and foot care with premium products and expert techniques.',
        duration_minutes: 75,
        base_price: 95,
        category: 'Nails',
        image_url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80'
    },
    {
        id: '5',
        name: 'Makeup Artistry',
        description: 'Professional makeup for special occasions, bridal, or everyday elegance.',
        duration_minutes: 90,
        base_price: 110,
        category: 'Makeup',
        image_url: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80'
    },
    {
        id: '6',
        name: 'Hair Treatment',
        description: 'Deep conditioning, keratin treatments, and scalp therapy for healthy, lustrous hair.',
        duration_minutes: 90,
        base_price: 140,
        category: 'Hair',
        image_url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80'
    },
]

// Mock stylists data
export const mockStylists: Stylist[] = [
    {
        id: '1',
        name: 'Isabella Martinez',
        bio: 'Award-winning stylist with 12 years of experience in luxury salons across Paris and New York.',
        specialties: ['Hair Styling', 'Artistic Color', 'Bridal'],
        rating: 4.9,
        image_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
        portfolio_images: [
            'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80',
            'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80',
        ]
    },
    {
        id: '2',
        name: 'David Chen',
        bio: 'Specialized in precision cuts and modern styling techniques with a minimalist approach.',
        specialties: ['Hair Styling', 'Hair Treatment'],
        rating: 4.8,
        image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
        portfolio_images: [
            'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&q=80',
        ]
    },
    {
        id: '3',
        name: 'Sophie Laurent',
        bio: 'Expert aesthetician focused on natural skincare and rejuvenation treatments.',
        specialties: ['Skincare', 'Makeup Artistry'],
        rating: 5.0,
        image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
        portfolio_images: [
            'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80',
            'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&q=80',
        ]
    },
    {
        id: '4',
        name: 'Marcus Johnson',
        bio: 'Master colorist known for creating stunning balayage and color corrections.',
        specialties: ['Artistic Color', 'Hair Styling'],
        rating: 4.9,
        image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
        portfolio_images: [
            'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&q=80',
        ]
    },
]

// Mock API functions
export const api = {
    getServices: async (): Promise<Service[]> => {
        await new Promise(resolve => setTimeout(resolve, 500))
        return mockServices
    },

    getStylists: async (specialty?: string): Promise<Stylist[]> => {
        await new Promise(resolve => setTimeout(resolve, 500))
        if (specialty) {
            return mockStylists.filter(s => s.specialties.includes(specialty))
        }
        return mockStylists
    },

    getStylist: async (id: string): Promise<Stylist | null> => {
        await new Promise(resolve => setTimeout(resolve, 300))
        return mockStylists.find(s => s.id === id) || null
    },

    getTimeSlots: async (stylistId: string, date: string, durationMinutes: number): Promise<string[]> => {
        await new Promise(resolve => setTimeout(resolve, 400))

        // Generate time slots from 9 AM to 6 PM
        const slots: string[] = []
        const startHour = 9
        const endHour = 18

        for (let hour = startHour; hour < endHour; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
                // Check if there's enough time for the service before closing
                const slotMinutes = hour * 60 + minute
                const endMinutes = endHour * 60
                if (slotMinutes + durationMinutes <= endMinutes) {
                    slots.push(timeSlot)
                }
            }
        }

        // Randomly remove some slots to simulate booked times
        return slots.filter((_, index) => Math.random() > 0.3)
    },

    createBooking: async (data: any): Promise<any> => {
        await new Promise(resolve => setTimeout(resolve, 800))
        return {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            status: 'confirmed',
            created_at: new Date().toISOString()
        }
    }
}
