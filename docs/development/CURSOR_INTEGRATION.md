# ODIA.AI TTS - Cursor Integration Instructions

## Project Overview
Connect the **Vercel-hosted frontend** to the **RunPod-hosted backend** for the ODIA.AI Text-to-Speech system.

**Repository**: https://github.com/Odiabackend099/ODIA.AI.LTD-tts-2025.git  
**Branch**: `main`

---

## Architecture

### Backend (RunPod)
- **Framework**: FastAPI (Python)
- **Port**: 8888
- **Location**: `/workspace/app/backend`
- **Model**: nari-labs/Dia-1.6B (HuggingFace)
- **Dependencies**: PyTorch, transformers, speechbrain, redis

### Frontend (Vercel)
- **Framework**: Next.js / React
- **Location**: `/app` (root level)
- **Build**: Static export or SSR

---

## Critical Fixes Required

### 1. Backend API Fixes (Already Applied)

**File**: `backend/app/routers/voice.py`

```python
# Line 1: ADD THIS IMPORT
from fastapi import Form

# This was missing and causing "NameError: name 'Form' is not defined"
```

**File**: `backend/requirements.txt`

```txt
# ADD THIS LINE (was missing)
python-multipart

# This is required for Form data handling in FastAPI
```

---

## Environment Variables

### Backend (.env in `/workspace/app/`)
```bash
# HuggingFace
HF_TOKEN=your_huggingface_token_here

# Supabase
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Redis
REDIS_URL=redis://localhost:6379/0

# Model
DIA_MODEL_ID=nari-labs/Dia-1.6B
DIA_MODEL_REV=main

# API Settings
ALLOWED_ORIGINS=https://tts.odia.dev,http://localhost:3000
MAX_CHARS=800
DIA_USE_BNB=0
```

### Frontend (.env.local for Vercel)
```bash
# Backend URL - CRITICAL TO UPDATE
NEXT_PUBLIC_API_URL=https://YOUR-POD-ID-8888.proxy.runpod.net

# OR use direct TCP
NEXT_PUBLIC_API_URL=http://213.173.110.201:27448

# Supabase (if used in frontend)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

---

## Frontend API Integration

### 1. API Client Setup

**File**: `lib/api.ts` (CREATE THIS)

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888';

export const api = {
  // Health check
  async health() {
    const res = await fetch(`${API_BASE_URL}/health`);
    return res.json();
  },

  // Generate TTS
  async generateTTS(text: string, voiceId?: string) {
    const res = await fetch(`${API_BASE_URL}/api/v1/tts/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice_id: voiceId || 'default' }),
    });
    
    if (!res.ok) throw new Error('TTS generation failed');
    
    // Return audio blob
    return res.blob();
  },

  // Clone voice
  async cloneVoice(formData: FormData) {
    const res = await fetch(`${API_BASE_URL}/api/v1/voice/clone`, {
      method: 'POST',
      body: formData, // Don't set Content-Type, let browser handle it
    });
    
    return res.json();
  },
};
```

### 2. React Component Example

**File**: `components/TTSPlayer.tsx`

```typescript
'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export default function TTSPlayer() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const blob = await api.generateTTS(text);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (error) {
      console.error('TTS Error:', error);
      alert('Failed to generate audio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to speak..."
        className="w-full p-4 border rounded"
        rows={4}
      />
      
      <button
        onClick={handleGenerate}
        disabled={loading || !text}
        className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Speech'}
      </button>

      {audioUrl && (
        <audio controls src={audioUrl} className="w-full" />
      )}
    </div>
  );
}
```

---

## CORS Configuration

### Backend CORS Setup

**File**: `backend/app/main.py`

```python
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CRITICAL: Add your Vercel URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://tts.odia.dev",  # Your Vercel production URL
        "https://*.vercel.app",   # Vercel preview deployments
        "http://localhost:3000",  # Local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Deployment Steps

### 1. Deploy Backend to RunPod

