from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from .supabase_client import supabase_client

# HTTP Bearer token scheme
security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """
    Dependency to get current authenticated user from JWT token.
    Raises HTTPException if token is invalid or expired.
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        user = supabase_client.get_user_from_token(credentials.credentials)
        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[dict]:
    """
    Optional authentication dependency.
    Returns user info if valid token is provided, None otherwise.
    Does not raise exceptions for missing or invalid tokens.
    """
    if not credentials:
        return None
    
    try:
        user = supabase_client.get_user_from_token(credentials.credentials)
        return user
    except Exception:
        return None

class RequireRole:
    """
    Dependency class to require specific user roles.
    Usage: Depends(RequireRole(['admin', 'moderator']))
    """
    def __init__(self, allowed_roles: list):
        self.allowed_roles = allowed_roles
    
    def __call__(self, current_user: dict = Depends(get_current_user)) -> dict:
        user_role = current_user.get('role', 'authenticated')
        
        if user_role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. Required roles: {self.allowed_roles}"
            )
        
        return current_user

# Common role dependencies
require_admin = RequireRole(['admin'])
require_moderator = RequireRole(['admin', 'moderator'])

# Helper function to get user from Supabase by ID
async def get_user_profile(user_id: str) -> Optional[dict]:
    """Get user profile from Supabase profiles table"""
    try:
        result = supabase_client.admin_client.table('profiles').select('*').eq('id', user_id).execute()
        return result.data[0] if result.data else None
    except Exception as e:
        print(f"Error fetching user profile: {e}")
        return None

# Helper function to check if user exists
async def user_exists(user_id: str) -> bool:
    """Check if user exists in profiles table"""
    profile = await get_user_profile(user_id)
    return profile is not None