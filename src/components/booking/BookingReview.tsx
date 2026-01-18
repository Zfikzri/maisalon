import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useBookingStore } from '@/lib/store'
import { format } from 'date-fns'
import { Check, ChevronLeft, Calendar, Clock, User, Scissors, DollarSign, Loader2, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { createSnapToken, openPaymentPopup, type PaymentResult } from '@/lib/midtrans'

export function BookingReview() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { selectedService, selectedStylist, selectedDate, selectedTime, setCurrentStep, resetBooking } = useBookingStore()
    const [notes, setNotes] = useState('')
    const [isConfirmed, setIsConfirmed] = useState(false)
    const [bookingId, setBookingId] = useState<string | null>(null)

    const createBookingMutation = useMutation({
        mutationFn: async () => {
            if (!user) throw new Error('You must be logged in to book')
            if (!selectedService || !selectedStylist || !selectedDate || !selectedTime) {
                throw new Error('Missing booking information')
            }

            // Step 1: Create booking with pending_payment status
            const { data, error } = await supabase
                .from('bookings')
                .insert({
                    user_id: user.id,
                    service_id: selectedService.id,
                    stylist_id: selectedStylist.id,
                    booking_date: format(selectedDate, 'yyyy-MM-dd'),
                    booking_time: selectedTime,
                    notes: notes || null,
                    total_price: selectedService.base_price,
                    status: 'pending_payment',
                    payment_status: 'pending'
                })
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: async (booking) => {
            setBookingId(booking.id)

            try {
                // Step 2: Create payment token
                const token = await createSnapToken({
                    orderId: `BOOKING-${booking.id.slice(0, 8).toUpperCase()}`,
                    amount: Number(booking.total_price),
                    customerName: user?.email?.split('@')[0] || 'Customer',
                    customerEmail: user?.email || '',
                    itemName: selectedService!.name,
                    itemPrice: Number(selectedService!.base_price)
                })

                // Step 3: Open payment popup
                openPaymentPopup(
                    token,
                    async (result: PaymentResult) => {
                        // Payment success
                        await handlePaymentSuccess(booking.id, result)
                    },
                    async (result: PaymentResult) => {
                        // Payment pending
                        await handlePaymentPending(booking.id, result)
                    },
                    async (result: PaymentResult) => {
                        // Payment error
                        await handlePaymentError(booking.id, result)
                    }
                )
            } catch (error: any) {
                toast.error(error.message || 'Failed to process payment')
                // Delete the booking if payment initialization fails
                await supabase.from('bookings').delete().eq('id', booking.id)
            }
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create booking')
            console.error('Booking error:', error)
        }
    })

    const handlePaymentSuccess = async (id: string, result: PaymentResult) => {
        try {
            await supabase
                .from('bookings')
                .update({
                    status: 'confirmed',
                    payment_status: 'paid',
                    payment_method: result.payment_type,
                    transaction_id: result.transaction_id
                })
                .eq('id', id)

            toast.success('Payment successful! Booking confirmed.')
            setIsConfirmed(true)

            setTimeout(() => {
                resetBooking()
                navigate('/profile')
            }, 3000)
        } catch (error: any) {
            console.error('Error updating booking:', error)
        }
    }

    const handlePaymentPending = async (id: string, result: PaymentResult) => {
        try {
            await supabase
                .from('bookings')
                .update({
                    payment_status: 'pending',
                    payment_method: result.payment_type,
                    transaction_id: result.transaction_id
                })
                .eq('id', id)

            toast.info('Payment pending. Please complete payment to confirm your booking.')

            setTimeout(() => {
                resetBooking()
                navigate('/profile')
            }, 3000)
        } catch (error: any) {
            console.error('Error updating booking:', error)
        }
    }

    const handlePaymentError = async (id: string, result: PaymentResult) => {
        try {
            await supabase
                .from('bookings')
                .update({
                    status: 'cancelled',
                    payment_status: 'failed'
                })
                .eq('id', id)

            toast.error('Payment failed. Please try again.')
        } catch (error: any) {
            console.error('Error updating booking:', error)
        }
    }

    const handleBack = () => {
        setCurrentStep(2)
    }

    const handleConfirmAndPay = () => {
        createBookingMutation.mutate()
    }

    if (isConfirmed) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-6">
                    <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-3xl font-bold dark:text-white mb-3">Payment Successful!</h2>
                <p className="text-soft-gray text-lg mb-2">Your appointment has been confirmed.</p>
                <p className="text-sm text-soft-gray">Redirecting to your profile...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold dark:text-white mb-2">Review & Payment</h2>
                <p className="text-soft-gray">Review your booking details and proceed to payment</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Booking Details */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-[#332e1f] p-6 rounded-xl border border-accent-gold/10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Scissors className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-soft-gray uppercase tracking-wider">Service</p>
                                <p className="font-bold dark:text-white">{selectedService?.name}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-soft-gray uppercase tracking-wider">Stylist</p>
                                <p className="font-bold dark:text-white">{selectedStylist?.name}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-soft-gray uppercase tracking-wider">Date</p>
                                <p className="font-bold dark:text-white">
                                    {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-soft-gray uppercase tracking-wider">Time</p>
                                <p className="font-bold dark:text-white">{selectedTime} ({selectedService?.duration_minutes} min)</p>
                            </div>
                        </div>
                    </div>

                    {/* Price Summary */}
                    <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-xl border border-primary/20">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-soft-gray">Service Price</span>
                            <span className="font-bold dark:text-white">${selectedService?.base_price}</span>
                        </div>
                        <div className="pt-4 border-t border-primary/20 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-primary" />
                                <span className="font-bold text-lg dark:text-white">Total</span>
                            </div>
                            <span className="font-bold text-2xl text-primary">${selectedService?.base_price}</span>
                        </div>
                    </div>
                </div>

                {/* Additional Notes & Payment Info */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold dark:text-white mb-3">
                            Additional Notes (Optional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Any special requests or information for your stylist..."
                            className="w-full h-40 px-4 py-3 bg-white dark:bg-[#332e1f] border border-accent-gold/10 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
                        />
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            Secure Payment
                        </h4>
                        <p className="text-sm text-blue-800 dark:text-blue-400 leading-relaxed mb-3">
                            After clicking "Confirm & Pay", you'll be redirected to our secure payment gateway powered by Midtrans.
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-500">
                            Accepted: Credit Card, Debit Card, Bank Transfer, GoPay, OVO
                        </p>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <h4 className="font-bold text-yellow-900 dark:text-yellow-300 mb-2">Cancellation Policy</h4>
                        <p className="text-sm text-yellow-800 dark:text-yellow-400 leading-relaxed">
                            Please notify us at least 24 hours in advance if you need to cancel or reschedule your appointment.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-accent-gold/10">
                <button
                    onClick={handleBack}
                    disabled={createBookingMutation.isPending}
                    className="px-6 py-3 rounded-lg font-bold text-soft-gray hover:text-primary transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                </button>
                <button
                    onClick={handleConfirmAndPay}
                    disabled={createBookingMutation.isPending}
                    className={cn(
                        'px-8 py-3 rounded-lg font-bold transition-all flex items-center gap-2',
                        'bg-gradient-to-r from-primary to-accent-gold text-white hover:shadow-lg disabled:opacity-50'
                    )}
                >
                    {createBookingMutation.isPending ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <CreditCard className="w-5 h-5" />
                            Confirm & Pay ${selectedService?.base_price}
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
