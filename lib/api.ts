// API utility functions for ODIADEV-TTS 1.6B

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888'

export interface TTSRequest {
  text: string
  voice_id?: string
}

export interface TTSResponse {
  engine: string
  provider: string
  audio_url: string
  duration: number
  timestamp: string
}

export interface VoiceCloneRequest {
  audio: File
  name: string
  consent: string
}

export interface VoiceCloneResponse {
  voice_id: string
  status: string
  message?: string
}

export const api = {
  // Health check
  async health() {
    const res = await fetch(`${API_BASE_URL}/health`)
    if (!res.ok) throw new Error('Health check failed')
    return res.json()
  },

  // Generate TTS
  async generateTTS(text: string, voiceId?: string): Promise<Blob> {
    const res = await fetch(`${API_BASE_URL}/api/v1/tts/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice_id: voiceId || 'default' }),
    })
    
    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`TTS generation failed: ${res.status} - ${errorText}`)
    }
    
    return res.blob()
  },

  // Clone voice
  async cloneVoice(request: VoiceCloneRequest): Promise<VoiceCloneResponse> {
    const formData = new FormData()
    formData.append('audio', request.audio)
    formData.append('name', request.name)
    formData.append('consent', request.consent)
    
    const res = await fetch(`${API_BASE_URL}/api/v1/voice/clone`, {
      method: 'POST',
      body: formData,
    })
    
    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`Voice cloning failed: ${res.status} - ${errorText}`)
    }
    
    return res.json()
  },

  // List voices
  async listVoices() {
    const res = await fetch(`${API_BASE_URL}/api/v1/voices`)
    if (!res.ok) throw new Error('Failed to fetch voices')
    return res.json()
  },

  // Get voice details
  async getVoice(voiceId: string) {
    const res = await fetch(`${API_BASE_URL}/api/v1/voices/${voiceId}`)
    if (!res.ok) throw new Error('Failed to fetch voice details')
    return res.json()
  },

  // Delete voice
  async deleteVoice(voiceId: string) {
    const res = await fetch(`${API_BASE_URL}/api/v1/voices/${voiceId}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to delete voice')
    return res.json()
  }
}
