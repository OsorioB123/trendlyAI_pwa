import os
from supabase import create_client, Client
from typing import Optional
from fastapi import HTTPException, status
import jwt
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class SupabaseClient:
    def __init__(self):
        self.url = os.getenv("SUPABASE_URL")
        self.anon_key = os.getenv("SUPABASE_ANON_KEY")
        self.service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        self.jwt_secret = os.getenv("SUPABASE_JWT_SECRET")
        
        if not all([self.url, self.anon_key, self.service_role_key, self.jwt_secret]):
            raise ValueError("Missing required Supabase environment variables")
        
        # Client for public operations (using anon key)
        self.public_client: Client = create_client(self.url, self.anon_key)
        
        # Client for admin operations (using service role key)
        self.admin_client: Client = create_client(self.url, self.service_role_key)
        
        logger.info("Supabase clients initialized successfully")
    
    def verify_jwt(self, token: str) -> dict:
        """Verify and decode JWT token locally for better performance"""
        try:
            payload = jwt.decode(
                token,
                self.jwt_secret,
                algorithms=["HS256"],
                audience="authenticated"
            )
            
            # Check token expiration
            exp = payload.get('exp')
            if exp and datetime.fromtimestamp(exp) < datetime.utcnow():
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token has expired"
                )
            
            return payload
            
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired"
            )
        except jwt.DecodeError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token format"
            )
        except jwt.InvalidTokenError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
    
    def get_user_from_token(self, token: str) -> dict:
        """Extract user information from JWT token"""
        payload = self.verify_jwt(token)
        return {
            "id": payload.get("sub"),
            "email": payload.get("email"),
            "role": payload.get("role", "authenticated"),
            "exp": payload.get("exp")
        }
    
    async def test_connection(self) -> bool:
        """Test connection to Supabase"""
        try: 
            # Simple query to test connection
            result = self.admin_client.table('profiles').select('id').limit(1).execute()
            logger.info("Supabase connection test successful")
            return True
        except Exception as e:
            logger.error(f"Supabase connection test failed: {e}")
            return False

# Global instance
supabase_client = SupabaseClient()

# Constants for table names
class Tables:
    PROFILES = 'profiles'
    CONVERSATIONS = 'conversations'
    CONVERSATION_PARTICIPANTS = 'conversation_participants'
    MESSAGES = 'messages'
    TRACKS = 'tracks'
    TOOLS = 'tools'
    USER_TRACKS = 'user_tracks'
    USER_TOOLS = 'user_tools'

# Constants for storage buckets  
class Buckets:
    AVATARS = 'avatars'
    ATTACHMENTS = 'attachments'
    CONTENT = 'content'