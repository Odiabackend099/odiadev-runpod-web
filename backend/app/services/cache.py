import redis
import json
from typing import Optional
import os

class CacheService:
    def __init__(self):
        self.redis_client = None
        
    async def initialize(self):
        """Initialize Redis connection"""
        if self.redis_client is None:
            try:
                redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
                self.redis_client = redis.from_url(redis_url)
                # Test connection
                self.redis_client.ping()
                print("✅ Redis connection established")
            except Exception as e:
                print(f"❌ Redis connection failed: {e}")
                # Fallback to in-memory cache
                self.redis_client = {}
    
    async def get(self, key: str) -> Optional[bytes]:
        """Get cached audio data"""
        if self.redis_client is None:
            await self.initialize()
        
        try:
            if isinstance(self.redis_client, dict):
                return self.redis_client.get(key)
            else:
                data = self.redis_client.get(key)
                return data if data else None
        except Exception as e:
            print(f"❌ Cache get error: {e}")
            return None
    
    async def set(self, key: str, value: bytes, expire: int = 3600):
        """Set cached audio data"""
        if self.redis_client is None:
            await self.initialize()
        
        try:
            if isinstance(self.redis_client, dict):
                self.redis_client[key] = value
            else:
                self.redis_client.setex(key, expire, value)
        except Exception as e:
            print(f"❌ Cache set error: {e}")
