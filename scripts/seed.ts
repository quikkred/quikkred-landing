import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data (optional - comment out if you want to keep existing data)
  console.log('🧹 Cleaning existing data...');
  await prisma.transaction.deleteMany();
  await prisma.repayment.deleteMany();
  await prisma.loan.deleteMany();
  await prisma.document.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.kYC.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log('👤 Creating test users...');

  // 1. Regular User
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      email: 'user@test.com',
      mobile: '9876543210',
      password: await bcrypt.hash('Test@123', 10),
      emailVerified: new Date(),
      mobileVerified: new Date(),
      role: 'USER',
      status: 'ACTIVE',
      preferredLanguage: 'en',
      profile: {
        create: {
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: new Date('1990-01-15'),
          gender: 'MALE',
          maritalStatus: 'SINGLE',
          dependents: 0,
          education: 'BACHELORS',
          profession: 'Software Engineer',
          monthlyIncome: 50000,
          addressLine1: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          permanentAddressSame: true,
          emergencyContactName: 'Jane Doe',
          emergencyContactPhone: '9876543211',
          emergencyContactRelation: 'Sister'
        }
      },
      kyc: {
        create: {
          aadharNumber: '123456789012',
          aadharVerified: true,
          aadharVerifiedAt: new Date(),
          panNumber: 'ABCDE1234F',
          panVerified: true,
          panVerifiedAt: new Date(),
          kycStatus: 'VERIFIED',
          kycLevel: 3,
          videoKYCCompleted: true,
          videoKYCCompletedAt: new Date(),
          livenessCheckPassed: true,
          faceMatchScore: 0.95,
          digilockerConnected: true
        }
      }
    }
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      mobile: '9876543211',
      password: await bcrypt.hash('Admin@123', 10),
      emailVerified: new Date(),
      mobileVerified: new Date(),
      role: 'ADMIN',
      status: 'ACTIVE',
      profile: {
        create: {
          firstName: 'Admin',
          lastName: 'User',
          dateOfBirth: new Date('1985-01-01'),
          gender: 'MALE',
          maritalStatus: 'SINGLE',
          education: 'MASTERS',
          profession: 'Manager',
          monthlyIncome: 100000,
          addressLine1: '456 Admin Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400002',
          emergencyContactName: 'Admin Emergency',
          emergencyContactPhone: '9876543212',
          emergencyContactRelation: 'Spouse'
        }
      }
    }
  });

  // 3. Underwriter User
  const underwriterUser = await prisma.user.upsert({
    where: { email: 'underwriter@test.com' },
    update: {},
    create: {
      email: 'underwriter@test.com',
      mobile: '9876543230',
      password: await bcrypt.hash('Under@123', 10),
      emailVerified: new Date(),
      mobileVerified: new Date(),
      role: 'UNDERWRITER',
      status: 'ACTIVE',
      preferredLanguage: 'en',
      profile: {
        create: {
          firstName: 'Sarah',
          lastName: 'Underwriter',
          dateOfBirth: new Date('1988-03-10'),
          gender: 'FEMALE',
          maritalStatus: 'MARRIED',
          dependents: 1,
          education: 'MASTERS',
          profession: 'Credit Analyst',
          monthlyIncome: 80000,
          addressLine1: '789 Finance Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400003',
          permanentAddressSame: true,
          emergencyContactName: 'Emergency Contact',
          emergencyContactPhone: '9876543231',
          emergencyContactRelation: 'Spouse'
        }
      }
    }
  });

  // 4. Collection Agent
  const collectionAgent = await prisma.user.upsert({
    where: { email: 'collection@test.com' },
    update: {},
    create: {
      email: 'collection@test.com',
      mobile: '9876543240',
      password: await bcrypt.hash('Collect@123', 10),
      emailVerified: new Date(),
      mobileVerified: new Date(),
      role: 'COLLECTION_AGENT',
      status: 'ACTIVE',
      preferredLanguage: 'en',
      profile: {
        create: {
          firstName: 'Mike',
          lastName: 'Collector',
          dateOfBirth: new Date('1992-07-25'),
          gender: 'MALE',
          maritalStatus: 'SINGLE',
          dependents: 0,
          education: 'BACHELORS',
          profession: 'Collection Executive',
          monthlyIncome: 40000,
          addressLine1: '321 Collection Avenue',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400004',
          permanentAddressSame: true,
          emergencyContactName: 'Emergency Contact',
          emergencyContactPhone: '9876543241',
          emergencyContactRelation: 'Friend'
        }
      }
    }
  });

  // 5. Support Agent
  const supportAgent = await prisma.user.upsert({
    where: { email: 'support@test.com' },
    update: {},
    create: {
      email: 'support@test.com',
      mobile: '9876543270',
      password: await bcrypt.hash('Support@123', 10),
      emailVerified: new Date(),
      mobileVerified: new Date(),
      role: 'SUPPORT_AGENT',
      status: 'ACTIVE',
      preferredLanguage: 'en',
      profile: {
        create: {
          firstName: 'Lisa',
          lastName: 'Support',
          dateOfBirth: new Date('1993-12-05'),
          gender: 'FEMALE',
          maritalStatus: 'MARRIED',
          dependents: 1,
          education: 'BACHELORS',
          profession: 'Customer Support Executive',
          monthlyIncome: 35000,
          addressLine1: '234 Support Center',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400007',
          permanentAddressSame: true,
          emergencyContactName: 'Emergency Contact',
          emergencyContactPhone: '9876543271',
          emergencyContactRelation: 'Spouse'
        }
      }
    }
  });

  // Create a sample loan
  const loan = await prisma.loan.create({
    data: {
      userId: regularUser.id,
      loanNumber: `LXM${Date.now()}`,
      loanType: 'PERSONAL',
      requestedAmount: 100000,
      approvedAmount: 100000,
      disbursedAmount: 100000,
      outstandingAmount: 100000,
      interestRate: 12.0,
      processingFee: 2000,
      gstOnFees: 360,
      tenure: 730, // 2 years in days
      purposeOfLoan: 'Medical emergency',
      status: 'DISBURSED',
      applicationDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      approvalDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      disbursementDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      creditScoreAtApproval: 750,
      riskScoreAtApproval: 0.15,
      autoApproved: false
    }
  });

  // Create notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: regularUser.id,
        title: 'Welcome to Quikkred',
        message: 'Your account has been created successfully',
        type: 'SYSTEM',
        channel: 'IN_APP',
        status: 'DELIVERED',
        deliveredAt: new Date(),
        readAt: new Date()
      },
      {
        userId: regularUser.id,
        title: 'Loan Application Approved',
        message: 'Your personal loan application has been approved',
        type: 'LOAN_APPROVED',
        channel: 'IN_APP',
        status: 'DELIVERED',
        deliveredAt: new Date()
      }
    ]
  });

  console.log('✅ Database seeded successfully!');
  console.log('');
  console.log('📧 Test User Credentials:');
  console.log('=========================');
  console.log('');
  console.log('1. Regular User:');
  console.log('   Email: user@test.com');
  console.log('   Password: Test@123');
  console.log('');
  console.log('2. Admin User:');
  console.log('   Email: admin@test.com');
  console.log('   Password: Admin@123');
  console.log('');
  console.log('3. Underwriter:');
  console.log('   Email: underwriter@test.com');
  console.log('   Password: Under@123');
  console.log('');
  console.log('4. Collection Agent:');
  console.log('   Email: collection@test.com');
  console.log('   Password: Collect@123');
  console.log('');
  console.log('5. Support Agent:');
  console.log('   Email: support@test.com');
  console.log('   Password: Support@123');
  console.log('');
  console.log('=========================');
  console.log('🚀 You can now login at: http://localhost:3001/login');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });