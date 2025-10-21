# Dia AI TTS - RunPod Deployment

## Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Odiabackend099/ODIA.AI.LTD-tts-2025.git
   cd ODIA.AI.LTD-tts-2025
   ```

2. **Set environment variables**:
   ```bash
   export HF_TOKEN="your_huggingface_token"
   export SUPABASE_URL="your_supabase_url"
   export SUPABASE_SERVICE_ROLE_KEY="your_supabase_key"
   export REDIS_URL="redis://localhost:6379/0"
   ```

3. **Start the service**:
   ```bash
   ./runpod_start.sh
   ```

## API Endpoints

- `GET /health` - Health check
- `POST /api/v1/generate` - Generate TTS audio
- `POST /api/v1/voice-clone` - Clone voice from reference

## Environment Variables

- `HF_TOKEN` - HuggingFace token for model access
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `REDIS_URL` - Redis connection URL

## Production Deployment

The service is ready for production deployment on RunPod with:
- FastAPI backend
- Redis caching
- Supabase usage tracking
- Docker support
- Health checks
