from supabase import create_client, Client
import os
from typing import Optional

class UsageService:
    def __init__(self):
        self.supabase: Optional[Client] = None
        
    async def initialize(self):
        """Initialize Supabase connection"""
        if self.supabase is None:
            try:
                supabase_url = os.getenv("SUPABASE_URL")
                supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
                
                if supabase_url and supabase_key:
                    self.supabase = create_client(supabase_url, supabase_key)
                    print("✅ Supabase connection established")
                else:
                    print("⚠️ Supabase credentials not found, using mock service")
            except Exception as e:
                print(f"❌ Supabase connection failed: {e}")
    
    async def check_limits(self):
        """Check usage limits"""
        # Mock implementation for now
        pass
    
    async def track_usage(self, text_length: int):
        """Track usage statistics"""
        if self.supabase is None:
            await self.initialize()
        
        try:
            if self.supabase:
                # Track usage in Supabase
                self.supabase.table("usage_stats").insert({
                    "text_length": text_length,
                    "timestamp": "now()"
                }).execute()
        except Exception as e:
            print(f"❌ Usage tracking error: {e}")
