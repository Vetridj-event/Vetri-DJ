'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { HelpCircle, X, ChevronRight, Play, FileQuestion, MessageCircle } from 'lucide-react'

export function HelpCenter() {
    const [isOpen, setIsOpen] = useState(false)

    const faqs = [
        { q: 'How to add a new booking?', a: 'Go to the Bookings page and click the "New Booking" button at the top right.' },
        { q: 'Can I assign multiple crew members?', a: 'Yes, in the booking details, you can select multiple crew members from the dropdown.' },
        { q: 'How to track crew payments?', a: 'Visit the Finance & HR section to see total payments made to each crew member under Payroll.' },
    ]

    return (
        <>
            {/* Floating Toggle Button */}
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-2xl bg-primary text-background p-0 hover:scale-110 transition-transform active:scale-95 z-50"
            >
                <HelpCircle className="h-6 w-6" />
            </Button>

            {/* Sidebar/Panel */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div
                        className="absolute right-0 top-0 h-full w-full max-w-sm glass-dark border-l border-white/10 p-6 animate-in slide-in-from-right duration-500"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <HelpCircle className="h-5 w-5 text-primary" /> Admin Help
                            </h3>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:bg-white/5">
                                <X className="h-5 w-5 text-muted-foreground" />
                            </Button>
                        </div>

                        <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-120px)] pr-2 custom-scrollbar">
                            <Card className="bg-primary/5 border-primary/20">
                                <CardHeader className="p-4">
                                    <CardTitle className="text-sm font-bold text-primary flex items-center gap-2">
                                        <Play className="h-4 w-4" /> Video Tutorial
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <p className="text-xs text-muted-foreground mb-3">Quick tour of the new Advanced Dashboard features.</p>
                                    <Button variant="outline" size="sm" className="w-full text-xs border-primary/20 text-primary">Watch Guide</Button>
                                </CardContent>
                            </Card>

                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                    <FileQuestion className="h-3.5 w-3.5" /> Frequent Questions
                                </h4>
                                {faqs.map((faq, i) => (
                                    <details key={i} className="group border-b border-white/5 pb-2">
                                        <summary className="flex justify-between items-center cursor-pointer list-none text-sm font-medium text-white/90 hover:text-primary transition-colors">
                                            {faq.q}
                                            <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
                                        </summary>
                                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{faq.a}</p>
                                    </details>
                                ))}
                            </div>

                            <Card className="glass-dark border-white/10 mt-6">
                                <CardHeader className="p-4">
                                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                                        <MessageCircle className="h-4 w-4 text-green-500" /> Need Support?
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <p className="text-xs text-muted-foreground mb-4">Chat live with our technical support team.</p>
                                    <Button className="w-full text-xs bg-green-500 hover:bg-green-600 text-white font-bold">Start Live Chat</Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
