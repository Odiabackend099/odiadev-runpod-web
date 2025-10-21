'use client'

import { useState } from 'react'
import Layout from '@/components/Layout'
import AudioPlayer from '@/components/AudioPlayer'

export default function HomePage() {
  const [text, setText] = useState('')
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateSpeech = async () => {
    if (!text.trim()) return
    
    setLoading(true)
    setError(null)
    setAudioUrl(null)
    
    try {
      const response = await fetch('/api/v1/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text,
          voice: 'default',
          duration: 30
        }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const audioBlob = await response.blob()
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate speech')
      console.error('Error generating speech:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="bg-gradient-to-br from-indigo-50 to-blue-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
              ODIADEV-TTS 1.6B
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Experience Africa's most advanced voice AI engine. Convert text to natural speech 
              with our proprietary 1.6-billion-parameter neural model.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300">
                Try Demo
              </button>
              <button className="bg-white hover:bg-gray-50 text-indigo-600 font-bold py-3 px-8 rounded-lg border border-indigo-600 transition duration-300">
                View Pricing
              </button>
            </div>
          </div>

          {/* Demo Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Try ODIADEV-TTS 1.6B
            </h2>
            
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter text to convert to speech
                </label>
                <textarea
                  id="text"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="Type your text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>

              <button
                onClick={generateSpeech}
                disabled={loading || !text.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Speech...
                  </span>
                ) : (
                  'Generate Speech'
                )}
              </button>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {audioUrl && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Audio</h3>
                  <AudioPlayer audioUrl={audioUrl} />
                  <div className="mt-4 flex gap-4">
                    <a 
                      href={audioUrl} 
                      download="odiadev-tts-output.mp3"
                      className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download MP3
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-indigo-600 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">24/7 Call Coverage</h3>
              <p className="text-gray-600">Never miss a customer call with our AI receptionist that answers in your own voice.</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-indigo-600 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">WhatsApp Follow-up</h3>
              <p className="text-gray-600">Automatically send personalized voice messages to customers via WhatsApp.</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-indigo-600 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Missed-call Recovery</h3>
              <p className="text-gray-600">Convert missed calls into voice messages that feel like personal conversations.</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-indigo-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Voice?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of businesses using ODIADEV-TTS 1.6B for their voice needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white hover:bg-gray-100 text-indigo-600 font-bold py-3 px-8 rounded-lg transition duration-300">
                Start Free Trial
              </button>
              <button className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-3 px-8 rounded-lg border border-indigo-400 transition duration-300">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
