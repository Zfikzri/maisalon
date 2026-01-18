import { Link } from 'react-router-dom'
import { MapPin, Phone, Send } from 'lucide-react'

export function Footer() {
    return (
        <footer className="bg-background-light dark:bg-[#1a170f] border-t border-accent-gold/10 py-20">
            <div className="mx-auto max-w-[1280px] px-4 md:px-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-1 space-y-6">
                        <div className="flex items-center gap-3 text-primary">
                            <svg className="size-6" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z"
                                    fill="currentColor"
                                />
                            </svg>
                            <h2 className="text-xl font-extrabold tracking-tighter uppercase dark:text-white">
                                MAISALON
                            </h2>
                        </div>
                        <p className="text-soft-gray text-sm leading-relaxed">
                            Crafting beauty through a lens of luxury and precision since 2012. Our salon is a sanctuary for those who value artisanal excellence.
                        </p>
                    </div>

                    {/* Explore Links */}
                    <div className="space-y-6">
                        <h4 className="font-bold dark:text-white uppercase tracking-widest text-xs">Explore</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/services" className="text-soft-gray text-sm hover:text-primary transition-colors">
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link to="/ai-consultation" className="text-soft-gray text-sm hover:text-primary transition-colors">
                                    AI Consultation
                                </Link>
                            </li>
                            <li>
                                <Link to="/stylists" className="text-soft-gray text-sm hover:text-primary transition-colors">
                                    Stylists
                                </Link>
                            </li>
                            <li>
                                <Link to="/booking" className="text-soft-gray text-sm hover:text-primary transition-colors">
                                    Book Now
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div className="space-y-6">
                        <h4 className="font-bold dark:text-white uppercase tracking-widest text-xs">Company</h4>
                        <ul className="space-y-4">
                            <li>
                                <a href="#" className="text-soft-gray text-sm hover:text-primary transition-colors">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-soft-gray text-sm hover:text-primary transition-colors">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-soft-gray text-sm hover:text-primary transition-colors">
                                    Terms of Service
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-6">
                        <h4 className="font-bold dark:text-white uppercase tracking-widest text-xs">Stay Inspired</h4>
                        <div className="flex gap-2">
                            <input
                                className="bg-[#f2f0e8] dark:bg-[#2a261a] border-none rounded-lg px-4 h-12 flex-1 text-sm focus:ring-1 focus:ring-primary outline-none"
                                placeholder="Your email"
                                type="email"
                            />
                            <button className="bg-primary text-[#1a170f] h-12 w-12 rounded-lg flex items-center justify-center hover:bg-accent-gold transition-colors">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-soft-gray text-[10px] uppercase tracking-wider">
                            Join our newsletter for exclusive beauty tips.
                        </p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-accent-gold/10 gap-6">
                    <p className="text-soft-gray text-xs">
                        © 2024 MAISALON. All rights reserved.
                    </p>
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2 text-soft-gray text-xs">
                            <MapPin className="w-3.5 h-3.5" />
                            Jakarta, Indonesia
                        </div>
                        <div className="flex items-center gap-2 text-soft-gray text-xs">
                            <Phone className="w-3.5 h-3.5" />
                            +62 (21) 555-0123
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
