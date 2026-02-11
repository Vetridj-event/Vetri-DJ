import { User, Booking, InventoryItem, FinanceRecord, EventPackage } from '@/types'
import { INITIAL_USERS, INITIAL_BOOKINGS, INITIAL_INVENTORY, INITIAL_FINANCE, INITIAL_PACKAGES } from './data'

const KEYS = {
    USERS: 'vetri_users',
    BOOKINGS: 'vetri_bookings',
    INVENTORY: 'vetri_inventory',
    FINANCE: 'vetri_finance',
    PACKAGES: 'vetri_packages'
}

export const storage = {
    // Users
    getUsers: async (): Promise<User[]> => {
        const res = await fetch('/api/users')
        return res.json()
    },

    // Bookings
    getBookings: async (): Promise<Booking[]> => {
        const res = await fetch('/api/bookings')
        return res.json()
    },
    addBooking: async (booking: Booking) => {
        await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(booking)
        })
    },
    updateBooking: async (updatedBooking: Booking) => {
        await fetch('/api/bookings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedBooking)
        })
    },
    deleteBooking: async (id: string) => {
        await fetch(`/api/bookings?id=${id}`, { method: 'DELETE' })
    },

    // Inventory
    getInventory: async (): Promise<InventoryItem[]> => {
        const res = await fetch('/api/inventory')
        return res.json()
    },
    addInventoryItem: async (item: InventoryItem) => {
        await fetch('/api/inventory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        })
    },
    updateInventoryItem: async (updatedItem: InventoryItem) => {
        await fetch('/api/inventory', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedItem)
        })
    },
    deleteInventoryItem: async (id: string) => {
        await fetch(`/api/inventory?id=${id}`, { method: 'DELETE' })
    },

    // Finance
    getFinanceRecords: async (): Promise<FinanceRecord[]> => {
        const res = await fetch('/api/finance')
        return res.json()
    },
    addFinanceRecord: async (record: FinanceRecord) => {
        await fetch('/api/finance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(record)
        })
    },
    updateFinanceRecord: async (updatedRecord: FinanceRecord) => {
        await fetch('/api/finance', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedRecord)
        })
    },
    deleteFinanceRecord: async (id: string) => {
        await fetch(`/api/finance?id=${id}`, { method: 'DELETE' })
    },

    // Packages
    getPackages: async (): Promise<EventPackage[]> => {
        const res = await fetch('/api/packages')
        return res.json()
    },
    setPackages: async (packages: EventPackage[]) => {
        // This is a bit tricky as setPackages usually overwrites everything.
        // For simplicity, we'll just implement it as needed or refactor the caller.
        // In website/page.tsx, it's used for the whole list.
        // Let's assume we want to sync the whole list.
        for (const pkg of packages) {
            await fetch('/api/packages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pkg)
            })
        }
    },

    // Auth Helper
    login: async (email: string, password: string): Promise<User | null> => {
        const users = await storage.getUsers()
        return users.find(u => u.email === email && u.password === password) || null
    }
}
