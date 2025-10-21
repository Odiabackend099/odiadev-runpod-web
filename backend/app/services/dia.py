import asyncio
import torch
import sys
from pathlib import Path
from typing import Optional

# Add the dia module to path
sys.path.append(str(Path(__file__).parent.parent.parent.parent / "dia"))

class DiaService:
    def __init__(self):
        self.model = None
        self.settings = None
        
    async def initialize(self):
        """Initialize the Dia model"""
        if self.model is None:
            try:
                from dia.model import Dia
                self.model = Dia.from_pretrained("nari-labs/dia-1.6b", compute_dtype="float32")
                print("✅ Dia model loaded successfully")
            except Exception as e:
                print(f"❌ Error loading Dia model: {e}")
                raise
    
    async def generate_audio(self, text: str, voice: str = "default", duration: int = 30) -> bytes:
        """Generate audio using Dia TTS"""
        if self.model is None:
            await self.initialize()
        
        try:
            # Format text for Dia TTS
            formatted_text = f"[S1] {text}"
            
            # Generate audio
            output = self.model.generate(
                formatted_text,
                use_torch_compile=False,
                verbose=False,
                cfg_scale=3.0,
                temperature=1.8,
                top_p=0.90,
                cfg_filter_top_k=50,
            )
            
            # Save to bytes
            import tempfile
            with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp_file:
                self.model.save_audio(tmp_file.name, output)
                with open(tmp_file.name, "rb") as f:
                    audio_data = f.read()
                os.unlink(tmp_file.name)
            
            return audio_data
            
        except Exception as e:
            print(f"❌ Error generating audio: {e}")
            raise
