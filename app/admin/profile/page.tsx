'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Layout, Palette, Shield, User, Lock, Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { useAuth } from '@/context/auth-context'

export default function ProfilePage() {
    const [compactMode, setCompactMode] = useState(false)
    const [themeColor, setThemeColor] = useState('violet')
    const { user } = useAuth()

    // Password State
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match')
            return
        }
        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }

        setIsUpdatingPassword(true)
        try {
            const res = await fetch('/api/users/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            })

            const data = await res.json()

            if (!res.ok) {
                toast.error(data.error || 'Failed to update password')
            } else {
                toast.success('Password updated successfully')
                setIsPasswordModalOpen(false)
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.')
        } finally {
            setIsUpdatingPassword(false)
        }
    }

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
                        <div className="w-24 h-24 rounded-full bg-primary/20 mx-auto flex items-center justify-center text-primary mb-4 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:scale-110 transition-transform"></div>
                            {user?.avatar ? (
                                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover rounded-full relative z-10" />
                            ) : (
                                <User className="h-12 w-12 relative z-10" />
                            )}
                        </div>
                        <CardTitle>{user?.name || 'Admin User'}</CardTitle>
                        <CardDescription>System Administrator</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/5 p-2 rounded justify-center">
                            <Shield className="h-4 w-4 text-emerald-500" /> Role: {user?.role || 'ADMIN'}
                        </div>
                        <div className="text-xs text-center text-muted-foreground">
                            Username: <span className="text-white font-mono">{user?.phone || 'admin'}</span>
                        </div>

                        <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-full border-white/10 hover:bg-white/10 group transition-all">
                                    <Lock className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
                                    Change Password
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="glass-dark border-white/10 sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Change Password</DialogTitle>
                                    <DialogDescription>
                                        Update your account password securely.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handlePasswordChange} className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="current">Current Password</Label>
                                        <Input
                                            id="current"
                                            type="password"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            className="bg-white/5 border-white/10"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new">New Password</Label>
                                        <Input
                                            id="new"
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            className="bg-white/5 border-white/10"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirm">Confirm New Password</Label>
                                        <Input
                                            id="confirm"
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            className="bg-white/5 border-white/10"
                                            required
                                        />
                                    </div>
                                    <DialogFooter className="pt-4">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setIsPasswordModalOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isUpdatingPassword}
                                            className="bg-primary hover:bg-primary/90 min-w-[120px]"
                                        >
                                            {isUpdatingPassword ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                                    Update
                                                </>
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
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
