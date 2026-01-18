import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useBookingStore } from '@/lib/store'
import { Calendar, Clock, ChevronLeft } from 'lucide-react'
import { format, addDays, startOfWeek } from 'date-fns'
import { cn } from '@/lib/utils'

export function TimeSlotPicker() {
    const { selectedService, selectedStylist, selectedDate, selectedTime, setSelectedDate, setSelectedTime, setCurrentStep } = useBookingStore()

    const [displayDate, setDisplayDate] = useState(new Date())

    // Generate week days
    const weekStart = startOfWeek(displayDate, { weekStartsOn: 1 })
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

    // Fetch available time slots
    const { data: timeSlots, isLoading } = useQuery({
        queryKey: ['timeSlots', selectedStylist?.id, selectedDate, selectedService?.duration_minutes],
        queryFn: () => {
            if (!selectedStylist || !selectedDate || !selectedService) return []
            return api.getTimeSlots(
                selectedStylist.id,
                format(selectedDate, 'yyyy-MM-dd'),
                selectedService.duration_minutes
            )
        },
        enabled: !!selectedStylist && !!selectedDate && !!selectedService,
    })

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date)
        setSelectedTime(null) // Reset time when date changes
    }

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time)
    }

    const handleContinue = () => {
        if (selectedDate && selectedTime) {
            setCurrentStep(3)
        }
    }

    const handleBack = () => {
        setCurrentStep(1)
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold dark:text-white mb-2">Select Date & Time</h2>
                <p className="text-soft-gray">Choose your preferred appointment time</p>
            </div>

            {/* Date Selection */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold dark:text-white">Choose a Date</h3>
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((day) => {
                        const isSelected = selectedDate && format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                        const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                        const isPast = day < new Date() && !isToday

                        return (
                            <button
                                key={day.toString()}
                                onClick={() => !isPast && handleDateSelect(day)}
                                disabled={isPast}
                                className={cn(
                                    'flex flex-col items-center p-3 rounded-lg transition-all',
                                    isSelected
                                        ? 'bg-primary text-white shadow-lg'
                                        : isPast
                                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                                            : 'bg-white dark:bg-[#332e1f] hover:bg-primary/10 border border-accent-gold/10'
                                )}
                            >
                                <span className="text-xs font-medium mb-1">{format(day, 'EEE')}</span>
                                <span className="text-lg font-bold">{format(day, 'd')}</span>
                                {isToday && !isSelected && (
                                    <div className="w-1 h-1 rounded-full bg-primary mt-1" />
                                )}
                            </button>
                        )
                    })}
                </div>

                <div className="flex justify-center gap-4 mt-4">
                    <button
                        onClick={() => setDisplayDate(addDays(displayDate, -7))}
                        className="px-4 py-2 text-sm font-semibold text-soft-gray hover:text-primary transition-colors"
                    >
                        ← Previous Week
                    </button>
                    <button
                        onClick={() => setDisplayDate(addDays(displayDate, 7))}
                        className="px-4 py-2 text-sm font-semibold text-soft-gray hover:text-primary transition-colors"
                    >
                        Next Week →
                    </button>
                </div>
            </div>

            {/* Time Slot Selection */}
            {selectedDate && (
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Clock className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-bold dark:text-white">Choose a Time</h3>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-8 text-soft-gray">Loading available slots...</div>
                    ) : timeSlots && timeSlots.length > 0 ? (
                        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                            {timeSlots.map((time) => {
                                const isSelected = selectedTime === time

                                return (
                                    <button
                                        key={time}
                                        onClick={() => handleTimeSelect(time)}
                                        className={cn(
                                            'px-4 py-3 rounded-lg font-semibold text-sm transition-all',
                                            isSelected
                                                ? 'bg-primary text-white shadow-lg'
                                                : 'bg-white dark:bg-[#332e1f] hover:bg-primary/10 border border-accent-gold/10'
                                        )}
                                    >
                                        {time}
                                    </button>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-red-50 dark:bg-red-900/10 rounded-lg">
                            <p className="text-red-600 dark:text-red-400 font-medium">
                                No available slots for this date. Please choose another date.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Service Duration Info */}
            {selectedService && (
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm text-soft-gray">
                        <strong className="text-primary">Service Duration:</strong> {selectedService.duration_minutes} minutes.
                        Please ensure you're available for the entire duration.
                    </p>
                </div>
            )}

            <div className="flex justify-between pt-6 border-t border-accent-gold/10">
                <button
                    onClick={handleBack}
                    className="px-6 py-3 rounded-lg font-bold text-soft-gray hover:text-primary transition-colors flex items-center gap-2"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                </button>
                <button
                    onClick={handleContinue}
                    disabled={!selectedDate || !selectedTime}
                    className={cn(
                        'px-8 py-3 rounded-lg font-bold transition-all',
                        selectedDate && selectedTime
                            ? 'bg-primary text-white hover:bg-accent-gold'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    )}
                >
                    Continue to Review
                </button>
            </div>
        </div>
    )
}
