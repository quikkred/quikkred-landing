import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Count users
    const userCount = await prisma.user.count();
    console.log(`✅ User count: ${userCount}`);

    // List all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        mobile: true,
        status: true
      }
    });
    console.log('✅ Users in database:', users);

  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();