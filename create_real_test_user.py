#!/usr/bin/env python3
"""
Script para criar um usuário de teste real via Supabase Auth
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

async def create_real_test_user():
    """Create a real test user via Supabase Auth Admin API"""
    print("🔄 Creating real test user via Supabase Auth...")
    
    try:
        # Use admin client to create user
        user_data = {
            'email': 'teste@trendlyai.com',
            'password': 'TesteSenha123!',
            'email_confirm': True,  # Skip email confirmation for testing
            'user_metadata': {
                'display_name': 'João Silva Teste'
            }
        }
        
        # Create user using admin client
        result = supabase_client.admin_client.auth.admin.create_user(user_data)
        
        if result.user:
            print(f"✅ Test user created successfully!")
            print(f"   Email: {result.user.email}")
            print(f"   ID: {result.user.id}")
            print(f"   Email confirmed: {result.user.email_confirmed_at is not None}")
            
            # Now update the profile that should have been created by the trigger
            await asyncio.sleep(2)  # Wait for trigger to execute
            
            profile_updates = {
                'display_name': 'João Silva',
                'bio': 'Explorador digital apaixonado por IA e tecnologia. Sempre em busca de novas formas de criar conteúdo inovador.',
                'level': 'Estrategista',
                'streak_days': 7,
                'total_tracks': 4,
                'completed_modules': 12,
                'credits': 45,
                'max_credits': 50,
                'avatar_url': 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&q=80',
                'preferences': {
                    'background': 'modern-gradient',
                    'notifications': True,
                    'theme': 'dark'
                },
                'metadata': {
                    'signup_source': 'test',
                    'last_activity': '2025-01-02T10:00:00Z'
                }
            }
            
            # Update profile
            profile_result = supabase_client.admin_client.table('profiles').update(profile_updates).eq('id', result.user.id).select().execute()
            
            if profile_result.data:
                print(f"✅ Profile updated successfully!")
                print(f"   Display Name: {profile_result.data[0]['display_name']}")
                print(f"   Level: {profile_result.data[0]['level']}")
                print(f"   Streak: {profile_result.data[0]['streak_days']} days")
                return result.user, profile_result.data[0]
            else:
                print("⚠️ User created but profile update failed")
                return result.user, None
        
        else:
            print("❌ Failed to create test user")
            return None, None
            
    except Exception as e:
        print(f"❌ Error creating test user: {e}")
        
        # Check if user already exists
        try:
            existing_users = supabase_client.admin_client.auth.admin.list_users()
            for user in existing_users:
                if user.email == 'teste@trendlyai.com':
                    print(f"✅ Test user already exists: {user.email} (ID: {user.id})")
                    
                    # Check profile
                    profile_result = supabase_client.admin_client.table('profiles').select('*').eq('id', user.id).execute()
                    if profile_result.data:
                        print(f"✅ Profile exists: {profile_result.data[0]['display_name']}")
                        return user, profile_result.data[0]
                    
                    return user, None
        except Exception as check_error:
            print(f"Error checking existing users: {check_error}")
        
        return None, None

async def main():
    """Main function"""
    print("=" * 60)
    print("🚀 CREATING REAL TEST USER")
    print("=" * 60)
    
    # Test connection first
    connection_ok = await supabase_client.test_connection()
    if not connection_ok:
        print("❌ Supabase connection failed.")
        return
    
    print("✅ Supabase connection successful!\n")
    
    # Create real test user
    user, profile = await create_real_test_user()
    
    print("\n" + "=" * 60)
    if user:
        print("🎉 TEST USER READY!")
        print(f"\n📧 Login Credentials:")
        print(f"   Email: teste@trendlyai.com")
        print(f"   Password: TesteSenha123!")
        print(f"\n👤 User Details:")
        print(f"   ID: {user.id}")
        print(f"   Email confirmed: {user.email_confirmed_at is not None}")
        
        if profile:
            print(f"\n📋 Profile Details:")
            print(f"   Name: {profile['display_name']}")
            print(f"   Level: {profile['level']}")
            print(f"   Streak: {profile['streak_days']} days")
            print(f"   Completed Modules: {profile['completed_modules']}")
            print(f"   Credits: {profile['credits']}/{profile['max_credits']}")
        
        print(f"\n🎯 You can now login and test the ProfilePage!")
        print(f"   Go to: http://localhost:3000/login")
    else:
        print("❌ Failed to create test user.")

if __name__ == "__main__":
    asyncio.run(main())