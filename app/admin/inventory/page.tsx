'use client'

import { useState, useEffect } from 'react'
import { storage } from '@/lib/storage'
import { InventoryItem } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, AlertTriangle, CheckCircle, Search, Edit, Trash, Plus } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function InventoryPage() {
    const [items, setItems] = useState<InventoryItem[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
    const [formData, setFormData] = useState<Partial<InventoryItem>>({
        status: 'AVAILABLE',
        quantity: 0,
        totalQuantity: 0
    })

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setItems(await storage.getInventory())
    }

    const handleSave = async () => {
        if (editingItem) {
            await storage.updateInventoryItem({ ...editingItem, ...formData } as InventoryItem)
        } else {
            const newItem: InventoryItem = {
                id: `inv-${Date.now()}`,
                name: formData.name || '',
                category: formData.category || 'Sound',
                quantity: Number(formData.quantity) || 0,
                totalQuantity: Number(formData.totalQuantity) || 0,
                status: formData.status as any || 'AVAILABLE'
            }
            await storage.addInventoryItem(newItem)
        }
        await loadData()
        setIsDialogOpen(false)
        setEditingItem(null)
        setFormData({ status: 'AVAILABLE', quantity: 0, totalQuantity: 0 })
    }

    const openEdit = (item: InventoryItem) => {
        setEditingItem(item)
        setFormData(item)
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this item?')) {
            await storage.deleteInventoryItem(id)
            await loadData()
        }
    }

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'AVAILABLE': return <Badge className="bg-green-500/20 text-green-500 border-green-500/20 hover:bg-green-500/30">Available</Badge>
            case 'IN_USE': return <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/20 hover:bg-blue-500/30">In Use</Badge>
            case 'MAINTENANCE': return <Badge className="bg-red-500/20 text-red-500 border-red-500/20 hover:bg-red-500/30">Maintenance</Badge>
            default: return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
                    <p className="text-muted-foreground">Manage equipment and resources.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => { setEditingItem(null); setFormData({ status: 'AVAILABLE' }) }} className="bg-primary hover:bg-primary/90 text-background">
                            <Plus className="mr-2 h-4 w-4" /> Add Item
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-dark border-white/10 sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name || ''}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="col-span-3 bg-white/5 border-white/10"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="category" className="text-right">Category</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(val) => setFormData({ ...formData, category: val })}
                                >
                                    <SelectTrigger className="col-span-3 bg-white/5 border-white/10">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Sound">Sound</SelectItem>
                                        <SelectItem value="Lighting">Lighting</SelectItem>
                                        <SelectItem value="Effects">Effects</SelectItem>
                                        <SelectItem value="Visuals">Visuals</SelectItem>
                                        <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="quantity" className="text-right">Quantity</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    value={formData.quantity || 0}
                                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                                    className="col-span-3 bg-white/5 border-white/10"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="total" className="text-right">Total</Label>
                                <Input
                                    id="total"
                                    type="number"
                                    value={formData.totalQuantity || 0}
                                    onChange={(e) => setFormData({ ...formData, totalQuantity: Number(e.target.value) })}
                                    className="col-span-3 bg-white/5 border-white/10"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(val: any) => setFormData({ ...formData, status: val })}
                                >
                                    <SelectTrigger className="col-span-3 bg-white/5 border-white/10">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="AVAILABLE">Available</SelectItem>
                                        <SelectItem value="IN_USE">In Use</SelectItem>
                                        <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleSave} className="bg-primary text-background">Save Item</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search inventory..."
                    className="pl-10 bg-white/5 border-white/10 w-full md:max-w-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                    <Card key={item.id} className="glass-dark border-white/10 hover:border-primary/50 transition-colors">
                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                            <div className="space-y-1">
                                <Badge variant="outline" className="mb-2 text-xs">{item.category}</Badge>
                                <CardTitle className="text-base line-clamp-1">{item.name}</CardTitle>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center">
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-2xl font-bold">{item.quantity} <span className="text-sm font-normal text-muted-foreground">/ {item.totalQuantity}</span></div>
                                {getStatusBadge(item.status)}
                            </div>

                            <div className="space-y-2">
                                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${item.quantity < 2 ? 'bg-red-500' : 'bg-primary'}`}
                                        style={{ width: `${(item.quantity / (item.totalQuantity || 1)) * 100}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-muted-foreground text-right">Stock Level</p>
                            </div>

                            <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => openEdit(item)}
                                    className="flex-1 text-xs hover:text-primary hover:bg-primary/10"
                                >
                                    <Edit className="w-3 h-3 mr-1" /> Edit
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDelete(item.id)}
                                    className="flex-1 text-xs text-red-400 hover:text-red-500 hover:bg-red-500/10"
                                >
                                    <Trash className="w-3 h-3 mr-1" /> Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
