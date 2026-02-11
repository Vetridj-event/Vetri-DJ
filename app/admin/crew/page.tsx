'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { User, Plus, Search, Edit, Trash2, Phone, Mail, DollarSign, Loader2 } from 'lucide-react'
import { storage } from '@/lib/storage'
import { User as UserType } from '@/types'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function CrewManagementPage() {
    const [crew, setCrew] = useState<UserType[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'CREW',
        salary: 0,
        password: 'password123' // Default password
    })

    const fetchCrew = async () => {
        try {
            const users = await storage.getUsers()
            // In a real app, filtering should happen on backend or efficient store
            const crewMembers = users.filter(u => u.role === 'CREW')
            setCrew(crewMembers)
        } catch (error) {
            toast.error('Failed to load crew members')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCrew()
    }, [])

    const handleAddCrew = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                toast.success('Crew member added successfully!')
                setIsAddOpen(false)
                fetchCrew() // Refresh list
                setFormData({ ...formData, name: '', email: '', phone: '', salary: 0 })
            } else {
                toast.error('Failed to add crew member')
            }
        } catch (error) {
            toast.error('An error occurred')
        } finally {
            setSubmitting(false)
        }
    }

    const filteredCrew = crew.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        <User className="h-8 w-8 text-primary" /> Crew Management
                    </h1>
                    <p className="text-muted-foreground">Manage your team members and their compensation.</p>
                </div>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 text-background font-bold gap-2">
                            <Plus className="h-4 w-4" /> Add Crew Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-dark border-white/10">
                        <DialogHeader>
                            <DialogTitle>Add New Crew Member</DialogTitle>
                            <DialogDescription>
                                Create a new account for a staff member. Default password is 'password123'.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddCrew} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input
                                    className="bg-white/5 border-white/10"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email Address</Label>
                                <Input
                                    type="email"
                                    className="bg-white/5 border-white/10"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Phone Number</Label>
                                    <Input
                                        className="bg-white/5 border-white/10"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Monthly Salary (₹)</Label>
                                    <Input
                                        type="number"
                                        className="bg-white/5 border-white/10"
                                        value={formData.salary}
                                        onChange={(e) => setFormData({ ...formData, salary: parseFloat(e.target.value) })}
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full font-bold" disabled={submitting}>
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Create Account
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="glass-dark border-white/5 md:col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                        <div className="space-y-1">
                            <CardTitle>Crew Roster</CardTitle>
                            <CardDescription>Total {crew.length} active staff members</CardDescription>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search crew..."
                                className="pl-8 bg-white/5 border-white/10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border border-white/10 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-white/5">
                                    <TableRow className="border-white/5 hover:bg-transparent">
                                        <TableHead className="text-white font-bold">Name</TableHead>
                                        <TableHead className="text-white font-bold">Contact</TableHead>
                                        <TableHead className="text-white font-bold">Role</TableHead>
                                        <TableHead className="text-white font-bold">Salary</TableHead>
                                        <TableHead className="text-right text-white font-bold">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center h-24">
                                                <div className="flex justify-center items-center gap-2 text-muted-foreground">
                                                    <Loader2 className="animate-spin h-5 w-5" /> Loading roster...
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredCrew.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                                No crew members found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredCrew.map((member) => (
                                            <TableRow key={member.id} className="border-white/5 hover:bg-white/5 transition-colors">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-9 w-9 border border-white/10">
                                                            <AvatarImage src={member.avatar} />
                                                            <AvatarFallback className="bg-primary/20 text-primary font-bold">
                                                                {member.name.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="font-medium">{member.name}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="w-3 h-3" /> {member.email}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="w-3 h-3" /> {member.phone}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                                                        {member.role}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 font-mono text-green-400">
                                                        <DollarSign className="w-3 h-3" />
                                                        {member.salary?.toLocaleString() || 0}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 hover:text-primary">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 hover:text-destructive">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
