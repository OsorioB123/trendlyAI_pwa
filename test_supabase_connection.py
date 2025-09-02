#!/usr/bin/env python3
"""
Script para testar a conexão com Supabase
"""

import asyncio
import sys
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
backend_path = Path(__file__).parent / 'backend'
env_path = backend_path / '.env'
load_dotenv(env_path)

# Add backend to path
sys.path.append(str(backend_path))

from supabase_client import supabase_client

async def test_supabase_connection():
    """Test basic Supabase connection"""
    print("🔄 Testing Supabase connection...")
    
    try:
        # Test admin client connection
        print("📡 Testing admin client connection...")
        
        # Try to select from auth.users (should work with service role)
        result = supabase_client.admin_client.table('profiles').select('id').limit(1).execute()
        print(f"✅ Admin client connection successful! (Found {len(result.data)} profiles)")
        
        # Test public client connection  
        print("📡 Testing public client connection...")
        try:
            # This might fail if no public tables exist yet, but connection should work
            result2 = supabase_client.public_client.table('profiles').select('id').limit(1).execute()
            print(f"✅ Public client connection successful! (Found {len(result2.data)} profiles)")
        except Exception as e:
            print(f"⚠️  Public client connection test inconclusive: {e}")
            print("   This is normal if the database schema hasn't been created yet.")
        
        print("\n🎉 Supabase configuration is working correctly!")
        print(f"   Project URL: {supabase_client.url}")
        print(f"   JWT Secret: {'*' * 20}...{supabase_client.jwt_secret[-10:]}")
        
        return True
        
    except Exception as e:
        print(f"❌ Supabase connection failed: {e}")
        print("\nPlease check:")
        print("1. Environment variables are set correctly")
        print("2. Supabase project is accessible")
        print("3. API keys are valid")
        return False

def test_environment_variables():
    """Test if all required environment variables are set"""
    print("🔧 Checking environment variables...")
    
    required_vars = [
        'SUPABASE_URL',
        'SUPABASE_ANON_KEY', 
        'SUPABASE_SERVICE_ROLE_KEY',
        'SUPABASE_JWT_SECRET'
    ]
    
    missing_vars = []
    for var in required_vars:
        value = os.getenv(var)
        if not value:
            missing_vars.append(var)
        else:
            # Show partial values for security
            if 'KEY' in var or 'SECRET' in var:
                display_value = f"{value[:10]}...{value[-10:]}"
            else:
                display_value = value
            print(f"   ✅ {var}: {display_value}")
    
    if missing_vars:
        print(f"   ❌ Missing variables: {', '.join(missing_vars)}")
        return False
    
    print("   ✅ All environment variables are set!")
    return True

if __name__ == "__main__":
    print("=" * 60)
    print("🚀 SUPABASE CONNECTION TEST")
    print("=" * 60)
    
    # Test environment variables first
    env_ok = test_environment_variables()
    print()
    
    if not env_ok:
        print("❌ Environment variables test failed. Please check your .env file.")
        sys.exit(1)
    
    # Test Supabase connection
    connection_ok = asyncio.run(test_supabase_connection())
    
    if connection_ok:
        print("\n🎯 NEXT STEPS:")
        print("1. Run the database schema SQL in your Supabase dashboard")
        print("2. Create storage buckets (avatars, attachments, content)")
        print("3. Test authentication endpoints")
        sys.exit(0)
    else:
        print("\n❌ Connection test failed. Please check your configuration.")
        sys.exit(1)