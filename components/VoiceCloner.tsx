'use client'

import { useState } from 'react'
import { api } from '../lib/api'

export default function VoiceCloner() {
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [voiceName, setVoiceName] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('audio/')) {
        setError('Please select an audio file')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        return
      }
      setAudioFile(file)
      setError(null)
    }
  }

  const handleClone = async () => {
    if (!audioFile || !voiceName.trim()) {
      setError('Please select an audio file and enter a voice name')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setResult(null)
      
      const response = await api.cloneVoice({
        audio: audioFile,
        name: voiceName.trim(),
        consent: 'yes'
      })
      
      setResult(response)
    } catch (error) {
      console.error('Voice cloning error:', error)
      setError(error instanceof Error ? error.message : 'Failed to clone voice. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setAudioFile(null)
    setVoiceName('')
    setResult(null)
    setError(null)
    const fileInput = document.getElementById('audio-file') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Voice Cloning</h3>
        <p className="text-gray-600">Create a custom voice profile from your audio sample</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="voice-name" className="block text-sm font-medium text-gray-700 mb-2">
            Voice Name
          </label>
          <input
            id="voice-name"
            type="text"
            value={voiceName}
            onChange={(e) => setVoiceName(e.target.value)}
            placeholder="Enter a name for your voice (e.g., 'My Professional Voice')"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            maxLength={50}
          />
        </div>
        
        <div>
          <label htmlFor="audio-file" className="block text-sm font-medium text-gray-700 mb-2">
            Audio File
          </label>
          <input
            id="audio-file"
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          <p className="text-sm text-gray-500 mt-1">
            Upload a clear audio sample (MP3, WAV, M4A). Max 10MB.
          </p>
          {audioFile && (
            <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
              <strong>Selected:</strong> {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            id="consent"
            defaultChecked
            className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="consent" className="ml-2 text-sm text-gray-700">
            I consent to using my voice sample to create a custom voice profile for personal use.
          </label>
        </div>
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={handleClone}
          disabled={loading || !audioFile || !voiceName.trim()}
          className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg disabled:opacity-50 hover:bg-purple-700 transition duration-300 font-medium"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Cloning Voice...
            </span>
          ) : (
            'Clone Voice'
          )}
        </button>
        
        <button
          onClick={resetForm}
          className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300"
        >
          Reset
        </button>
      </div>

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

      {result && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          <div className="flex">
            <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-medium">Voice Cloned Successfully!</h4>
              <p className="text-sm mt-1">Voice ID: <code className="bg-green-100 px-1 rounded">{result.voice_id}</code></p>
              <p className="text-sm mt-1">You can now use this voice for text-to-speech generation.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

