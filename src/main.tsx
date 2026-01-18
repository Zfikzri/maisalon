import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { Toaster } from 'react-hot-toast'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <App />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#1a170f',
                            color: '#fdfcf0',
                            border: '1px solid #d7ae33',
                        },
                        success: {
                            iconTheme: {
                                primary: '#d7ae33',
                                secondary: '#fdfcf0',
                            },
                        },
                    }}
                />
            </AuthProvider>
        </QueryClientProvider>
    </React.StrictMode>,
)