```bash
# SSH into RunPod pod
ssh root@213.173.110.201 -p 27448

# Navigate to workspace
cd /workspace

# Clone repo (if not exists)
git clone https://github.com/Odiabackend099/ODIA.AI.LTD-tts-2025.git app
cd app
git checkout main

# Create .env file (copy from above)
cat > .env << 'EOF'
# Paste environment variables here
EOF

# Install dependencies
cd backend
apt-get update && apt-get install -y redis-server
redis-server --daemonize yes

python3.10 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install python-multipart

# Start service
uvicorn app.main:app --host 0.0.0.0 --port 8888
```

### 2. Deploy Frontend to Vercel

```bash
# In your local machine
cd frontend

# Set environment variables in Vercel dashboard:
# Settings > Environment Variables > Add:
NEXT_PUBLIC_API_URL=https://YOUR-POD-ID-8888.proxy.runpod.net

# Push to GitHub
git add .
git commit -m "Configure API URL for RunPod backend"
git push origin main

# Vercel will auto-deploy
```

---

## API Endpoints Reference

### Health Check
```
GET /health
Response: {"status": "ok"}
```

### Generate TTS
```
POST /api/v1/tts/generate
Body: {
  "text": "Hello world",
  "voice_id": "default" (optional)
}
Response: Audio file (WAV/MP3)
```

### Clone Voice
```
POST /api/v1/voice/clone
Body: FormData {
  "audio": File,
  "name": string,
  "consent": "yes"
}
Response: {
  "voice_id": "uuid",
  "status": "success"
}
```

### List Voices
```
GET /api/v1/voices
Response: {
  "voices": [...]
}
```

---

## Testing Checklist

### Backend Tests (RunPod)
```bash
# Test health
curl http://localhost:8888/health

# Test TTS generation
curl -X POST http://localhost:8888/api/v1/tts/generate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world"}' \
  -o test.wav

# View API docs
curl http://localhost:8888/docs
```

### Frontend Tests (Local)
```bash
cd /path/to/odia-tts
npm run dev

# Open http://localhost:3000
# Test TTS generation in UI
# Check browser console for errors
```

---

## Common Issues & Fixes

### Issue 1: "Form is not defined"
**Fix**: Add `from fastapi import Form` to `voice.py` (line 1)

### Issue 2: "python-multipart not installed"
**Fix**: Add `python-multipart` to `requirements.txt`

### Issue 3: CORS errors in browser
**Fix**: Update `allow_origins` in `main.py` with your Vercel URL

### Issue 4: 404 on API calls
**Fix**: Verify `NEXT_PUBLIC_API_URL` is correct in Vercel env vars

### Issue 5: Connection refused
**Fix**: Ensure RunPod service is running on port 8888

---

## Monitoring & Logs

### Backend Logs (RunPod)
```bash
# View live logs
tail -f /workspace/app/logs.txt

# View service status
ps aux | grep uvicorn

# Restart service
pkill -f uvicorn
cd /workspace/app/backend && source .venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8888
```

### Frontend Logs (Vercel)
- Dashboard: https://vercel.com/your-project/deployments
- Click deployment > "Functions" tab > View logs
- Check browser DevTools > Console for client errors

---

## Quick Start Commands

### Setup Backend
```bash
cd /workspace/app/backend && source .venv/bin/activate && pip install python-multipart && uvicorn app.main:app --host 0.0.0.0 --port 8888
```

### Update Frontend API URL
```bash
# In Vercel dashboard
NEXT_PUBLIC_API_URL=https://[POD-ID]-8888.proxy.runpod.net
```

### Push Changes
```bash
git add .
git commit -m "Connect frontend to RunPod backend"
git push origin main
```

---

## Support

- **Repository**: https://github.com/Odiabackend099/ODIA.AI.LTD-tts-2025
- **Backend Port**: 8888
- **Frontend**: Deployed on Vercel
- **Model**: nari-labs/Dia-1.6B

**Status**: ✅ Backend running, ready for frontend connection.