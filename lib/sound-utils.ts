export const playSound = (soundType: 'click' | 'success' | 'notification' | 'error') => {
    if (typeof window === 'undefined') return

    const soundMap = {
        click: '/sounds/click.mp3',
        success: '/sounds/success.mp3',
        notification: '/sounds/notification.mp3',
        error: '/sounds/error.mp3'
    }

    const audio = new Audio(soundMap[soundType])
    audio.play().catch(err => console.warn('Sound playback failed:', err))
}
