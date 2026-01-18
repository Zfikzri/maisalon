import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, Booking, Profile } from '@/lib/supabase'
import { User, Phone, Mail, Calendar, Clock, DollarSign, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export function ProfilePage() {
    const { user, updateProfile } = useAuth()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [bookings, setBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
    })

    useEffect(() => {
        if (user) {
            fetchProfile()
            fetchBookings()
        }
    }, [user])

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user!.id)
                .single()

            if (error) throw error

            setProfile(data)
            setFormData({
                full_name: data.full_name || '',
                phone: data.phone || '',
            })
        } catch (error: any) {
            console.error('Error fetching profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchBookings = async () => {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select(`
          *,
          service:services(name, duration_minutes, category),
          stylist:stylists(name, image_url)
        `)
                .eq('user_id', user!.id)
                .order('booking_date', { ascending: false })

            if (error) throw error
            setBookings(data || [])
        } catch (error: any) {
            console.error('Error fetching bookings:', error)
        }
    }

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await updateProfile(formData)
            setProfile({ ...profile!, ...formData })
        } catch (error) {
            console.error(error)
        }
    }

    const handleCancelBooking = async (bookingId: string) => {
        if (!confirm('Are you sure you want to cancel this booking?')) return

        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status: 'cancelled' })
                .eq('id', bookingId)

            if (error) throw error

            toast.success('Booking cancelled successfully')
            fetchBookings() // Refresh bookings
        } catch (error: any) {
            toast.error(error.message || 'Failed to cancel booking')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-[#f2f0e8]/30 dark:bg-[#15120a]">
            <div className="mx-auto max-w-[1200px] px-4 md:px-20 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold dark:text-white mb-2">My Profile</h1>
                    <p className="text-soft-gray">Manage your account and view your bookings</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Information Section */}
                    <div className="lg:col-span-1">
                        <motion.div
                            className="bg-white dark:bg-[#2a261a] rounded-2xl luxury-shadow p-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h2 className="text-xl font-bold dark:text-white mb-6">Profile Information</h2>

                            <form onSubmit={handleUpdateProfile} className="space-y-5">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-semibold dark:text-white mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-soft-gray" />
                                        <input
                                            type="text"
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            className="w-full h-12 pl-12 pr-4 bg-background-light dark:bg-[#332e1f] border border-accent-gold/10 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                                {/* Email (Read-only) */}
                                <div>
                                    <label className="block text-sm font-semibold dark:text-white mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-soft-gray" />
                                        <input
                                            type="email"
                                            value={user?.email || ''}
                                            className="w-full h-12 pl-12 pr-4 bg-gray-100 dark:bg-gray-800 border border-accent-gold/10 rounded-lg cursor-not-allowed opacity-60"
                                            disabled
                                        />
                                    </div>
                                    <p className="text-xs text-soft-gray mt-1">Email cannot be changed</p>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-semibold dark:text-white mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-soft-gray" />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full h-12 pl-12 pr-4 bg-background-light dark:bg-[#332e1f] border border-accent-gold/10 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>

                                {/* Save Button */}
                                <button
                                    type="submit"
                                    className="w-full h-11 bg-primary text-white rounded-lg font-bold hover:bg-accent-gold transition-all"
                                >
                                    Save Changes
                                </button>
                            </form>
                        </motion.div>
                    </div>

                    {/* Bookings History Section */}
                    <div className="lg:col-span-2">
                        <motion.div
                            className="bg-white dark:bg-[#2a261a] rounded-2xl luxury-shadow p-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h2 className="text-xl font-bold dark:text-white mb-6">My Bookings</h2>

                            {bookings.length === 0 ? (
                                <div className="text-center py-12">
                                    <Calendar className="w-16 h-16 mx-auto text-soft-gray/30 mb-4" />
                                    <p className="text-soft-gray text-lg mb-2">No bookings yet</p>
                                    <p className="text-sm text-soft-gray/70">Book your first appointment to get started!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {bookings.map((booking, index) => (
                                        <motion.div
                                            key={booking.id}
                                            className="border border-accent-gold/10 rounded-xl p-5 hover:shadow-lg transition-shadow"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <h3 className="text-lg font-bold dark:text-white">
                                                            {booking.service?.name || 'Service'}
                                                        </h3>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'confirmed'
                                                                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                                                : booking.status === 'cancelled'
                                                                    ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                                                            }`}>
                                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-soft-gray">
                                                        <div className="flex items-center gap-2">
                                                            <User className="w-4 h-4" />
                                                            <span>Stylist: {booking.stylist?.name || 'TBD'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>{format(new Date(booking.booking_date), 'MMM d, yyyy')}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4" />
                                                            <span>{booking.booking_time} ({booking.service?.duration_minutes || 0} min)</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <DollarSign className="w-4 h-4" />
                                                            <span>${booking.total_price}</span>
                                                        </div>
                                                    </div>

                                                    {booking.notes && (
                                                        <p className="mt-3 text-sm text-soft-gray italic">
                                                            Note: {booking.notes}
                                                        </p>
                                                    )}
                                                </div>

                                                {booking.status === 'confirmed' && new Date(booking.booking_date) > new Date() && (
                                                    <button
                                                        onClick={() => handleCancelBooking(booking.id)}
                                                        className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
