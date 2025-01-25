import { GoogleSpreadsheet } from 'google-spreadsheet';

export interface ValuationData {
  timestamp: string;
  name: string;
  aum: number;
  revenue: number;
  email: string;
  valuation: number;
}

function decodeBase64Key(base64Key: string): string {
  try {
    // First try to decode as base64
    const decoded = Buffer.from(base64Key, 'base64').toString('utf-8');
    if (decoded.includes('PRIVATE KEY')) {
      return decoded;
    }
    // If not base64, return as is
    return base64Key;
  } catch (e) {
    // If decoding fails, return as is
    return base64Key;
  }
}

export async function appendToSheet(data: ValuationData) {
  try {
    // Check environment variables
    console.log('Checking environment variables...');
    if (!process.env.GOOGLE_SHEETS_ID) {
      console.error('Missing GOOGLE_SHEETS_ID');
      return false;
    }
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      console.error('Missing GOOGLE_SERVICE_ACCOUNT_EMAIL');
      return false;
    }
    if (!process.env.GOOGLE_PRIVATE_KEY) {
      console.error('Missing GOOGLE_PRIVATE_KEY');
      return false;
    }

    console.log('All environment variables present');
    
    // Decode and format private key
    const privateKey = decodeBase64Key(process.env.GOOGLE_PRIVATE_KEY);
    
    console.log('Creating spreadsheet instance...');
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_ID);
    
    console.log('Authenticating with service account...');
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey,
    });
    
    console.log('Loading spreadsheet info...');
    await doc.loadInfo();
    console.log('Spreadsheet loaded:', doc.title);

    const sheet = doc.sheetsByIndex[0];
    if (!sheet) {
      console.error('No sheet found at index 0');
      return false;
    }

    console.log('Adding row to sheet with data:', {
      timestamp: data.timestamp,
      name: data.name,
      aum: data.aum,
      revenue: data.revenue,
      email: data.email,
      valuation: data.valuation,
    });

    await sheet.addRow({
      Timestamp: data.timestamp,
      Name: data.name,
      AUM: data.aum,
      Revenue: data.revenue,
      Email: data.email,
      Valuation: data.valuation,
    });

    console.log('Row added successfully');
    return true;
  } catch (error) {
    console.error('Error in appendToSheet:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return false;
  }
}
