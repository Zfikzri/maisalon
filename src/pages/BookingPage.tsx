import { BookingWizard } from '@/components/booking/BookingWizard'

export function BookingPage() {
    return (
        <div className="pt-24 min-h-screen bg-[#f2f0e8]/30 dark:bg-[#15120a]">
            <div className="mx-auto max-w-[1200px] px-4 md:px-20 py-12">
                <div className="mb-12">
                    <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs">
                        Reserve Your Experience
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold dark:text-white mt-4">
                        Book Your Appointment
                    </h1>
                </div>

                <BookingWizard />
            </div>
        </div>
    )
}
