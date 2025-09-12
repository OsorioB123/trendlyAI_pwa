#!/usr/bin/env python3
"""
Script para criar um usuário já confirmado para testes
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

async def create_confirmed_user():
    """Create a confirmed test user"""
    print("🔄 Creating confirmed test user...")
    
    try:
        # Create user with confirmed email
        user_data = {
            'email': 'bruno.falci@trendlyai.com',
            'password': 'SenhaSegura123!',
            'email_confirm': True,  # Auto-confirm email
            'user_metadata': {
                'display_name': 'Bruno Falci'
            }
        }
        
        # First, check if user already exists
        try:
            users = supabase_client.admin_client.auth.admin.list_users()
            for existing_user in users:
                if existing_user.email == user_data['email']:
                    print(f"✅ User already exists: {existing_user.email}")
                    
                    # Update profile with better data
                    profile_updates = {
                        'display_name': 'Bruno Falci',
                        'bio': 'Criador de conteúdo e entusiasta de tecnologia. Explorando as possibilidades da IA para revolucionar a criação digital.',
                        'level': 'Criador',
                        'streak_days': 15,
                        'total_tracks': 6,
                        'completed_modules': 18,
                        'credits': 42,
                        'max_credits': 50,
                        'avatar_url': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
                        'preferences': {
                            'background': 'cosmic-nebula',
                            'notifications': {
                                'email': True,
                                'push': True,
                                'updates': True,
                                'security': True,
                                'marketing': False
                            }
                        },
                        'metadata': {
                            'signup_source': 'test',
                            'last_activity': '2025-01-02T15:30:00Z',
                            'favorite_tools': ['script-generator', 'trend-analyzer']
                        }
                    }
                    
                    profile_result = supabase_client.admin_client.table('profiles').update(profile_updates).eq('id', existing_user.id).select().execute()
                    
                    if profile_result.data:
                        print(f"✅ Profile updated: {profile_result.data[0]['display_name']}")
                    
                    return existing_user, profile_result.data[0] if profile_result.data else None
                    
        except Exception as e:
            print(f"Note: Error checking existing users: {e}")
        
        # Create new user
        print("Creating new user...")
        result = supabase_client.admin_client.auth.admin.create_user(user_data)
        
        if result.user:
            print(f"✅ User created: {result.user.email} (ID: {result.user.id})")
            print(f"   Email confirmed: {result.user.email_confirmed_at is not None}")
            
            # Wait for profile trigger to execute
            await asyncio.sleep(3)
            
            # Update profile with rich data
            profile_updates = {
                'display_name': 'Bruno Falci',
                'bio': 'Criador de conteúdo e entusiasta de tecnologia. Explorando as possibilidades da IA para revolucionar a criação digital.',
                'level': 'Criador',
                'streak_days': 15,
                'total_tracks': 6,
                'completed_modules': 18,
                'credits': 42,
                'max_credits': 50,
                'avatar_url': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
                'preferences': {
                    'background': 'cosmic-nebula',
                    'notifications': {
                        'email': True,
                        'push': True,
                        'updates': True,
                        'security': True,
                        'marketing': False
                    }
                },
                'metadata': {
                    'signup_source': 'test',
                    'last_activity': '2025-01-02T15:30:00Z',
                    'favorite_tools': ['script-generator', 'trend-analyzer']
                }
            }
            
            profile_result = supabase_client.admin_client.table('profiles').update(profile_updates).eq('id', result.user.id).select().execute()
            
            if profile_result.data:
                print(f"✅ Profile updated: {profile_result.data[0]['display_name']}")
                return result.user, profile_result.data[0]
            else:
                print("⚠️ User created but profile update failed")
                return result.user, None
        
        else:
            print("❌ Failed to create user")
            return None, None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None, None

async def main():
    """Main function"""
    print("=" * 60)
    print("🚀 CREATING CONFIRMED TEST USER")
    print("=" * 60)
    
    # Test connection
    connection_ok = await supabase_client.test_connection()
    if not connection_ok:
        print("❌ Supabase connection failed.")
        return
    
    print("✅ Supabase connection successful!\n")
    
    # Create confirmed user
    user, profile = await create_confirmed_user()
    
    print("\n" + "=" * 60)
    if user and profile:
        print("🎉 CONFIRMED TEST USER READY!")
        print(f"\n📧 Login Credentials:")
        print(f"   Email: bruno.falci@trendlyai.com")
        print(f"   Password: SenhaSegura123!")
        print(f"\n👤 User Details:")
        print(f"   ID: {user.id}")
        print(f"   Email confirmed: {user.email_confirmed_at is not None}")
        print(f"\n📋 Profile Details:")
        print(f"   Name: {profile['display_name']}")
        print(f"   Level: {profile['level']}")
        print(f"   Streak: {profile['streak_days']} days")
        print(f"   Completed Modules: {profile['completed_modules']}")
        print(f"   Credits: {profile['credits']}/{profile['max_credits']}")
        print(f"\n🎯 Ready to test Settings and Profile pages!")
        print(f"   Login at: http://localhost:3000/login")
    else:
        print("❌ Failed to create confirmed user.")

if __name__ == "__main__":
    asyncio.run(main())