'use client'

import { useState } from 'react'
import { api } from '@/lib/api'

export default function TTSPlayer() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError('Please enter some text to generate speech')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setAudioUrl(null)
      
      const blob = await api.generateTTS(text)
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)
    } catch (error) {
      console.error('TTS Error:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate audio. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">ODIADEV-TTS 1.6B Demo</h3>
        <p className="text-gray-600">Experience our proprietary neural voice engine</p>
      </div>
      
      <div>
        <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
          Enter text to convert to speech
        </label>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message here... (e.g., 'Hello, this is ODIADEV-TTS 1.6B, the most advanced voice AI engine in Africa.')"
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
          rows={4}
          maxLength={800}
        />
        <div className="text-right text-sm text-gray-500 mt-1">
          {text.length}/800 characters
        </div>
      </div>
      
      <button
        onClick={handleGenerate}
        disabled={loading || !text.trim()}
        className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700 transition duration-300 font-medium"
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
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-medium">Error</h4>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {audioUrl && (
        <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="font-medium text-green-800">Audio Generated Successfully!</h4>
          </div>
          
          <div className="space-y-3">
            <audio controls src={audioUrl} className="w-full" />
            <div className="flex gap-2">
              <a 
                href={audioUrl} 
                download="odiadev-tts-output.mp3"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download MP3
              </a>
              <button
                onClick={() => setAudioUrl(null)}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
