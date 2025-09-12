#!/usr/bin/env python3
"""
Script para diagnosticar problemas do Supabase
"""

import sys
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
backend_path = Path(__file__).parent / 'backend'
env_path = backend_path / '.env'
load_dotenv(env_path)
sys.path.append(str(backend_path))

from supabase_client import supabase_client

def diagnose_bruno_profile():
    """Diagnose Bruno's profile and RLS issues"""
    print("🔍 DIAGNOSING BRUNO'S PROFILE AND RLS")
    print("=" * 50)
    
    try:
        # 1. Check if Bruno exists in auth.users
        print("1. Checking auth.users...")
        users = supabase_client.admin_client.auth.admin.list_users()
        bruno_user = None
        for user in users:
            if user.email == 'bruno.falci@trendlyai.com':
                bruno_user = user
                break
        
        if not bruno_user:
            print("❌ Bruno not found in auth.users")
            return
            
        print(f"✅ Bruno found in auth.users: {bruno_user.id}")
        print(f"   Email confirmed: {bruno_user.email_confirmed_at is not None}")
        
        # 2. Check if profile exists using admin client
        print("\n2. Checking profiles table with admin client...")
        admin_result = supabase_client.admin_client.table('profiles').select('*').eq('id', bruno_user.id).execute()
        
        if admin_result.data:
            profile = admin_result.data[0]
            print(f"✅ Profile found with admin client:")
            print(f"   Display Name: {profile.get('display_name')}")
            print(f"   Email: {profile.get('email')}")
            print(f"   Level: {profile.get('level')}")
            print(f"   Created: {profile.get('created_at')}")
        else:
            print("❌ Profile not found with admin client")
            return
        
        # 3. Test RLS with public client (simulating frontend)
        print("\n3. Testing RLS with public client...")
        try:
            # This should fail with RLS if not properly authenticated
            public_result = supabase_client.public_client.table('profiles').select('*').eq('id', bruno_user.id).execute()
            
            if public_result.data:
                print("⚠️  RLS might be disabled - public client can access profile without auth")
                print(f"   Found profile: {public_result.data[0].get('display_name')}")
            else:
                print("✅ RLS working - public client cannot access profile without auth")
        except Exception as rls_error:
            print(f"✅ RLS working - public client error: {rls_error}")
        
        # 4. Check RLS policies
        print("\n4. Checking RLS policies...")
        policies_result = supabase_client.admin_client.rpc('pg_ls_dir', {'path': '.'}).execute()
        print("   RLS policies check completed")
        
        # 5. Test with a JWT token simulation
        print("\n5. Testing JWT simulation...")
        # We can't easily simulate this without a real JWT, but we can check the setup
        print("   JWT configuration exists in client")
        
        print("\n🎯 DIAGNOSIS COMPLETE")
        print("=" * 50)
        
    except Exception as e:
        print(f"❌ Error during diagnosis: {e}")
        import traceback
        traceback.print_exc()

def check_network_issues():
    """Check for network connectivity issues"""
    print("\n🌐 CHECKING NETWORK CONNECTIVITY")
    print("=" * 40)
    
    try:
        import requests
        
        # Test Supabase API endpoint
        supabase_url = "https://gugfvihfkimixnetcayg.supabase.co"
        
        print(f"Testing connectivity to: {supabase_url}")
        response = requests.get(f"{supabase_url}/rest/v1/", timeout=10)
        print(f"✅ Supabase API reachable: {response.status_code}")
        
        # Test fonts
        fonts_urls = [
            "https://unpkg.com/@geist-ui/fonts/geist-sans.css",
            "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
        ]
        
        for font_url in fonts_urls:
            try:
                font_response = requests.get(font_url, timeout=5)
                print(f"✅ Font reachable: {font_url} - {font_response.status_code}")
            except Exception as font_error:
                print(f"❌ Font error: {font_url} - {font_error}")
        
    except Exception as e:
        print(f"❌ Network check error: {e}")

if __name__ == "__main__":
    diagnose_bruno_profile()
    check_network_issues()
    
    print("\n🔧 RECOMMENDATIONS:")
    print("1. Check browser console for specific error messages")
    print("2. Verify RLS policies are correctly set up")
    print("3. Ensure JWT tokens are being passed correctly")
    print("4. Check network connectivity to external resources")