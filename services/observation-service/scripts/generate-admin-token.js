#!/usr/bin/env node

// Quick script to generate an ADMIN JWT for testing with Swagger
// Usage:
//   JWT_SECRET=your-secret node scripts/generate-admin-token.js [userId] [role] [reputation]
// Example:
//   JWT_SECRET=dev-secret node scripts/generate-admin-token.js 1 ADMIN 50

/* const { jwt } = require('@deepsea/common');

const userId = parseInt(process.argv[2] || '1', 10);
const role = process.argv[3] || 'ADMIN';
const reputation = parseInt(process.argv[4] || '100', 10);

if (!process.env.JWT_SECRET) {
  console.error('ERROR: JWT_SECRET env var is required to generate a token');
  process.exit(1);
}

const payload = { id: userId, role, reputation };
const token = jwt.signPayload(payload, { expiresIn: '24h' });

console.log('\n🔑 Admin JWT Token Generated:\n');
console.log(token);
console.log('\n📋 Token Details:');
console.log(`   User ID: ${userId}`);
console.log(`   Role: ${role}`);
console.log(`   Reputation: ${reputation}`);
console.log('\n💡 Swagger UI:');
console.log(`   Click "Authorize" → paste: Bearer ${token}`);
console.log('\n'); */
