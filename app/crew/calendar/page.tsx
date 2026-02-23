'use client'

import { useState, useEffect } from 'react'
import { storage } from '@/lib/storage'
import { useAuth } from '@/context/auth-context'
import { Booking } from '@/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon, Download, MapPin, Clock, Music, Heart, GlassWater, Star } from 'lucide-react'

export default function CalendarPage() {
    const { user } = useAuth()
    const [events, setEvents] = useState<Booking[]>([])

    useEffect(() => {
        const loadEvents = async () => {
            if (user) {
                const allBookings = await storage.getBookings()
                // Filter bookings where this crew member is assigned
                const assigned = allBookings.filter(b => b.crewAssigned?.includes(user.id))
                // Sort by date
                assigned.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                setEvents(assigned)
            }
        }
        loadEvents()
    }, [user])

    const formatICSDate = (dateStr: string, timeStr: string) => {
        const date = new Date(`${dateStr}T${timeStr}`)
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }

    const handleDownload = () => {
        const calendarStart = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Vetri DJ Events//Crew Calendar//EN',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
        ]

        const calendarEvents = events.map(event => {
            // Default times: 4 PM to 10 PM
            const startTime = '16:00:00'
            const endTime = '22:00:00'
            const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

            return [
                'BEGIN:VEVENT',
                `UID:${event.id}@vetridj.com`,
                `DTSTAMP:${now}`,
                `DTSTART:${formatICSDate(event.date, startTime)}`,
                `DTEND:${formatICSDate(event.date, endTime)}`,
                `SUMMARY:${event.eventType} - ${event.customerName}`,
                `LOCATION:${event.location || 'Chengam'}`,
                `DESCRIPTION:Ref: ${event.id}\\nStatus: ${event.status}\\nNotes: Report by 4:00 PM`,
                'STATUS:CONFIRMED',
                'END:VEVENT'
            ].join('\r\n')
        })

        const calendarEnd = ['END:VCALENDAR']

        const icsContent = [...calendarStart, ...calendarEvents, ...calendarEnd].join('\r\n')

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.setAttribute('download', 'vetri_schedule.ics')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const getEventIcon = (type: string) => {
        const t = type.toLowerCase()
        if (t.includes('wedding')) return <Heart className="h-5 w-5 text-red-400" />
        if (t.includes('party') || t.includes('dj')) return <Music className="h-5 w-5 text-primary" />
        if (t.includes('reception')) return <GlassWater className="h-5 w-5 text-blue-400" />
        return <Star className="h-5 w-5 text-yellow-500" />
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">My Calendar</h2>
                    <p className="text-muted-foreground">Your event schedule.</p>
                </div>
                <Button onClick={handleDownload} variant="outline" className="border-white/10 hover:bg-white/10 text-white">
                    <Download className="mr-2 h-4 w-4" /> Download Schedule
                </Button>
            </div>

            <div className="space-y-4">
                {events.length === 0 ? (
                    <Card className="glass-dark border-dashed border-white/20">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <CalendarIcon className="h-12 w-12 mb-4 opacity-20" />
                            <p>No events scheduled yet.</p>
                        </CardContent>
                    </Card>
                ) : (
                    events.map((event) => (
                        <Card key={event.id} className="glass-dark border-white/10 hover:border-primary/50 transition-colors group">
                            <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                                <div className="flex-shrink-0 flex items-center gap-4">
                                    <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-white/5 border border-white/10 group-hover:border-primary/50 transition-colors">
                                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                        <span className="text-2xl font-bold text-foreground">{new Date(event.date).getDate()}</span>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                        {getEventIcon(event.eventType)}
                                    </div>
                                </div>

                                <div className="flex-1 space-y-1">
                                    <h4 className="text-xl font-bold group-hover:text-primary transition-colors text-white">{event.eventType} - {event.customerName}</h4>
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-primary/50" /> {event.location || 'Location TBD'}</span>
                                        <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-primary/50" /> 4:00 PM</span>
                                        <span className="flex items-center gap-1 tracking-tighter">REF: #{event.id}</span>
                                    </div>
                                </div>

                                <div className="flex-shrink-0">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${event.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                        event.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                            'bg-gray-500/10 text-gray-500 border-gray-500/20'
                                        }`}>
                                        {event.status}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
