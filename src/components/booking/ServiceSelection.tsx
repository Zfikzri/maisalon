import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useBookingStore } from '@/lib/store'
import { motion } from 'framer-motion'
import { Clock, DollarSign, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ServiceSelection() {
    const { data: services } = useQuery({
        queryKey: ['services'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .order('name')

            if (error) throw error
            return data
        },
    })
    const { selectedService, setSelectedService, setCurrentStep } = useBookingStore()

    const handleSelectService = (service: any) => {
        setSelectedService(service)
    }

    const handleContinue = () => {
        if (selectedService) {
            setCurrentStep(1)
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold dark:text-white mb-2">Choose Your Service</h2>
                <p className="text-soft-gray">Select the service you'd like to book</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services?.map((service, index) => (
                    <motion.div
                        key={service.id}
                        className={cn(
                            'relative flex flex-col bg-white dark:bg-[#332e1f] rounded-xl overflow-hidden border-2 cursor-pointer transition-all hover:scale-[1.02]',
                            selectedService?.id === service.id
                                ? 'border-primary shadow-lg shadow-primary/20'
                                : 'border-transparent hover:border-primary/30'
                        )}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        onClick={() => handleSelectService(service)}
                    >
                        {selectedService?.id === service.id && (
                            <div className="absolute top-4 right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center z-10">
                                <Check className="w-5 h-5 text-white" />
                            </div>
                        )}

                        <div
                            className="w-full aspect-video bg-center bg-cover"
                            style={{ backgroundImage: `url(${service.image_url})` }}
                        />

                        <div className="p-4">
                            <h3 className="text-lg font-bold dark:text-white mb-2">{service.name}</h3>
                            <p className="text-soft-gray text-sm mb-4 line-clamp-2">{service.description}</p>

                            <div className="flex items-center justify-between pt-3 border-t border-accent-gold/10">
                                <div className="flex items-center gap-1 text-soft-gray text-sm">
                                    <Clock className="w-4 h-4" />
                                    {service.duration_minutes}min
                                </div>
                                <div className="flex items-center gap-1 text-primary font-bold">
                                    <DollarSign className="w-4 h-4" />
                                    {service.base_price}+
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="flex justify-end pt-6 border-t border-accent-gold/10">
                <button
                    onClick={handleContinue}
                    disabled={!selectedService}
                    className={cn(
                        'px-8 py-3 rounded-lg font-bold transition-all',
                        selectedService
                            ? 'bg-primary text-white hover:bg-accent-gold'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    )}
                >
                    Continue to Stylist Selection
                </button>
            </div>
        </div>
    )
}
