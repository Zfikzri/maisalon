import { useBookingStore } from '@/lib/store'
import { ServiceSelection } from './ServiceSelection'
import { StylistSelection } from './StylistSelection'
import { TimeSlotPicker } from './TimeSlotPicker'
import { BookingReview } from './BookingReview'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const steps = [
    { id: 0, name: 'Service', component: ServiceSelection },
    { id: 1, name: 'Stylist', component: StylistSelection },
    { id: 2, name: 'Date & Time', component: TimeSlotPicker },
    { id: 3, name: 'Review', component: BookingReview },
]

export function BookingWizard() {
    const { currentStep } = useBookingStore()
    const CurrentStepComponent = steps[currentStep].component

    return (
        <div className="bg-white dark:bg-[#2a261a] rounded-2xl luxury-shadow overflow-hidden">
            {/* Progress Steps */}
            <div className="border-b border-accent-gold/10 px-8 py-6">
                <div className="flex items-center justify-between max-w-3xl mx-auto">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                            <div className="flex flex-col items-center">
                                <div
                                    className={cn(
                                        'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all',
                                        currentStep > step.id
                                            ? 'bg-primary text-white'
                                            : currentStep === step.id
                                                ? 'bg-primary text-white ring-4 ring-primary/20'
                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                                    )}
                                >
                                    {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id + 1}
                                </div>
                                <span
                                    className={cn(
                                        'mt-2 text-xs font-semibold',
                                        currentStep >= step.id
                                            ? 'text-primary'
                                            : 'text-gray-400'
                                    )}
                                >
                                    {step.name}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={cn(
                                        'w-16 md:w-24 h-1 mx-2 mb-6 transition-all',
                                        currentStep > step.id
                                            ? 'bg-primary'
                                            : 'bg-gray-200 dark:bg-gray-700'
                                    )}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div className="p-8 md:p-12">
                <CurrentStepComponent />
            </div>
        </div>
    )
}
