#!/usr/bin/env node
/**
 * Test script to verify Supabase authentication flow
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './frontend/.env' });

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('🔧 Environment check:');
console.log(`   URL: ${supabaseUrl}`);
console.log(`   Key: ${supabaseAnonKey?.slice(0, 20)}...`);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuthFlow() {
  console.log('\n🔄 Testing Supabase authentication flow...');
  
  try {
    // Test sign in
    console.log('📧 Attempting sign in...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'bruno.falci@trendlyai.com',
      password: 'SenhaSegura123!'
    });
    
    if (authError) {
      console.error('❌ Auth error:', authError.message);
      return;
    }
    
    if (authData.user) {
      console.log('✅ Authentication successful!');
      console.log(`   User ID: ${authData.user.id}`);
      console.log(`   Email: ${authData.user.email}`);
      console.log(`   Email confirmed: ${authData.user.email_confirmed_at ? 'Yes' : 'No'}`);
      
      // Test profile loading
      console.log('\n👤 Testing profile loading...');
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();
      
      if (profileError) {
        console.error('❌ Profile error:', profileError.message);
        console.error('   Code:', profileError.code);
        console.error('   Details:', profileError.details);
        console.error('   Hint:', profileError.hint);
      } else {
        console.log('✅ Profile loaded successfully!');
        console.log(`   Name: ${profileData.display_name}`);
        console.log(`   Level: ${profileData.level}`);
        console.log(`   Credits: ${profileData.credits}`);
      }
      
      // Test sign out
      console.log('\n🚪 Testing sign out...');
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) {
        console.error('❌ Sign out error:', signOutError.message);
      } else {
        console.log('✅ Sign out successful!');
      }
      
    } else {
      console.error('❌ No user data received');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testAuthFlow();