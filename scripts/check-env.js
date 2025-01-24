require('dotenv').config();

console.log('Environment Variables Check:');
console.log('GOOGLE_SHEETS_ID:', process.env.GOOGLE_SHEETS_ID ? '✓ Present' : '✗ Missing');
console.log('GOOGLE_SERVICE_ACCOUNT_EMAIL:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? '✓ Present' : '✗ Missing');
console.log('GOOGLE_PRIVATE_KEY:', process.env.GOOGLE_PRIVATE_KEY ? '✓ Present' : '✗ Missing');
