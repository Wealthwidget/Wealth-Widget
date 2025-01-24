require('dotenv').config();
const { GoogleSpreadsheet } = require('google-spreadsheet');
const fs = require('fs');
const path = require('path');

async function testSheets() {
  try {
    // Read credentials
    const credentialsPath = path.join(process.cwd(), 'wealth-valuation-widget-f562711c2859.json');
    console.log('Reading credentials from:', credentialsPath);
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

    console.log('Service account email:', credentials.client_email);
    console.log('Spreadsheet ID:', process.env.GOOGLE_SHEETS_ID);

    // Create and auth
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_ID);
    await doc.useServiceAccountAuth({
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    });

    // Load doc info
    await doc.loadInfo();
    console.log('Success! Spreadsheet title:', doc.title);
    
    // List all sheets
    console.log('\nSheets in the document:');
    doc.sheetsByIndex.forEach((sheet, i) => {
      console.log(`${i}: ${sheet.title}`);
    });

  } catch (error) {
    console.error('Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
  }
}

testSheets();
