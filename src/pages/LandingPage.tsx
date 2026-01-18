import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Sparkles, ArrowRight, Leaf, Brain } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function LandingPage() {
    const { data: services } = useQuery({
        queryKey: ['services'],
        queryFn: api.getServices,
    })

    const featuredServices = services?.slice(0, 3)

    return (
        <div className="pt-24">
            {/* Hero Section */}
            <section className="mx-auto max-w-[1280px] px-4 md:px-20 py-12 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        className="flex flex-col gap-8 order-2 md:order-1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="space-y-4">
                            <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs">
                                Exclusivity & Artistry
                            </span>
                            <h1 className="text-[#1a170f] dark:text-white text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
                                Elevate Your <br />
                                <span className="italic font-light text-primary">Natural</span> Beauty
                            </h1>
                            <p className="text-soft-gray dark:text-gray-400 text-lg md:text-xl max-w-[480px] leading-relaxed">
                                Experience bespoke grooming and rejuvenation in a space designed for silence and serenity.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Link
                                to="/booking"
                                className="flex min-w-[180px] cursor-pointer items-center justify-center rounded-lg h-14 px-8 bg-primary text-[#1a170f] text-base font-bold transition-all hover:bg-accent-gold hover:-translate-y-0.5"
                            >
                                Book Appointment
                            </Link>
                            <Link
                                to="/ai-consultation"
                                className="flex min-w-[180px] cursor-pointer items-center justify-center rounded-lg h-14 px-8 border-2 border-primary/20 bg-transparent text-[#1a170f] dark:text-white text-base font-bold transition-all hover:bg-primary/5"
                            >
                                AI Style Consult
                            </Link>
                        </div>

                        <div className="flex items-center gap-4 pt-4 border-t border-accent-gold/10">
                            <div className="flex -space-x-3">
                                <div className="size-10 rounded-full border-2 border-background-light dark:border-background-dark bg-center bg-cover"
                                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80)' }}
                                />
                                <div className="size-10 rounded-full border-2 border-background-light dark:border-background-dark bg-center bg-cover"
                                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80)' }}
                                />
                                <div className="size-10 rounded-full border-2 border-background-light dark:border-background-dark bg-center bg-cover"
                                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80)' }}
                                />
                            </div>
                            <p className="text-sm text-soft-gray">
                                Trusted by <span className="font-bold text-[#1a170f] dark:text-white">2,000+</span> regular clients
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="relative order-1 md:order-2"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div
                            className="w-full aspect-[4/5] bg-center bg-cover rounded-2xl luxury-shadow"
                            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80)' }}
                        />
                        <div className="absolute -bottom-6 -left-6 bg-white dark:bg-[#2a261a] p-6 rounded-xl luxury-shadow hidden lg:block">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <Star className="w-6 h-6 fill-current" />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest font-bold text-soft-gray">
                                        Award Winning
                                    </p>
                                    <p className="font-bold text-lg dark:text-white">Top Salon 2024</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Services Section */}
            <section className="bg-[#f2f0e8]/30 dark:bg-[#15120a] py-24">
                <div className="mx-auto max-w-[1280px] px-4 md:px-20">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="space-y-4">
                            <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs">
                                Curated Excellence
                            </span>
                            <h2 className="text-4xl font-bold dark:text-white">Featured Services</h2>
                        </div>
                        <Link
                            to="/services"
                            className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary border-b-2 border-transparent hover:border-primary transition-all pb-1"
                        >
                            Explore all services
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {featuredServices?.map((service, index) => (
                            <motion.div
                                key={service.id}
                                className="group flex flex-col bg-white dark:bg-[#2a261a] rounded-xl overflow-hidden luxury-shadow transition-transform hover:-translate-y-2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <div
                                    className="w-full aspect-square bg-center bg-cover overflow-hidden relative"
                                    style={{ backgroundImage: `url(${service.image_url})` }}
                                >
                                    <div className="w-full h-full bg-black/10 group-hover:bg-black/0 transition-colors" />
                                </div>
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold dark:text-white">{service.name}</h3>
                                        <span className="text-primary font-semibold">${service.base_price}+</span>
                                    </div>
                                    <p className="text-soft-gray dark:text-gray-400 text-sm leading-relaxed mb-6">
                                        {service.description}
                                    </p>
                                    <Link
                                        to="/booking"
                                        className="w-full h-12 rounded border border-primary/20 text-sm font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
                                    >
                                        Book Now
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI CTA Section */}
            <section className="mx-auto max-w-[1280px] px-4 md:px-20 py-24">
                <div className="relative overflow-hidden rounded-3xl bg-background-dark dark:bg-[#2a261a] p-12 md:p-20 flex flex-col items-center text-center text-white">
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -ml-48 -mb-48" />

                    <div className="relative z-10 flex flex-col items-center gap-8 max-w-[800px]">
                        <div className="flex items-center gap-3 py-2 px-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-xs font-bold uppercase tracking-widest">
                                Next Generation Consult
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                            Experience the Future <br />
                            of <span className="italic text-primary font-light">Beauty</span>
                        </h2>
                        <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
                            Use our proprietary AI to analyze your features and find your perfect look before you step into the salon. Virtual mirrors, personalized color palettes, and expert matching.
                        </p>
                        <Link
                            to="/ai-consultation"
                            className="flex min-w-[220px] cursor-pointer items-center justify-center gap-2 rounded-lg h-14 px-8 bg-primary text-[#1a170f] text-base font-bold transition-all hover:shadow-[0_0_20px_rgba(215,174,51,0.4)]"
                        >
                            Try AI Style Consult
                            <Sparkles className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="mx-auto max-w-[1280px] px-4 md:px-20 py-24 border-t border-accent-gold/10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs">
                                Our Ethos
                            </span>
                            <h2 className="text-4xl font-bold dark:text-white leading-snug">
                                The MAISALON Philosophy of Minimalist Perfection
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <Leaf className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold dark:text-white">Eco-Conscious</h4>
                                <p className="text-soft-gray text-sm leading-relaxed">
                                    We use sustainably sourced, cruelty-free premium products only.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <Brain className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold dark:text-white">Expert Artistry</h4>
                                <p className="text-soft-gray text-sm leading-relaxed">
                                    Our stylists train globally to bring you the latest techniques.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        <div className="grid grid-cols-2 gap-4 w-full">
                            <div
                                className="w-full aspect-square rounded-2xl bg-center bg-cover"
                                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&q=80)' }}
                            />
                            <div
                                className="w-full aspect-square rounded-2xl bg-center bg-cover mt-8"
                                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80)' }}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
