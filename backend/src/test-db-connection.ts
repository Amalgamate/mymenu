import prisma from './config/database';

/**
 * Test database connection
 * Run with: npx ts-node src/test-db-connection.ts
 */
async function testConnection() {
  try {
    console.log('🔍 Testing database connection...\n');

    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully!\n');

    // Test query - count tables
    const tables = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table'`;
    console.log('📊 Database tables:', tables);

    console.log('\n✅ Database is ready to use!');
    console.log('👉 You can now start the backend server: npm run dev\n');

  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Check your DATABASE_URL in .env file');
    console.log('2. Verify your Supabase project is active');
    console.log('3. Ensure your password is correct');
    console.log('4. Check your internet connection\n');
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

