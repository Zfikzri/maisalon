import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useBookingStore } from '@/lib/store'
import { motion } from 'framer-motion'
import { Star, Check, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StylistSelection() {
    const { selectedService, selectedStylist, setSelectedStylist, setCurrentStep } = useBookingStore()

    // Fetch all stylists and filter by selected service specialty
    const { data: stylists } = useQuery({
        queryKey: ['stylists', selectedService?.category],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('stylists')
                .select('*')
                .order('name')

            if (error) throw error

            // Filter stylists who have the selected service category in their specialties
            if (selectedService?.category) {
                return data.filter(stylist =>
                    stylist.specialties?.some((specialty: string) =>
                        specialty.toLowerCase().includes(selectedService.category.toLowerCase()) ||
                        selectedService.name.toLowerCase().includes(specialty.toLowerCase())
                    )
                )
            }

            return data
        },
    })

    const handleSelectStylist = (stylist: any) => {
        setSelectedStylist(stylist)
    }

    const handleBack = () => {
        setCurrentStep(0)
    }

    const handleContinue = () => {
        if (selectedStylist) {
            setCurrentStep(2)
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold dark:text-white mb-2">Choose Your Stylist</h2>
                <p className="text-soft-gray">Select a stylist for your {selectedService?.name}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stylists?.map((stylist, index) => (
                    <motion.div
                        key={stylist.id}
                        className={cn(
                            'relative flex flex-col bg-white dark:bg-[#332e1f] rounded-xl overflow-hidden border-2 cursor-pointer transition-all hover:scale-[1.02]',
                            selectedStylist?.id === stylist.id
                                ? 'border-primary shadow-lg shadow-primary/20'
                                : 'border-transparent hover:border-primary/30'
                        )}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        onClick={() => handleSelectStylist(stylist)}
                    >
                        {selectedStylist?.id === stylist.id && (
                            <div className="absolute top-4 right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center z-10">
                                <Check className="w-5 h-5 text-white" />
                            </div>
                        )}

                        <div
                            className="w-full aspect-square bg-center bg-cover"
                            style={{ backgroundImage: `url(${stylist.image_url})` }}
                        />

                        <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-bold dark:text-white">{stylist.name}</h3>
                                <div className="flex items-center gap-1 text-primary">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="text-sm font-bold">{stylist.rating}</span>
                                </div>
                            </div>
                            <p className="text-soft-gray text-sm mb-3 line-clamp-2">{stylist.bio}</p>
                            <div className="flex flex-wrap gap-1">
                                {stylist.specialties?.slice(0, 2).map((specialty: string) => (
                                    <span
                                        key={specialty}
                                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                                    >
                                        {specialty}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

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
                    disabled={!selectedStylist}
                    className={cn(
                        'px-8 py-3 rounded-lg font-bold transition-all',
                        selectedStylist
                            ? 'bg-primary text-white hover:bg-accent-gold'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    )}
                >
                    Continue to Date & Time
                </button>
            </div>
        </div>
    )
}
