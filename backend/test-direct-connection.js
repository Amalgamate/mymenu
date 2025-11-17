const { Client } = require('pg');
require('dotenv').config();

async function testDirectConnection() {
  // Extract the DIRECT_URL from env
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  
  console.log('🔍 Testing direct PostgreSQL connection...\n');
  console.log('Connection string format check:');
  console.log('- Host:', connectionString.match(/@([^:]+)/)?.[1] || 'Not found');
  console.log('- Port:', connectionString.match(/:(\d+)\//)?.[1] || 'Not found');
  console.log('');

  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Attempting to connect...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    const result = await client.query('SELECT version()');
    console.log('📊 PostgreSQL version:');
    console.log(result.rows[0].version);
    console.log('\n✅ Database is working!');

  } catch (error) {
    console.error('❌ Connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Check if Supabase project is active (not paused)');
    console.log('2. Verify your password is correct');
    console.log('3. Check your internet connection');
    console.log('4. Try restoring the project in Supabase dashboard');
  } finally {
    await client.end();
  }
}

testDirectConnection();
