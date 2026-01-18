import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

export function StylistsPage() {
    const { data: stylists, isLoading } = useQuery({
        queryKey: ['stylists'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('stylists')
                .select('*')
                .order('name')

            if (error) throw error
            return data
        },
    })

    if (isLoading) {
        return (
            <div className="pt-24 min-h-screen flex items-center justify-center">
                <div className="text-lg text-soft-gray">Loading stylists...</div>
            </div>
        )
    }

    return (
        <div className="pt-24 min-h-screen">
            <div className="mx-auto max-w-[1280px] px-4 md:px-20 py-12 md:py-16">
                <div className="mb-12">
                    <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs">
                        Expert Team
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold dark:text-white mt-4 mb-4">
                        Our Stylists
                    </h1>
                    <p className="text-soft-gray text-lg max-w-2xl">
                        Meet our team of award-winning beauty professionals, each bringing years of expertise and passion.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stylists?.map((stylist, index) => (
                        <motion.div
                            key={stylist.id}
                            className="group flex flex-col bg-white dark:bg-[#2a261a] rounded-xl overflow-hidden luxury-shadow transition-transform hover:-translate-y-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                        >
                            <div
                                className="w-full aspect-square bg-center bg-cover overflow-hidden"
                                style={{ backgroundImage: `url(${stylist.image_url})` }}
                            >
                                <div className="w-full h-full bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xl font-bold dark:text-white">{stylist.name}</h3>
                                    <div className="flex items-center gap-1 text-primary">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="text-sm font-bold">{stylist.rating}</span>
                                    </div>
                                </div>
                                <p className="text-soft-gray dark:text-gray-400 text-sm leading-relaxed mb-4">
                                    {stylist.bio}
                                </p>
                                <div className="pt-4 border-t border-accent-gold/10">
                                    <p className="text-xs text-soft-gray uppercase tracking-wider mb-2">Specialties</p>
                                    <div className="flex flex-wrap gap-2">
                                        {stylist.specialties?.map((specialty: string) => (
                                            <span
                                                key={specialty}
                                                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                                            >
                                                {specialty}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
