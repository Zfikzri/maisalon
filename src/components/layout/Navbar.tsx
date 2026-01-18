import { Link } from 'react-router-dom'
import { Menu, X, Sparkles, User as UserIcon, LogOut } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const { user, signOut } = useAuth()

    const handleSignOut = async () => {
        await signOut()
        setShowUserMenu(false)
    }

    return (
        <header className="fixed top-0 z-50 w-full glass-nav border-b border-solid border-accent-gold/10 px-4 md:px-20 py-4 transition-all duration-300">
            <div className="mx-auto flex max-w-[1280px] items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3">
                    <div className="size-8 text-primary">
                        <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M24 4C13 4 4 13 4 24C4 35 13 44 24 44C35 44 44 35 44 24C44 13 35 4 24 4ZM24 40C15.2 40 8 32.8 8 24C8 15.2 15.2 8 24 8C32.8 8 40 15.2 40 24C40 32.8 32.8 40 24 40Z"
                                fill="currentColor"
                                fillOpacity="0.2"
                            />
                            <path
                                d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z"
                                fill="currentColor"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-extrabold tracking-tighter uppercase dark:text-white">
                        MAISALON
                    </h2>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-10">
                    <Link to="/services" className="text-sm font-semibold hover:text-primary transition-colors">
                        Services
                    </Link>
                    <Link to="/stylists" className="text-sm font-semibold hover:text-primary transition-colors">
                        Stylists
                    </Link>
                    <Link to="/ai-consultation" className="text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1">
                        AI Consult
                        <Sparkles className="w-3.5 h-3.5" />
                    </Link>
                </nav>

                {/* CTA/Auth Section */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                    <UserIcon className="w-4 h-4 text-primary" />
                                </div>
                                <span className="text-sm font-semibold dark:text-white">
                                    {user.email?.split('@')[0]}
                                </span>
                            </button>

                            <AnimatePresence>
                                {showUserMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#2a261a] rounded-xl luxury-shadow border border-accent-gold/10 py-2"
                                    >
                                        <Link
                                            to="/profile"
                                            onClick={() => setShowUserMenu(false)}
                                            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-primary/5 transition-colors"
                                        >
                                            <UserIcon className="w-4 h-4" />
                                            My Profile
                                        </Link>
                                        <Link
                                            to="/booking"
                                            onClick={() => setShowUserMenu(false)}
                                            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-primary/5 transition-colors"
                                        >
                                            <Sparkles className="w-4 h-4" />
                                            Book Appointment
                                        </Link>
                                        <div className="border-t border-accent-gold/10 my-2" />
                                        <button
                                            onClick={handleSignOut}
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors w-full"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-sm font-semibold hover:text-primary transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-6 bg-primary text-[#1a170f] text-sm font-bold tracking-wide transition-transform active:scale-95 hover:shadow-lg"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden overflow-hidden"
                    >
                        <nav className="flex flex-col gap-4 py-6 px-4 border-t border-accent-gold/10 mt-4">
                            <Link
                                to="/services"
                                className="text-sm font-semibold hover:text-primary transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Services
                            </Link>
                            <Link
                                to="/stylists"
                                className="text-sm font-semibold hover:text-primary transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Stylists
                            </Link>
                            <Link
                                to="/ai-consultation"
                                className="text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                AI Consult
                                <Sparkles className="w-3.5 h-3.5" />
                            </Link>

                            {user ? (
                                <>
                                    <Link
                                        to="/profile"
                                        className="text-sm font-semibold hover:text-primary transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        My Profile
                                    </Link>
                                    <Link
                                        to="/booking"
                                        className="flex items-center justify-center rounded-lg h-10 px-6 bg-primary text-[#1a170f] text-sm font-bold tracking-wide mt-2"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Book Now
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleSignOut()
                                            setIsMenuOpen(false)
                                        }}
                                        className="flex items-center gap-2 justify-center rounded-lg h-10 px-6 border border-red-600 text-red-600 dark:text-red-400 text-sm font-bold tracking-wide"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-sm font-semibold hover:text-primary transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="flex items-center justify-center rounded-lg h-10 px-6 bg-primary text-[#1a170f] text-sm font-bold tracking-wide mt-2"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
