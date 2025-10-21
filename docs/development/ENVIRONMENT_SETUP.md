# Environment Variables for ODIADEV-TTS 1.6B

## Frontend (.env.local for Vercel)

```bash
# Backend API URL - CRITICAL TO UPDATE
NEXT_PUBLIC_API_URL=https://YOUR-POD-ID-8888.proxy.runpod.net

# OR use direct TCP (if proxy not working)
NEXT_PUBLIC_API_URL=http://213.173.110.201:27448

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Backend (.env for RunPod)

```bash
# HuggingFace Token
HF_TOKEN=your_huggingface_token_here

# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Redis Configuration
REDIS_URL=redis://localhost:6379/0

# Model Configuration
DIA_MODEL_ID=nari-labs/Dia-1.6B
DIA_MODEL_REV=main

# API Settings
ALLOWED_ORIGINS=https://tts.odia.dev,http://localhost:3000,https://*.vercel.app
MAX_CHARS=800
DIA_USE_BNB=0

# Server Configuration
API_HOST=0.0.0.0
API_PORT=8888