import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AuthProvider } from '@/context/auth-context'

import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Vetri DJ Events - Top Rated DJ Service',
  description: 'Book professional DJ services for weddings, birthdays, corporate events & cultural programs. High-quality JBL speakers, LED walls, and premium lighting. 4.9★ rated service in Chengam.',
  generator: 'v0.app',
  keywords: ['DJ services Chengam', 'Wedding DJ', 'Event DJ', 'LED wall rental', 'Professional sound system'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased text-foreground bg-background">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
