import { User, Booking, InventoryItem, FinanceRecord, EventPackage } from '@/types'

export const INITIAL_USERS: User[] = [
    {
        id: 'admin-1',
        name: 'Vetri Admin',
        email: 'admin@vetridj.com',
        password: 'admin', // Mock password
        role: 'ADMIN',
        joinedDate: new Date().toISOString(),
        phone: '+91 98765 43210'
    },
    {
        id: 'crew-1',
        name: 'John Crew',
        email: 'crew@vetridj.com',
        password: 'crew', // Mock password
        role: 'CREW',
        joinedDate: new Date().toISOString(),
        phone: '+91 98765 43211'
    },
    {
        id: 'crew-2',
        name: 'Sarah Light',
        email: 'sarah@vetridj.com',
        password: 'crew',
        role: 'CREW',
        joinedDate: new Date().toISOString(),
        phone: '+91 98765 43212'
    }
]

export const INITIAL_PACKAGES: EventPackage[] = [
    {
        id: 'pkg-1',
        name: 'Standard DJ Setup',
        price: 15000,
        features: ['Professional JBL Speakers', '4 Hours DJ Service', 'Basic Lighting', 'Wireless Mic']
    },
    {
        id: 'pkg-2',
        name: 'Deluxe DJ Experience',
        price: 25000,
        features: ['Premium Sound System', '6 Hours DJ Service', 'Smoke & Fog', 'Moving Heads'],
        isPopular: true
    },
    {
        id: 'pkg-3',
        name: 'Royal Event Package',
        price: 40000,
        features: ['Ultimate Audio Setup', '8 Hours Service', 'LED Wall', 'Pyrotechnics']
    }
]

export const INITIAL_INVENTORY: InventoryItem[] = [
    { id: 'inv-1', name: 'JBL VRX932LA Speaker', category: 'Sound', quantity: 4, totalQuantity: 4, status: 'AVAILABLE' },
    { id: 'inv-2', name: 'Pioneer DJ Controller', category: 'Sound', quantity: 2, totalQuantity: 2, status: 'AVAILABLE' },
    { id: 'inv-3', name: 'Sharpy Beam Moving Head', category: 'Lighting', quantity: 8, totalQuantity: 8, status: 'AVAILABLE' },
    { id: 'inv-4', name: 'LED Par Can', category: 'Lighting', quantity: 20, totalQuantity: 20, status: 'AVAILABLE' },
    { id: 'inv-5', name: 'Smoke Machine', category: 'Effects', quantity: 2, totalQuantity: 2, status: 'MAINTENANCE' },
]

export const INITIAL_BOOKINGS: Booking[] = [
    {
        id: 'bk-1',
        customerName: 'Rahul Kumar',
        customerPhone: '9876543210',
        eventType: 'Wedding Reception',
        date: '2026-03-15',
        packageId: 'pkg-2',
        status: 'CONFIRMED',
        amount: 25000,
        crewAssigned: ['crew-1'],
        location: 'Chengam Community Hall'
    },
    {
        id: 'bk-2',
        customerName: 'Priya Sharma',
        eventType: 'Birthday Party',
        date: '2026-03-20',
        packageId: 'pkg-1',
        status: 'PENDING',
        amount: 15000,
        location: 'Private Villa'
    }
]

export const INITIAL_FINANCE: FinanceRecord[] = [
    { id: 'fin-1', type: 'INCOME', amount: 5000, category: 'Advance', date: '2026-02-01', description: 'Advance for Rahul Wedding' },
    { id: 'fin-2', type: 'EXPENSE', amount: 2000, category: 'Maintenance', date: '2026-02-05', description: 'Speaker Cable Repair' }
]
