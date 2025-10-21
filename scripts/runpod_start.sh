#!/bin/bash

# RunPod Deployment Script for Dia AI TTS
# This script sets up the environment and starts the TTS service

echo "🚀 Starting Dia AI TTS on RunPod..."

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt
pip install -r backend/requirements.txt

# Set environment variables
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
export DIA_MODEL_ID="nari-labs/dia-1.6b"
export REDIS_URL="${REDIS_URL:-redis://localhost:6379/0}"
export SUPABASE_URL="${SUPABASE_URL}"
export SUPABASE_SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY}"
export HF_TOKEN="${HF_TOKEN}"

# Start the FastAPI server
echo "🎙️ Starting Dia AI TTS API server..."
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
