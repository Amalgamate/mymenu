import prisma from './config/database';
import bcrypt from 'bcrypt';

async function seed() {
  console.log('🌱 Seeding database...\n');

  try {
    // Create demo tenant
    const tenant = await prisma.tenant.create({
      data: {
        slug: 'demo-restaurant',
        businessName: 'Demo Restaurant',
        businessType: 'RESTAURANT',
        email: 'demo@restaurant.com',
        whatsappNumber: '+1234567890',
        primaryColor: '#2563eb',
        status: 'ACTIVE',
      },
    });

    console.log('✅ Created tenant:', tenant.businessName);

    // Create admin user
    const passwordHash = await bcrypt.hash('Admin123!', 10);
    const adminUser = await prisma.user.create({
      data: {
        tenantId: tenant.id,
        email: 'admin@restaurant.com',
        passwordHash,
        role: 'TENANT_ADMIN',
        firstName: 'Admin',
        lastName: 'User',
        isActive: true,
      },
    });

    console.log('✅ Created admin user:', adminUser.email);
    console.log('\n📝 Login Credentials:');
    console.log('   Email: admin@restaurant.com');
    console.log('   Password: Admin123!');
    console.log('   Slug: demo-restaurant\n');

    // Create sample categories
    const appetizers = await prisma.category.create({
      data: {
        tenantId: tenant.id,
        name: 'Appetizers',
        description: 'Start your meal right',
        sortOrder: 1,
        isActive: true,
      },
    });

    const mainCourse = await prisma.category.create({
      data: {
        tenantId: tenant.id,
        name: 'Main Course',
        description: 'Our signature dishes',
        sortOrder: 2,
        isActive: true,
      },
    });

    const beverages = await prisma.category.create({
      data: {
        tenantId: tenant.id,
        name: 'Beverages',
        description: 'Refreshing drinks',
        sortOrder: 3,
        isActive: true,
      },
    });

    console.log('✅ Created 3 categories\n');

    // Create sample menu items
    await prisma.menuItem.createMany({
      data: [
        {
          tenantId: tenant.id,
          categoryId: appetizers.id,
          name: 'Bruschetta',
          description: 'Toasted bread with tomatoes and basil',
          price: 8.99,
          isAvailable: true,
          sortOrder: 1,
        },
        {
          tenantId: tenant.id,
          categoryId: appetizers.id,
          name: 'Caesar Salad',
          description: 'Classic caesar with parmesan and croutons',
          price: 12.99,
          isAvailable: true,
          sortOrder: 2,
        },
        {
          tenantId: tenant.id,
          categoryId: mainCourse.id,
          name: 'Grilled Salmon',
          description: 'Fresh salmon with lemon butter sauce',
          price: 24.99,
          isAvailable: true,
          sortOrder: 1,
        },
        {
          tenantId: tenant.id,
          categoryId: mainCourse.id,
          name: 'Ribeye Steak',
          description: '12oz prime ribeye cooked to perfection',
          price: 32.99,
          isAvailable: true,
          sortOrder: 2,
        },
        {
          tenantId: tenant.id,
          categoryId: beverages.id,
          name: 'Fresh Lemonade',
          description: 'Homemade lemonade with mint',
          price: 4.99,
          isAvailable: true,
          sortOrder: 1,
        },
      ],
    });

    console.log('✅ Created 5 menu items\n');
    console.log('🎉 Seeding completed successfully!');
    console.log('\n👉 You can now:');
    console.log('   1. Start the backend: npm run dev');
    console.log('   2. Login at: http://localhost:5173/login');
    console.log('   3. View customer menu at: http://localhost:5173/demo-restaurant\n');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
