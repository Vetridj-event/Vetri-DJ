'use client'

import { useEffect, useState, useRef } from 'react'

interface Note {
  id: number
  left: number
  top: number
  delay: string
  duration: string
  icon: string
  size: number
  rotation: number
}

export function MusicalNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  // Use a ref to track if we're on the client to avoid hydration mismatch
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const noteIcons = ['♪', '♫', '♬', '♩', '♭', '♮', '♯', '𝄞', '𝄢']
    const generatedNotes: Note[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: `${Math.random() * 5}s`,
      duration: `${10 + Math.random() * 10}s`,
      icon: noteIcons[Math.floor(Math.random() * noteIcons.length)],
      size: 20 + Math.random() * 40,
      rotation: Math.random() * 360,
    }))
    setNotes(generatedNotes)
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {notes.map((note) => {
        const xOffset = mousePosition.x * 20
        const yOffset = mousePosition.y * 20

        return (
          <div
            key={note.id}
            className="absolute text-primary/10 font-bold transition-transform duration-200 ease-out select-none"
            style={{
              left: `${note.left}%`,
              top: `${note.top}%`,
              fontSize: `${note.size}px`,
              animation: `float ${note.duration} ease-in-out infinite`,
              animationDelay: note.delay,
              transform: `translate(${xOffset}px, ${yOffset}px) rotate(${note.rotation}deg)`,
              filter: 'blur(1px)',
              background: 'linear-gradient(to bottom, currentColor, transparent)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {note.icon}
          </div>
        )
      })}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.03),transparent_70%)]" />
    </div>
  )
}
