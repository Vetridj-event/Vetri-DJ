'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { MusicalNotes } from '@/components/musical-notes'
import { Loader2, Lock, Mail, ChevronLeft, Phone, ShieldCheck, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { customerLoginSchema, teamLoginSchema } from '@/lib/validations/schemas'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function LoginPage() {
    const [step, setStep] = useState<'ID' | 'OTP'>('ID')
    const [loginType, setLoginType] = useState<'customer' | 'team'>('customer')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { user, login, loginWithOTP, generateOTP, isAuthenticated, isLoading } = useAuth()
    const router = useRouter()
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<any>({
        resolver: zodResolver(loginType === 'customer' ? customerLoginSchema : teamLoginSchema),
        defaultValues: loginType === 'customer' ? { phone: '', otp: '' } : { username: '', password: '' }
    })

    const phone = watch('phone')
    const otp = watch('otp')

    useEffect(() => {
        reset(loginType === 'customer' ? { phone: '', otp: '' } : { username: '', password: '' })
        setStep('ID')
        setError('')
    }, [loginType, reset])

    useEffect(() => {
        if (!isLoading && isAuthenticated && user) {
            const roleRedirects = {
                'ADMIN': '/admin/dashboard',
                'CUSTOMER': '/customer/dashboard',
                'CREW': '/crew/dashboard'
            }
            router.push(roleRedirects[user.role] || '/customer/dashboard')
        }
    }, [isAuthenticated, isLoading, user, router])

    useEffect(() => {
        audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3')
    }, [])

    const handleCustomerSubmit = async (data: any) => {
        setLoading(true)
        setError('')
        try {
            const newOtp = generateOTP()
            setStep('OTP')
            setTimeout(() => {
                if (audioRef.current) audioRef.current.play().catch(() => { })
                toast.success(`OTP: ${newOtp} (Simulated)`, {
                    duration: 5000,
                    description: 'In a production environment, this would be sent to your mobile.'
                })
                setValue('otp', newOtp)
            }, 800)
        } catch (err) {
            setError('Failed to generate OTP.')
        } finally {
            setLoading(false)
        }
    }

    const onLogin = async (data: any) => {
        setLoading(true)
        setError('')

        try {
            if (loginType === 'team') {
                const success = await login(data.username, data.password)
                if (!success) setError('Invalid credentials. Please try again.')
            } else {
                const success = await loginWithOTP(data.phone, data.otp)
                if (!success) setError('Invalid OTP. Please try again.')
            }
        } catch (err) {
            setError('An error occurred during login.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (loginType === 'customer' && step === 'OTP' && otp?.length === 6) {
            handleSubmit(onLogin)()
        }
    }, [otp, step, loginType])


    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
            <MusicalNotes />

            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-md px-4">
                <Link
                    href="/"
                    className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors group"
                >
                    <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-primary/20 mr-2 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </div>
                    Back to Home
                </Link>

                <Card className="glass-dark border-white/10 shadow-2xl overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-secondary"></div>

                    <CardHeader className="space-y-2 text-center pt-8 pb-4">
                        <div className="mx-auto mb-2 w-16 h-16 relative">
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
                            <img
                                src="/images/logo.png"
                                alt="Logo"
                                className="w-full h-full object-contain relative z-10"
                            />
                        </div>
                        <CardTitle className="text-2xl font-bold">
                            {step === 'OTP' ? 'Verify OTP' : 'Welcome Back'}
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <Tabs defaultValue="customer" className="w-full" onValueChange={(v) => setLoginType(v as any)}>
                            <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/5 border border-white/10">
                                <TabsTrigger value="customer">Customer</TabsTrigger>
                                <TabsTrigger value="team">Team Members</TabsTrigger>
                            </TabsList>

                            <TabsContent value="customer">
                                {step === 'ID' && (
                                    <form onSubmit={handleSubmit(handleCustomerSubmit)} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Mobile Number</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                                <Input
                                                    id="phone"
                                                    {...register('phone')}
                                                    type="tel"
                                                    placeholder="9876543210"
                                                    className="pl-10 bg-white/5 border-white/10 focus:border-primary/50 text-foreground placeholder:text-muted-foreground/50 transition-all font-mono tracking-wider"
                                                />
                                            </div>
                                            {errors.phone && <p className="text-xs text-destructive">{errors.phone.message as string}</p>}
                                        </div>
                                        <Button
                                            type="submit"
                                            className="w-full h-11 bg-primary hover:bg-primary/90 text-background font-bold shadow-lg shadow-primary/25 transition-all"
                                            disabled={loading}
                                        >
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Get OTP'}
                                        </Button>
                                    </form>
                                )}

                                {step === 'OTP' && (
                                    <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
                                        <div className="space-y-2 text-center py-2">
                                            <p className="text-sm text-muted-foreground">Sent to <span className="text-primary font-bold">{phone}</span></p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="otp" className="text-center block text-muted-foreground uppercase text-[10px] font-black tracking-widest">Verification Code</Label>
                                            <div className="relative">
                                                <ShieldCheck className="absolute left-3 top-2.5 h-5 w-5 text-primary/50" />
                                                <Input
                                                    id="otp"
                                                    {...register('otp')}
                                                    type="text"
                                                    placeholder="••••••"
                                                    maxLength={6}
                                                    className="pl-10 bg-white/5 border-white/10 focus:border-primary/50 text-foreground text-center text-2xl tracking-[0.4em] font-black h-12"
                                                    autoFocus
                                                />
                                            </div>
                                            {errors.otp && <p className="text-xs text-destructive text-center">{errors.otp.message as string}</p>}
                                            <div className="flex justify-between items-center px-1">
                                                <p className="text-[10px] text-muted-foreground">Didn't receive code?</p>
                                                <Button
                                                    type="button"
                                                    variant="link"
                                                    className="text-[10px] font-bold text-primary p-0 h-auto hover:no-underline"
                                                    onClick={() => {
                                                        const newOtp = generateOTP()
                                                        if (audioRef.current) audioRef.current.play().catch(() => { })
                                                        toast.success(`OTP Resent: ${newOtp}`)
                                                        setValue('otp', newOtp)
                                                    }}
                                                >
                                                    <RefreshCw className="w-3 h-3 mr-1" /> Re-send
                                                </Button>
                                            </div>
                                        </div>
                                        {error && (
                                            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center font-medium animate-pulse">
                                                {error}
                                            </div>
                                        )}
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="flex-1 border-white/10 bg-white/5 hover:bg-white/10"
                                                onClick={() => setStep('ID')}
                                            >
                                                Back
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="flex-[2] bg-primary hover:bg-primary/90 text-background font-black uppercase tracking-tight shadow-lg shadow-primary/25"
                                                disabled={loading || otp?.length !== 6}
                                            >
                                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm & Entry'}
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </TabsContent>

                            <TabsContent value="team">
                                <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="username">Username or Email</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                                <Input
                                                    id="username"
                                                    {...register('username')}
                                                    type="text"
                                                    placeholder="admin@vetridj.com"
                                                    className="pl-10 bg-white/5 border-white/10 focus:border-primary/50 text-foreground transition-all"
                                                />
                                            </div>
                                            {errors.username && <p className="text-xs text-destructive">{errors.username.message as string}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Password</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                                <Input
                                                    id="password"
                                                    {...register('password')}
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="pl-10 bg-white/5 border-white/10 focus:border-primary/50 text-foreground placeholder:text-muted-foreground/50 transition-all"
                                                />
                                            </div>
                                            {errors.password && <p className="text-xs text-destructive">{errors.password.message as string}</p>}
                                        </div>
                                    </div>
                                    {error && (
                                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center font-medium animate-pulse">
                                            {error}
                                        </div>
                                    )}
                                    <Button
                                        type="submit"
                                        className="w-full h-11 bg-primary hover:bg-primary/90 text-background font-bold shadow-lg shadow-primary/25 transition-all mt-4"
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>

                        <div className="mt-8 text-center pt-4 border-t border-white/5">
                            <p className="text-sm text-muted-foreground">
                                New Customer?{' '}
                                <Link
                                    href="/register"
                                    className="text-primary hover:underline font-bold"
                                >
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
