import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface AuthContextType {
    user: User | null
    session: Session | null
    loading: boolean
    signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<void>
    signIn: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
    updateProfile: (data: { full_name?: string; phone?: string; avatar_url?: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        phone: phone || null,
                    },
                },
            })

            if (error) throw error

            // Create profile in profiles table
            if (data.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: data.user.id,
                        email: data.user.email,
                        full_name: fullName,
                        phone: phone || null,
                    })

                if (profileError) console.error('Profile creation error:', profileError)
            }

            toast.success('Account created successfully!')
        } catch (error: any) {
            toast.error(error.message || 'Failed to sign up')
            throw error
        }
    }

    const signIn = async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            toast.success('Welcome back!')
        } catch (error: any) {
            toast.error(error.message || 'Failed to sign in')
            throw error
        }
    }

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
            toast.success('Signed out successfully')
        } catch (error: any) {
            toast.error(error.message || 'Failed to sign out')
            throw error
        }
    }

    const updateProfile = async (data: { full_name?: string; phone?: string; avatar_url?: string }) => {
        try {
            if (!user) throw new Error('No user logged in')

            const { error } = await supabase
                .from('profiles')
                .update({
                    ...data,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', user.id)

            if (error) throw error

            toast.success('Profile updated successfully!')
        } catch (error: any) {
            toast.error(error.message || 'Failed to update profile')
            throw error
        }
    }

    return (
        <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut, updateProfile }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
