'use client'

import { useState, useEffect } from 'react'
import { storage } from '@/lib/storage'
import { Booking, User } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, User as UserIcon, Calendar, IndianRupee, Phone, Mail } from 'lucide-react'

interface CustomerStats {
    name: string
    phone: string
    totalBookings: number
    totalSpent: number
    lastBookingDate: string
    email?: string
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<CustomerStats[]>([])
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const loadCustomers = async () => {
            const bookings = await storage.getBookings()
            const customerMap = new Map<string, CustomerStats>()

            bookings.forEach(booking => {
                const existing = customerMap.get(booking.customerName)
                if (existing) {
                    existing.totalBookings += 1
                    existing.totalSpent += booking.amount
                    if (new Date(booking.date) > new Date(existing.lastBookingDate)) {
                        existing.lastBookingDate = booking.date
                    }
                } else {
                    customerMap.set(booking.customerName, {
                        name: booking.customerName,
                        phone: booking.customerPhone || 'N/A',
                        totalBookings: 1,
                        totalSpent: booking.amount,
                        lastBookingDate: booking.date,
                        email: booking.customerEmail || 'N/A'
                    })
                }
            })

            setCustomers(Array.from(customerMap.values()))
        }
        loadCustomers()
    }, [])

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
    )

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Customer CRM</h2>
                <p className="text-muted-foreground">Detailed view of your customers and their booking history.</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 focus:border-primary/50 transition-all"
                    />
                </div>
            </div>

            <div className="grid gap-6">
                <Card className="glass-dark border-white/5 overflow-hidden">
                    <CardHeader className="border-b border-white/5 bg-white/[0.02]">
                        <CardTitle className="text-xl">Customer Directory</CardTitle>
                        <CardDescription>All customers who have booked an event.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/5 hover:bg-transparent">
                                    <TableHead className="py-4 pl-6">Customer</TableHead>
                                    <TableHead>Contact Info</TableHead>
                                    <TableHead>Bookings</TableHead>
                                    <TableHead>Total Revenue</TableHead>
                                    <TableHead>Last Booking</TableHead>
                                    <TableHead className="text-right pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCustomers.map((customer) => (
                                    <TableRow key={customer.name} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                                        <TableCell className="py-4 pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-background transition-all duration-300">
                                                    <UserIcon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white mb-0.5">{customer.name}</p>
                                                    <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider py-0 px-2 h-4 border-primary/20 text-primary">VIP Member</Badge>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-white/70">
                                                    <Phone className="h-3 w-3 text-primary/50" />
                                                    {customer.phone}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-white/70">
                                                    <Mail className="h-3 w-3 text-primary/50" />
                                                    {customer.email}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none">
                                                    {customer.totalBookings}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Events</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 font-bold text-white">
                                                <IndianRupee className="h-3.5 w-3.5 text-primary" />
                                                {customer.totalSpent.toLocaleString()}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm text-white/70">
                                                <Calendar className="h-3.5 w-3.5 text-primary/50" />
                                                {new Date(customer.lastBookingDate).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <Button variant="ghost" size="sm" className="hover:text-primary hover:bg-primary/10 text-xs">
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
