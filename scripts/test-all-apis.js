const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');

const BASE_URL = 'http://localhost:3000/api';
const JWT_SECRET = 'your-secret-key-change-in-production';

// Generate valid JWT token
const token = jwt.sign(
  {
    userId: 'test-user-123',
    email: 'test@Quikkred.com',
    userType: 'USER'
  },
  JWT_SECRET,
  { expiresIn: '24h' }
);

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};

// Test endpoints
const endpoints = [
  // Health & Basic
  { name: 'Health Check', method: 'GET', path: '/health', auth: false },

  // Authentication
  { name: 'Register', method: 'POST', path: '/auth/register', auth: false, body: {
    fullName: 'Test User',
    mobileNumber: '9876543210',
    email: 'test' + Date.now() + '@test.com',
    password: 'Test@123',
    confirmPassword: 'Test@123'
  }},
  { name: 'Login', method: 'POST', path: '/auth/login', auth: false, body: {
    emailOrMobile: 'test@Quikkred.com',
    password: 'Test@123'
  }},

  // Loan APIs
  { name: 'Calculate EMI', method: 'POST', path: '/loans/calculate-emi', auth: false, body: {
    loanAmount: 100000,
    interestRate: 12,
    tenure: 12
  }},
  { name: 'Loan Products', method: 'GET', path: '/loans/products', auth: false },
  { name: 'Check Eligibility', method: 'POST', path: '/loans/check-eligibility', auth: true, body: {
    loanAmount: 50000,
    loanType: 'PERSONAL',
    tenure: 12,
    monthlyIncome: 50000,
    employmentType: 'SALARIED'
  }},
  { name: 'Apply Loan', method: 'POST', path: '/loans/apply', auth: false, body: {
    fullName: 'Test User',
    mobileNumber: '9876543210',
    email: 'test@example.com',
    panCard: 'ABCDE1234F',
    aadhaarCard: '123456789012',
    loanAmount: 50000,
    loanType: 'PERSONAL',
    tenure: 12,
    purpose: 'Personal use',
    employmentType: 'SALARIED',
    monthlyIncome: 50000
  }},

  // AI Services
  { name: 'AI Credit Score', method: 'POST', path: '/ai/credit-score', auth: true, body: {
    loanAmount: 50000,
    tenure: 12,
    purpose: 'Personal',
    monthlyIncome: 50000
  }},

  // Fraud Detection
  { name: 'Fraud Check', method: 'POST', path: '/fraud/check', auth: false, body: {
    transactionType: 'LOAN_APPLICATION',
    amount: 50000,
    deviceFingerprint: 'FP_' + Date.now(),
    screenResolution: '1920x1080',
    timezone: 'Asia/Kolkata'
  }},

  // User APIs
  { name: 'User Profile', method: 'GET', path: '/users/profile', auth: true },
  { name: 'Credit Score', method: 'GET', path: '/users/credit-score', auth: true },

  // Admin APIs
  { name: 'Admin Dashboard', method: 'GET', path: '/admin/dashboard', auth: true },

  // Notifications
  { name: 'Notifications', method: 'GET', path: '/notifications', auth: true }
];

// Test function
async function testEndpoint(endpoint) {
  try {
    const options = {
      method: endpoint.method,
      headers: endpoint.auth ? headers : { 'Content-Type': 'application/json' }
    };

    if (endpoint.body) {
      options.body = JSON.stringify(endpoint.body);
    }

    const response = await fetch(BASE_URL + endpoint.path, options);
    const data = await response.json();

    return {
      name: endpoint.name,
      path: endpoint.path,
      status: response.status,
      success: response.status >= 200 && response.status < 300,
      message: data.error || data.message || 'Success'
    };
  } catch (error) {
    return {
      name: endpoint.name,
      path: endpoint.path,
      status: 0,
      success: false,
      message: error.message
    };
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Testing All API Endpoints\n');
  console.log('Token:', token.substring(0, 50) + '...\n');

  const results = [];

  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    results.push(result);

    const emoji = result.success ? '✅' : '❌';
    const status = result.success ? `[${result.status}]` : `[${result.status}]`;

    console.log(`${emoji} ${result.name.padEnd(20)} ${status.padEnd(6)} ${result.path}`);
    if (!result.success) {
      console.log(`   Error: ${result.message}\n`);
    }
  }

  // Summary
  console.log('\n📊 Summary');
  console.log('─────────');
  const working = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const percentage = Math.round((working / results.length) * 100);

  console.log(`✅ Working: ${working}/${results.length} (${percentage}%)`);
  console.log(`❌ Failed: ${failed}/${results.length}`);

  // List working endpoints
  console.log('\n✅ Working Endpoints:');
  results.filter(r => r.success).forEach(r => {
    console.log(`   - ${r.path}`);
  });

  // List failed endpoints
  if (failed > 0) {
    console.log('\n❌ Failed Endpoints:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.path}: ${r.message}`);
    });
  }
}

// Run the tests
runTests().catch(console.error);