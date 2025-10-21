from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
import io
import asyncio
from typing import Optional
import os
import sys
from pathlib import Path

# Add the dia module to path
sys.path.append(str(Path(__file__).parent.parent.parent.parent / "dia"))

from backend.app.core.config import get_settings
from backend.app.services.dia import DiaService
from backend.app.services.cache import CacheService
from backend.app.services.usage import UsageService

router = APIRouter()

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "dia-tts"}

@router.post("/generate")
async def generate_audio(
    text: str,
    voice: Optional[str] = "default",
    duration: Optional[int] = 30,
    dia_service: DiaService = Depends(DiaService),
    cache_service: CacheService = Depends(CacheService),
    usage_service: UsageService = Depends(UsageService)
):
    """Generate audio using Dia TTS"""
    try:
        # Check usage limits
        await usage_service.check_limits()
        
        # Check cache first
        cache_key = f"{text}_{voice}_{duration}"
        cached_audio = await cache_service.get(cache_key)
        if cached_audio:
            return StreamingResponse(
                io.BytesIO(cached_audio),
                media_type="audio/mpeg",
                headers={"X-Cache": "hit"}
            )
        
        # Generate new audio
        audio_data = await dia_service.generate_audio(text, voice, duration)
        
        # Cache the result
        await cache_service.set(cache_key, audio_data)
        
        # Track usage
        await usage_service.track_usage(len(text))
        
        return StreamingResponse(
            io.BytesIO(audio_data),
            media_type="audio/mpeg",
            headers={"X-Cache": "miss"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/voice-clone")
async def clone_voice(
    text: str,
    reference_audio: bytes,
    voice_service: VoiceService = Depends(VoiceService),
    usage_service: UsageService = Depends(UsageService)
):
    """Clone voice from reference audio"""
    try:
        # Check usage limits
        await usage_service.check_limits()
        
        # Clone voice
        audio_data = await voice_service.clone_voice(text, reference_audio)
        
        # Track usage
        await usage_service.track_usage(len(text))
        
        return StreamingResponse(
            io.BytesIO(audio_data),
            media_type="audio/mpeg"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
