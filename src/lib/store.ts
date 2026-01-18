import { create } from 'zustand'

export interface Service {
    id: string
    name: string
    description: string
    duration_minutes: number
    base_price: number
    category: string
    image_url: string
}

export interface Stylist {
    id: string
    name: string
    bio: string
    specialties: string[]
    rating: number
    image_url: string
    portfolio_images: string[]
}

export interface BookingState {
    selectedService: Service | null
    selectedStylist: Stylist | null
    selectedDate: Date | null
    selectedTime: string | null
    currentStep: number
    setSelectedService: (service: Service | null) => void
    setSelectedStylist: (stylist: Stylist | null) => void
    setSelectedDate: (date: Date | null) => void
    setSelectedTime: (time: string | null) => void
    setCurrentStep: (step: number) => void
    resetBooking: () => void
}

export const useBookingStore = create<BookingState>((set) => ({
    selectedService: null,
    selectedStylist: null,
    selectedDate: null,
    selectedTime: null,
    currentStep: 0,
    setSelectedService: (service) => set({ selectedService: service }),
    setSelectedStylist: (stylist) => set({ selectedStylist: stylist }),
    setSelectedDate: (date) => set({ selectedDate: date }),
    setSelectedTime: (time) => set({ selectedTime: time }),
    setCurrentStep: (step) => set({ currentStep: step }),
    resetBooking: () => set({
        selectedService: null,
        selectedStylist: null,
        selectedDate: null,
        selectedTime: null,
        currentStep: 0
    }),
}))
