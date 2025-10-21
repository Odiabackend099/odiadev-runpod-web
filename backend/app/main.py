from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.routers import tts
import os

app = FastAPI(
    title="Dia AI TTS API",
    description="Text-to-Speech API using Dia AI",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(tts.router, prefix="/api/v1", tags=["tts"])

@app.get("/")
async def root():
    return {"message": "Dia AI TTS API", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "dia-tts-api"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
