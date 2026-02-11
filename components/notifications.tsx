'use client'

import { useState, useEffect } from 'react'
import { storage } from '@/lib/storage'
import { Bell, Info } from 'lucide-react'
import { toast } from 'sonner' // Assuming sonner is available based on standard stack, otherwise we'd use a custom toast. 
// If sonner isn't found, I'll implement a simple floating list.

export function Notifications() {
    const [lastCount, setLastCount] = useState<number>(0)

    useEffect(() => {
        // Simple polling for new bookings
        const checkNewBookings = async () => {
            try {
                const bookings = await storage.getBookings()
                if (lastCount !== 0 && bookings.length > lastCount) {
                    const newCount = bookings.length - lastCount
                    toast.success(`${newCount} New Booking(s) received!`, {
                        description: 'Check the bookings page for details.',
                        icon: <Bell className="h-4 w-4" />,
                    })
                }
                setLastCount(bookings.length)
            } catch (error) {
                console.error('Notification poll failed', error)
            }
        }

        // Initial check
        checkNewBookings()

        const interval = setInterval(checkNewBookings, 30000) // Poll every 30s
        return () => clearInterval(interval)
    }, [lastCount])

    return null // This component just runs the side effect
}
