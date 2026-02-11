'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Book, FileText, Share2, MessageSquare, Lightbulb } from 'lucide-react'

export default function WorkspacePage() {
    const [searchTerm, setSearchTerm] = useState('')

    const documents = [
        { id: 1, title: 'Wedding Event SOP', category: 'Standard Ops', updated: '2 days ago', author: 'Admin' },
        { id: 2, title: 'Sound Setup Guide', category: 'Technical', updated: '5 days ago', author: 'Crew-Lead' },
        { id: 3, title: 'Customer Interaction Rules', category: 'Service', updated: '1 week ago', author: 'Admin' },
        { id: 4, title: 'Lighting Patterns 2026', category: 'Creative', updated: '3 days ago', author: 'Visual-Team' },
    ]

    const filteredDocs = documents.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Team Workspace</h2>
                    <p className="text-muted-foreground">Collaborate on SOPs, guides, and creative ideas.</p>
                </div>
                <Button className="bg-primary text-background font-bold">
                    <Plus className="mr-2 h-4 w-4" /> Create Document
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                <Card className="glass-dark border-white/5 md:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-sm">Quick Filters</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button variant="ghost" className="w-full justify-start text-xs hover:bg-white/5">
                            <Book className="mr-2 h-3 w-3" /> All Documents
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-xs hover:bg-white/5 text-primary">
                            <FileText className="mr-2 h-3 w-3" /> SOPs
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-xs hover:bg-white/5">
                            <Lightbulb className="mr-2 h-3 w-3" /> Creative Ideas
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-xs hover:bg-white/5">
                            <MessageSquare className="mr-2 h-3 w-3" /> Team Discussions
                        </Button>
                    </CardContent>
                </Card>

                <div className="md:col-span-3 space-y-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search documents or ideas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white/5 border-white/10 pl-10"
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {filteredDocs.map((doc) => (
                            <Card key={doc.id} className="glass-dark border-white/5 hover:border-primary/50 transition-all cursor-pointer group">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <Badge variant="outline" className="text-[10px] border-primary/20 text-primary">{doc.category}</Badge>
                                        <Share2 className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                    <CardTitle className="text-base mt-2">{doc.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                                        <span>BY {doc.author}</span>
                                        <span>UPDATED {doc.updated}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
