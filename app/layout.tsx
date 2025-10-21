import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '../contexts/AuthContext'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'ODIADEV-TTS 1.6B - Proprietary Neural Voice Engine',
  description: 'Experience Africa\'s most advanced voice AI engine. Convert text to natural speech with our proprietary 1.6-billion-parameter neural model by ODIADEV AI LTD.',
  keywords: 'text-to-speech, TTS, AI voice, neural network, African voices, ODIADEV',
  authors: [{ name: 'ODIADEV AI LTD' }],
  openGraph: {
    title: 'ODIADEV-TTS 1.6B - Proprietary Neural Voice Engine',
    description: 'Experience Africa\'s most advanced voice AI engine by ODIADEV AI LTD.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
}

