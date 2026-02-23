'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/auth-context'
import { storage } from '@/lib/storage'
import { User } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, MapPin, Phone, User as UserIcon, Save, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { MusicalNotes } from '@/components/musical-notes'

export default function ProfilePage() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [pincodeLoading, setPincodeLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        whatsapp: '',
        pincode: '',
        city: '',
        state: ''
    })

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name === 'Guest Customer' ? '' : user.name,
                whatsapp: user.whatsapp || user.phone || '',
                pincode: user.pincode || '',
                city: user.city || '',
                state: user.state || ''
            })
        }
    }, [user])

    const handlePincodeLookup = async (pin: string) => {
        if (pin.length !== 6) return

        setPincodeLoading(true)
        try {
            const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`)
            const data = await res.json()

            if (data[0].Status === 'Success') {
                const postOffice = data[0].PostOffice[0]
                setFormData(prev => ({
                    ...prev,
                    city: postOffice.District,
                    state: postOffice.State
                }))
                toast.success(`Detected: ${postOffice.District}, ${postOffice.State}`)
            }
        } catch (error) {
            console.error('Pincode lookup failed:', error)
        } finally {
            setPincodeLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        if (!formData.name || !formData.whatsapp || !formData.pincode || !formData.city) {
            toast.error('Please fill all required fields')
            return
        }

        setLoading(true)
        try {
            const updatedUser = {
                ...user,
                name: formData.name,
                whatsapp: formData.whatsapp,
                pincode: formData.pincode,
                city: formData.city,
                state: formData.state
            }

            const success = await storage.updateUser(updatedUser)
            if (success) {
                toast.success('Profile updated successfully!')
                // Refresh local session
                localStorage.setItem('vetri_session', JSON.stringify(updatedUser))
            } else {
                toast.error('Failed to update profile')
            }
        } catch (error) {
            toast.error('An error occurred while saving profile')
        } finally {
            setLoading(false)
        }
    }

    if (!user) return <div className="p-8 text-center text-muted-foreground">Loading profile...</div>

    return (
        <div className="min-h-screen bg-background relative overflow-hidden pb-12">
            <MusicalNotes />

            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="max-w-2xl mx-auto px-4 pt-8 relative z-10">
                <Link
                    href="/customer/dashboard"
                    className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors group"
                >
                    <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-primary/20 mr-2 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </div>
                    Back to Dashboard
                </Link>

                <Card className="glass-dark border-white/10 shadow-2xl overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-secondary"></div>

                    <CardHeader className="pt-8 pb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20">
                                <UserIcon className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-bold tracking-tight">Your Profile</CardTitle>
                                <CardDescription>Update your contact and location information</CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-muted-foreground">Mobile Number (Login ID)</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/30" />
                                    <Input
                                        id="phone"
                                        value={user.phone}
                                        disabled
                                        className="pl-9 bg-white/5 border-white/5 text-muted-foreground/50 cursor-not-allowed"
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground/40 px-1">Login ID cannot be changed.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name *</Label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-primary/50" />
                                    <Input
                                        id="name"
                                        placeholder="Your Name"
                                        className="pl-9 bg-white/5 border-white/10 focus:border-primary/50"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-primary/50" />
                                    <Input
                                        id="whatsapp"
                                        placeholder="+91 XXXXX XXXXX"
                                        className="pl-9 bg-white/5 border-white/10 focus:border-primary/50"
                                        value={formData.whatsapp}
                                        onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="pincode">Pincode *</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-primary/50" />
                                        <Input
                                            id="pincode"
                                            placeholder="600001"
                                            maxLength={6}
                                            className="pl-9 bg-white/5 border-white/10 focus:border-primary/50"
                                            value={formData.pincode}
                                            onChange={e => {
                                                const val = e.target.value.replace(/\D/g, '')
                                                setFormData({ ...formData, pincode: val })
                                                if (val.length === 6) handlePincodeLookup(val)
                                            }}
                                            required
                                        />
                                        {pincodeLoading && (
                                            <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-primary" />
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="city">City *</Label>
                                    <Input
                                        id="city"
                                        placeholder="City"
                                        className="bg-white/5 border-white/10 focus:border-primary/50"
                                        value={formData.city}
                                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="state">State</Label>
                                <Input
                                    id="state"
                                    placeholder="State"
                                    className="bg-white/5 border-white/10 focus:border-primary/50"
                                    value={formData.state}
                                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                                />
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    className="w-full bg-primary hover:bg-primary/90 text-background font-black uppercase tracking-tight h-12 shadow-lg shadow-primary/25 transition-all hover:scale-[1.01]"
                                    disabled={loading || pincodeLoading}
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <span className="flex items-center gap-2">
                                            <Save className="w-4 h-4" /> Update Profile
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
