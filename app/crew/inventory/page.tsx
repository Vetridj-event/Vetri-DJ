'use client'

import { useState, useEffect } from 'react'
import { storage } from '@/lib/storage'
import { InventoryItem } from '@/types'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, Search } from 'lucide-react'

export default function CrewInventoryPage() {
    const [items, setItems] = useState<InventoryItem[]>([])
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        storage.getInventory().then(setItems)
    }, [])

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Inventory Check</h2>
                <p className="text-muted-foreground">View available equipment for events.</p>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search equipment..."
                    className="pl-10 bg-white/5 border-white/10 w-full md:max-w-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                    <Card key={item.id} className="glass-dark border-white/10">
                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                            <div className="space-y-1">
                                <Badge variant="outline" className="mb-2 text-xs">{item.category}</Badge>
                                <CardTitle className="text-base line-clamp-1">{item.name}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-2xl font-bold">{item.quantity} <span className="text-sm font-normal text-muted-foreground">available</span></div>
                                <Badge variant={item.status === 'AVAILABLE' ? 'default' : 'destructive'}>
                                    {item.status}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
