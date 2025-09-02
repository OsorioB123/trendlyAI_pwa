#!/usr/bin/env python3
"""
Script para criar dados de teste no Supabase
"""

import asyncio
import sys
import os
from pathlib import Path
from dotenv import load_dotenv
import uuid

# Load environment variables
backend_path = Path(__file__).parent / 'backend'
env_path = backend_path / '.env'
load_dotenv(env_path)

# Add backend to path
sys.path.append(str(backend_path))

from supabase_client import supabase_client

async def create_test_user():
    """Create a test user profile"""
    print("🔄 Creating test user profile...")
    
    try:
        # Create a test user ID (this would normally be created by Supabase Auth)
        test_user_id = "12345678-1234-1234-1234-123456789012"
        
        # Check if profile already exists
        existing = supabase_client.admin_client.table('profiles').select('*').eq('id', test_user_id).execute()
        
        if existing.data:
            print(f"✅ Test user profile already exists: {existing.data[0]['display_name']}")
            return existing.data[0]
        
        # Create profile data
        profile_data = {
            'id': test_user_id,
            'email': 'teste@trendlyai.com',
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
                'signup_source': 'direct',
                'last_activity': '2025-01-02T10:00:00Z'
            }
        }
        
        # Insert profile
        result = supabase_client.admin_client.table('profiles').insert(profile_data).execute()
        
        if result.data:
            print(f"✅ Test user profile created successfully: {profile_data['display_name']}")
            return result.data[0]
        else:
            print("❌ Failed to create test user profile")
            return None
            
    except Exception as e:
        print(f"❌ Error creating test user: {e}")
        return None

async def create_test_tracks():
    """Create some test tracks"""
    print("🔄 Creating test tracks...")
    
    try:
        tracks_data = [
            {
                'title': 'IA Generativa Avançada',
                'description': 'Domine as técnicas mais avançadas de inteligência artificial generativa',
                'background_image': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
                'difficulty': 'advanced',
                'duration_minutes': 120,
                'is_published': True,
                'tags': ['IA', 'Generativa', 'Avançado'],
                'content': {
                    'modules': [
                        {'title': 'Introdução à IA Generativa', 'duration': 30},
                        {'title': 'Técnicas Avançadas', 'duration': 45},
                        {'title': 'Aplicações Práticas', 'duration': 45}
                    ]
                }
            },
            {
                'title': 'Design para Criadores',
                'description': 'Aprenda princípios de design visual para criadores de conteúdo',
                'background_image': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
                'difficulty': 'intermediate',
                'duration_minutes': 90,
                'is_published': True,
                'tags': ['Design', 'Criativo', 'Visual'],
                'content': {
                    'modules': [
                        {'title': 'Fundamentos do Design', 'duration': 30},
                        {'title': 'Composição Visual', 'duration': 30},
                        {'title': 'Prática com Ferramentas', 'duration': 30}
                    ]
                }
            },
            {
                'title': 'Marketing Digital',
                'description': 'Estratégias completas de marketing digital para 2025',
                'background_image': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
                'difficulty': 'beginner',
                'duration_minutes': 60,
                'is_published': True,
                'tags': ['Marketing', 'Digital', 'Estratégia'],
                'content': {
                    'modules': [
                        {'title': 'Fundamentos do Marketing Digital', 'duration': 20},
                        {'title': 'Redes Sociais', 'duration': 20},
                        {'title': 'Métricas e Análise', 'duration': 20}
                    ]
                }
            }
        ]
        
        # Check if tracks already exist
        existing_tracks = supabase_client.admin_client.table('tracks').select('title').execute()
        existing_titles = [track['title'] for track in existing_tracks.data] if existing_tracks.data else []
        
        tracks_to_insert = [track for track in tracks_data if track['title'] not in existing_titles]
        
        if not tracks_to_insert:
            print("✅ Test tracks already exist")
            return existing_tracks.data
        
        # Insert tracks
        result = supabase_client.admin_client.table('tracks').insert(tracks_to_insert).execute()
        
        if result.data:
            print(f"✅ Created {len(result.data)} test tracks")
            return result.data
        else:
            print("❌ Failed to create test tracks")
            return None
            
    except Exception as e:
        print(f"❌ Error creating test tracks: {e}")
        return None

async def create_test_tools():
    """Create some test tools"""
    print("🔄 Creating test tools...")
    
    try:
        tools_data = [
            {
                'name': 'Gerador de Roteiros',
                'description': 'Crie roteiros profissionais para seus vídeos usando IA',
                'category': 'Criação',
                'icon': 'FileText',
                'is_active': True,
                'is_premium': False,
                'configuration': {
                    'max_length': 2000,
                    'supported_formats': ['youtube', 'tiktok', 'instagram']
                }
            },
            {
                'name': 'Análise de Tendências',
                'description': 'Descubra as tendências mais quentes do momento',
                'category': 'Análise',
                'icon': 'TrendingUp',
                'is_active': True,
                'is_premium': True,
                'configuration': {
                    'data_sources': ['google_trends', 'social_media', 'news'],
                    'update_frequency': 'hourly'
                }
            },
            {
                'name': 'Editor de Thumbnails',
                'description': 'Crie thumbnails irresistíveis para seus vídeos',
                'category': 'Design',
                'icon': 'Image',
                'is_active': True,
                'is_premium': False,
                'configuration': {
                    'templates': 50,
                    'formats': ['youtube', 'instagram', 'twitter']
                }
            }
        ]
        
        # Check if tools already exist
        existing_tools = supabase_client.admin_client.table('tools').select('name').execute()
        existing_names = [tool['name'] for tool in existing_tools.data] if existing_tools.data else []
        
        tools_to_insert = [tool for tool in tools_data if tool['name'] not in existing_names]
        
        if not tools_to_insert:
            print("✅ Test tools already exist")
            return existing_tools.data
        
        # Insert tools
        result = supabase_client.admin_client.table('tools').insert(tools_to_insert).execute()
        
        if result.data:
            print(f"✅ Created {len(result.data)} test tools")
            return result.data
        else:
            print("❌ Failed to create test tools")
            return None
            
    except Exception as e:
        print(f"❌ Error creating test tools: {e}")
        return None

async def main():
    """Main function to create all test data"""
    print("=" * 60)
    print("🚀 CREATING SUPABASE TEST DATA")
    print("=" * 60)
    
    # Test connection first
    connection_ok = await supabase_client.test_connection()
    if not connection_ok:
        print("❌ Supabase connection failed. Cannot create test data.")
        return
    
    print("✅ Supabase connection successful!\n")
    
    # Create test data
    profile = await create_test_user()
    tracks = await create_test_tracks()
    tools = await create_test_tools()
    
    print("\n" + "=" * 60)
    if profile and tracks and tools:
        print("🎉 ALL TEST DATA CREATED SUCCESSFULLY!")
        print("\nTest User:")
        print(f"  - ID: {profile['id']}")
        print(f"  - Name: {profile['display_name']}")
        print(f"  - Email: {profile['email']}")
        print(f"  - Level: {profile['level']}")
        print(f"  - Streak: {profile['streak_days']} days")
        print(f"\nCreated {len(tracks) if tracks else 0} tracks and {len(tools) if tools else 0} tools")
        print("\n🎯 You can now test the ProfilePage with real data!")
    else:
        print("❌ Some test data creation failed. Check the logs above.")

if __name__ == "__main__":
    asyncio.run(main())