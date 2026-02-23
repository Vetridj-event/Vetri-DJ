import { z } from 'zod'

const phoneRegex = /^[0-9]{10}$/

// --- Auth Schemas ---

export const customerLoginSchema = z.object({
    phone: z.string().regex(phoneRegex, 'Please enter a valid 10-digit mobile number'),
    otp: z.string().length(6, 'OTP must be 6 digits').or(z.literal('')).optional()
})

export const teamLoginSchema = z.object({
    username: z.string().min(1, 'Username or Phone is required'),
    password: z.string().min(1, 'Password is required')
})

export const loginSchema = z.discriminatedUnion('type', [
    z.object({ type: z.literal('customer'), ...customerLoginSchema.shape }),
    z.object({ type: z.literal('team'), ...teamLoginSchema.shape })
])


export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().regex(phoneRegex, 'Invalid 10-digit mobile number'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
})

// --- Booking Schemas ---

export const bookingSchema = z.object({
    customerName: z.string().min(2, 'Customer name is required'),
    customerPhone: z.string().regex(phoneRegex, 'Invalid 10-digit mobile number').optional(),
    eventType: z.string().min(1, 'Event type is required'),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
    packageId: z.string().optional(),
    status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']),
    amount: z.number().min(0, 'Amount cannot be negative'),
    advanceAmount: z.number().min(0).optional(),
    receivedAmount: z.number().min(0).optional(),
    balanceAmount: z.number().min(0).optional(),
    location: z.string().min(1, 'Location is required'),
    notes: z.string().max(500, 'Notes must be under 500 characters').optional(),
    djPackage: z.string().optional()
})

// --- Settings Schemas ---

export const settingsSchema = z.object({
    upi_id: z.string().email('Invalid UPI ID format (usually email-like)').optional(),
    business_name: z.string().min(1, 'Business name is required').optional(),
    contact_phone: z.string().regex(phoneRegex, 'Invalid mobile number').optional()
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type BookingInput = z.infer<typeof bookingSchema>
export type SettingsInput = z.infer<typeof settingsSchema>
