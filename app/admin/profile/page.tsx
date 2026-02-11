'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Layout, Palette, Shield, User } from 'lucide-react'
import { toast } from 'sonner'

export default function ProfilePage() {
    const [compactMode, setCompactMode] = useState(false)
    const [themeColor, setThemeColor] = useState('violet')

    const handleSave = () => {
        toast.success('Profile settings updated locally!')
        // In a real app, we'd save this to DB/localStorage
        localStorage.setItem('admin_prefs', JSON.stringify({ compactMode, themeColor }))
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Your Profile</h2>
                <p className="text-muted-foreground">Manage your preferences and dashboard layout.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="glass-dark border-white/5 md:col-span-1">
                    <CardHeader className="text-center">
                        <div className="w-24 h-24 rounded-full bg-primary/20 mx-auto flex items-center justify-center text-primary mb-4">
                            <User className="h-12 w-12" />
                        </div>
                        <CardTitle>Admin User</CardTitle>
                        <CardDescription>System Administrator</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Shield className="h-4 w-4" /> Role: ADMIN
                        </div>
                        <Button variant="outline" className="w-full border-white/10 text-xs">Reset Password</Button>
                    </CardContent>
                </Card>

                <div className="md:col-span-2 space-y-6">
                    <Card className="glass-dark border-white/5">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Layout className="h-5 w-5 text-primary" /> Display Settings
                            </CardTitle>
                            <CardDescription>Personalize how the dashboard looks for you.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Compact Mode</Label>
                                    <p className="text-xs text-muted-foreground">Reduce spacing and font sizes for high-density information.</p>
                                </div>
                                <Switch checked={compactMode} onCheckedChange={setCompactMode} />
                            </div>

                            <div className="space-y-3">
                                <Label>Accent Color</Label>
                                <div className="flex gap-3">
                                    {['violet', 'blue', 'green', 'orange', 'rose'].map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setThemeColor(color)}
                                            className={`w-8 h-8 rounded-full border-2 transition-all ${themeColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-50'
                                                } bg-${color}-500`}
                                            style={{ backgroundColor: color === 'violet' ? 'hsl(var(--primary))' : color }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button onClick={handleSave} className="bg-primary text-background font-bold px-8">
                            Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
