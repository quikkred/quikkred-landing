const jwt = require('jsonwebtoken');

// Get user ID from command line or use default
const userId = process.argv[2] || 'test-user-123';
const email = process.argv[3] || 'test@Quikkred.com';
const userType = process.argv[4] || 'USER';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const token = jwt.sign(
  {
    userId,
    email,
    userType
  },
  JWT_SECRET,
  { expiresIn: '24h' }
);

console.log('\nGenerated JWT Token:');
console.log(token);
console.log('\nPayload:');
console.log({
  userId,
  email,
  userType
});
console.log('\nUse with Authorization header:');
console.log(`Authorization: Bearer ${token}`);