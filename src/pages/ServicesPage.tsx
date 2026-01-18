import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Clock, DollarSign } from 'lucide-react'

export function ServicesPage() {
    const { data: services, isLoading } = useQuery({
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

    if (isLoading) {
        return (
            <div className="pt-24 min-h-screen flex items-center justify-center">
                <div className="text-lg text-soft-gray">Loading services...</div>
            </div>
        )
    }

    return (
        <div className="pt-24 min-h-screen">
            <div className="mx-auto max-w-[1280px] px-4 md:px-20 py-12 md:py-16">
                <div className="mb-12">
                    <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs">
                        Premium Services
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold dark:text-white mt-4 mb-4">
                        Our Services
                    </h1>
                    <p className="text-soft-gray text-lg max-w-2xl">
                        Discover our comprehensive range of beauty and grooming services, each designed to enhance your natural beauty.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services?.map((service, index) => (
                        <motion.div
                            key={service.id}
                            className="group flex flex-col bg-white dark:bg-[#2a261a] rounded-xl overflow-hidden luxury-shadow transition-transform hover:-translate-y-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                        >
                            <div
                                className="w-full aspect-video bg-center bg-cover overflow-hidden relative"
                                style={{ backgroundImage: `url(${service.image_url})` }}
                            >
                                <div className="w-full h-full bg-black/20 group-hover:bg-black/0 transition-colors" />
                                <div className="absolute top-4 right-4 bg-primary text-[#1a170f] px-3 py-1 rounded-full text-xs font-bold">
                                    {service.category}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold dark:text-white mb-3">{service.name}</h3>
                                <p className="text-soft-gray dark:text-gray-400 text-sm leading-relaxed mb-4">
                                    {service.description}
                                </p>
                                <div className="flex items-center justify-between mb-6 pt-4 border-t border-accent-gold/10">
                                    <div className="flex items-center gap-2 text-soft-gray text-sm">
                                        <Clock className="w-4 h-4" />
                                        {service.duration_minutes} min
                                    </div>
                                    <div className="flex items-center gap-2 text-primary text-lg font-bold">
                                        <DollarSign className="w-5 h-5" />
                                        {service.base_price}+
                                    </div>
                                </div>
                                <Link
                                    to="/booking"
                                    className="w-full h-11 rounded border border-primary/20 text-sm font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
                                >
                                    Book This Service
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
