'use client'

import { useState, useEffect } from 'react'
import { storage } from '@/lib/storage'
import { EventPackage } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Check, Edit, Trash } from 'lucide-react'

export default function WebsitePage() {
    const [packages, setPackages] = useState<EventPackage[]>([])
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState<Partial<EventPackage>>({})

    useEffect(() => {
        storage.getPackages().then(setPackages)
    }, [])

    const handleEdit = (pkg: EventPackage) => {
        setEditingId(pkg.id)
        setFormData(pkg)
    }

    const handleSave = async () => {
        const updatedPackages = packages.map(p =>
            p.id === editingId ? { ...p, ...formData } as EventPackage : p
        )
        await storage.setPackages(updatedPackages)
        setPackages(updatedPackages)
        setEditingId(null)
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this package?')) {
            const updatedPackages = packages.filter(p => p.id !== id)
            await storage.setPackages(updatedPackages)
            setPackages(updatedPackages)
        }
    }

    const addNewPackage = async () => {
        const newPkg: EventPackage = {
            id: `pkg-${Date.now()}`,
            name: 'New Package',
            price: 0,
            features: ['Feature 1', 'Feature 2']
        }
        const updated = [...packages, newPkg]
        await storage.setPackages(updated)
        setPackages(updated)
        handleEdit(newPkg)
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Website Data</h2>
                    <p className="text-muted-foreground">Manage your event packages and website content.</p>
                </div>
                <Button onClick={addNewPackage} className="bg-primary hover:bg-primary/90 text-background">
                    Add New Package
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {packages.map((pkg) => (
                    <Card key={pkg.id} className={`glass-dark border-white/10 transition-all ${editingId === pkg.id ? 'ring-2 ring-primary' : ''}`}>
                        <CardHeader>
                            {editingId === pkg.id ? (
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="bg-white/5 border-white/20 font-bold"
                                />
                            ) : (
                                <CardTitle>{pkg.name}</CardTitle>
                            )}
                            {editingId === pkg.id ? (
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-muted-foreground text-sm">₹</span>
                                    <Input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                        className="bg-white/5 border-white/20 h-8"
                                    />
                                </div>
                            ) : (
                                <CardDescription className="text-primary font-bold text-lg">
                                    ₹{pkg.price.toLocaleString()}
                                </CardDescription>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label>Features</Label>
                                {editingId === pkg.id ? (
                                    <Textarea
                                        value={formData.features?.join('\n')}
                                        onChange={(e) => setFormData({ ...formData, features: e.target.value.split('\n') })}
                                        className="bg-white/5 border-white/20 min-h-[100px]"
                                        placeholder="One feature per line"
                                    />
                                ) : (
                                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                        {pkg.features.map((feature, i) => (
                                            <li key={i}>{feature}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 border-t border-white/10 pt-4">
                            {editingId === pkg.id ? (
                                <Button size="sm" onClick={handleSave} className="bg-primary text-background">
                                    <Check className="w-4 h-4 mr-1" /> Save
                                </Button>
                            ) : (
                                <>
                                    <Button size="sm" variant="ghost" onClick={() => handleEdit(pkg)}>
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-500/10" onClick={() => handleDelete(pkg.id)}>
                                        <Trash className="w-4 h-4" />
                                    </Button>
                                </>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
