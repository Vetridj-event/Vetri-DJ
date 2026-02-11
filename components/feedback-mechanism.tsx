'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { MessageSquarePlus, Send, X } from 'lucide-react'
import { toast } from 'sonner'

export function FeedbackMechanism() {
    const [isOpen, setIsOpen] = useState(false)
    const [feedback, setFeedback] = useState('')

    const handleSubmit = () => {
        if (!feedback.trim()) return
        toast.success('Thank you for your feedback!', {
            description: 'Our team will review your suggestions for the next update.'
        })
        setFeedback('')
        setIsOpen(false)
    }

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                variant="outline"
                className="fixed bottom-6 left-6 h-10 px-4 rounded-xl glass-dark border-white/10 text-xs font-bold gap-2 hover:bg-white/10 z-50"
            >
                <MessageSquarePlus className="h-4 w-4" /> Suggest Feature
            </Button>
        )
    }

    return (
        <div className="fixed bottom-6 left-6 w-80 glass-dark border border-white/10 rounded-2xl p-4 shadow-2xl z-50 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm">Submit Feedback</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-6 w-6">
                    <X className="h-4 w-4" />
                </Button>
            </div>
            <Textarea
                placeholder="What can we improve?"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="bg-white/5 border-white/10 text-xs min-h-[100px] mb-4"
            />
            <Button onClick={handleSubmit} className="w-full text-xs font-bold gap-2 bg-primary text-background">
                <Send className="h-3.5 w-3.5" /> Send Feedback
            </Button>
        </div>
    )
}
