require('dotenv').config();
const { JWT } = require('google-auth-library');

async function testAuth() {
  try {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      .replace(/\\n/g, '\n')
      .replace(/^"/, '')
      .replace(/"$/, '');

    console.log('Service account email:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
    console.log('Private key length:', privateKey.length);
    console.log('Private key starts with:', privateKey.substring(0, 50));
    console.log('Private key ends with:', privateKey.substring(privateKey.length - 50));

    const auth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    console.log('Getting access token...');
    const token = await auth.getAccessToken();
    console.log('Successfully obtained access token:', token.token.substring(0, 10) + '...');
  } catch (error) {
    console.error('Error:', error);
  }
}

testAuth();
