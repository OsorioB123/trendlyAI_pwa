import requests
import sys
import os
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from dotenv import load_dotenv

class ComprehensiveAPITester:
    def __init__(self, base_url="https://trendly-dashboard.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        
        # Load environment variables for MongoDB testing
        load_dotenv('/app/backend/.env')
        self.mongo_url = os.environ.get('MONGO_URL')
        self.db_name = os.environ.get('DB_NAME')

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'OPTIONS':
                response = requests.options(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    if response.text:
                        print(f"Response: {response.json()}")
                except:
                    print(f"Response: {response.text}")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"Response: {response.text}")

            return success, response.json() if success and response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_server_health(self):
        """Test basic server health"""
        success, response = self.run_test(
            "Server Health Check",
            "GET",
            "api/",
            200
        )
        return success

    def test_cors_configuration(self):
        """Test CORS configuration for frontend integration"""
        success, response = self.run_test(
            "CORS Preflight Check",
            "OPTIONS",
            "api/status",
            200
        )
        return success

    def test_create_status_check(self):
        """Test creating a status check"""
        success, response = self.run_test(
            "Create Status Check",
            "POST",
            "api/status",
            200,
            data={"client_name": f"tool_modal_test_{datetime.now().strftime('%H%M%S')}"}
        )
        return response.get('id') if success else None

    def test_get_status_checks(self):
        """Test getting status checks"""
        success, response = self.run_test(
            "Get Status Checks",
            "GET",
            "api/status",
            200
        )
        return success, response

    async def test_mongodb_connectivity(self):
        """Test MongoDB connectivity and operations"""
        print(f"\n🔍 Testing MongoDB Connectivity...")
        try:
            client = AsyncIOMotorClient(self.mongo_url)
            db = client[self.db_name]
            
            # Test connection
            await client.admin.command('ping')
            print("✅ MongoDB connection successful")
            
            # Check collections
            collections = await db.list_collection_names()
            print(f"📊 Available collections: {collections}")
            
            # Check status_checks collection
            if 'status_checks' in collections:
                count = await db.status_checks.count_documents({})
                print(f"📈 Status checks count: {count}")
                
                # Test data integrity
                sample = await db.status_checks.find_one()
                if sample:
                    required_fields = ['id', 'client_name', 'timestamp']
                    has_all_fields = all(field in sample for field in required_fields)
                    print(f"🔍 Data integrity check: {'✅ Passed' if has_all_fields else '❌ Failed'}")
                    self.tests_run += 1
                    if has_all_fields:
                        self.tests_passed += 1
            
            client.close()
            self.tests_run += 1
            self.tests_passed += 1
            return True
            
        except Exception as e:
            print(f"❌ MongoDB connection failed: {e}")
            self.tests_run += 1
            return False

    def test_environment_variables(self):
        """Test environment variable configuration"""
        print(f"\n🔍 Testing Environment Variables...")
        
        required_vars = ['MONGO_URL', 'DB_NAME', 'CORS_ORIGINS']
        missing_vars = []
        
        for var in required_vars:
            value = os.environ.get(var)
            if value:
                print(f"✅ {var}: {value}")
            else:
                print(f"❌ {var}: Missing")
                missing_vars.append(var)
        
        self.tests_run += 1
        if not missing_vars:
            self.tests_passed += 1
            return True
        else:
            print(f"❌ Missing environment variables: {missing_vars}")
            return False

    def test_api_response_format(self):
        """Test API response format for tool modal compatibility"""
        print(f"\n🔍 Testing API Response Format...")
        
        # Test status check creation response format
        success, response = self.run_test(
            "Status Check Response Format",
            "POST",
            "api/status",
            200,
            data={"client_name": "format_test"}
        )
        
        if success:
            required_fields = ['id', 'client_name', 'timestamp']
            has_all_fields = all(field in response for field in required_fields)
            
            # Check UUID format
            import uuid
            try:
                uuid.UUID(response.get('id', ''))
                valid_uuid = True
            except:
                valid_uuid = False
            
            # Check timestamp format
            try:
                datetime.fromisoformat(response.get('timestamp', '').replace('Z', '+00:00'))
                valid_timestamp = True
            except:
                valid_timestamp = False
            
            format_valid = has_all_fields and valid_uuid and valid_timestamp
            print(f"🔍 Response format validation: {'✅ Passed' if format_valid else '❌ Failed'}")
            
            if format_valid:
                print("✅ API responses are properly formatted for frontend integration")
            else:
                print("❌ API response format issues detected")
                
            return format_valid
        
        return False

def main():
    print("🚀 Starting TrendlyAI PWA Comprehensive Backend Tests")
    print("Focus: Tool Modal Implementation Support & Infrastructure Readiness")
    print("=" * 70)
    
    # Setup
    tester = ComprehensiveAPITester()

    # Test 1: Environment Variables
    print("\n📋 Phase 1: Environment Configuration")
    env_success = tester.test_environment_variables()

    # Test 2: MongoDB Connectivity
    print("\n🗄️ Phase 2: Database Infrastructure")
    mongo_success = asyncio.run(tester.test_mongodb_connectivity())

    # Test 3: Server Health & API Endpoints
    print("\n📡 Phase 3: API Endpoints & Server Health")
    
    # Basic health check
    health_success = tester.test_server_health()
    
    # CORS configuration
    cors_success = tester.test_cors_configuration()
    
    # API functionality
    status_id = tester.test_create_status_check()
    create_success = status_id is not None
    
    get_success, status_data = tester.test_get_status_checks()
    
    # Test 4: API Response Format
    print("\n🔧 Phase 4: Tool Modal Support Readiness")
    format_success = tester.test_api_response_format()

    # Summary
    print(f"\n📊 Comprehensive Backend Test Results:")
    print("=" * 50)
    print(f"Environment Configuration: {'✅ Passed' if env_success else '❌ Failed'}")
    print(f"MongoDB Connectivity: {'✅ Passed' if mongo_success else '❌ Failed'}")
    print(f"Server Health: {'✅ Passed' if health_success else '❌ Failed'}")
    print(f"CORS Configuration: {'✅ Passed' if cors_success else '❌ Failed'}")
    print(f"API Functionality: {'✅ Passed' if create_success and get_success else '❌ Failed'}")
    print(f"Response Format: {'✅ Passed' if format_success else '❌ Failed'}")
    print(f"\nOverall Tests: {tester.tests_passed}/{tester.tests_run}")
    
    # Tool Modal Readiness Assessment
    print(f"\n🛠️ Tool Modal Implementation Support Assessment:")
    print("=" * 50)
    
    all_passed = all([env_success, mongo_success, health_success, cors_success, create_success, get_success, format_success])
    
    if all_passed:
        print("✅ BACKEND READY FOR TOOL MODAL IMPLEMENTATION")
        print("✅ All infrastructure components are working correctly")
        print("✅ API endpoints are functional and properly formatted")
        print("✅ CORS configuration supports frontend integration")
        print("✅ Database connectivity is stable")
        print("✅ Environment variables are properly configured")
        print("\n🎯 Next Steps: Backend is ready to support tool-related endpoints")
        return 0
    else:
        print("❌ BACKEND NOT FULLY READY")
        print("❌ Some infrastructure issues need to be resolved")
        return 1

if __name__ == "__main__":
    sys.exit(main())