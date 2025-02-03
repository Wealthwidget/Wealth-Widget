import { GoogleSpreadsheet } from 'google-spreadsheet';

export interface ValuationData {
  timestamp: string;
  name: string;
  aum: number;
  revenue: number;
  email: string;
  valuation: number;
}

function formatPrivateKey(key: string): string {
  // If it's already a PEM key, return as is
  if (key.includes('-----BEGIN PRIVATE KEY-----')) {
    return key;
  }
  
  // Format as PEM key
  return `-----BEGIN PRIVATE KEY-----\n${key}\n-----END PRIVATE KEY-----\n`;
}

export async function appendToSheet(data: ValuationData) {
  try {
    console.log('Sheets: Starting appendToSheet...');
    console.log('Sheets: Environment variables:', {
      SHEETS_ID: process.env.GOOGLE_SHEETS_ID?.substring(0, 5) + '...',
      SERVICE_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      HAS_KEY: !!process.env.GOOGLE_PRIVATE_KEY
    });

    if (!process.env.GOOGLE_SHEETS_ID) {
      throw new Error('Missing GOOGLE_SHEETS_ID');
    }
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      throw new Error('Missing GOOGLE_SERVICE_ACCOUNT_EMAIL');
    }
    if (!process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error('Missing GOOGLE_PRIVATE_KEY');
    }

    console.log('Sheets: Creating spreadsheet instance...');
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_ID);
    
    console.log('Sheets: Authenticating...');
    const privateKey = formatPrivateKey(process.env.GOOGLE_PRIVATE_KEY);
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey,
    });
    
    console.log('Sheets: Loading document info...');
    await doc.loadInfo();
    console.log('Sheets: Document title:', doc.title);

    const sheet = doc.sheetsByIndex[0];
    if (!sheet) {
      throw new Error('No sheet found at index 0');
    }

    console.log('Sheets: Adding row with data:', {
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

    console.log('Sheets: Row added successfully');
    return true;
  } catch (error) {
    console.error('Sheets: Error in appendToSheet:', error);
    if (error instanceof Error) {
      console.error('Sheets: Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    throw error; // Re-throw to be handled by the API route
  }
}
