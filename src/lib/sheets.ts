import { GoogleSpreadsheet } from 'google-spreadsheet';

export interface ValuationData {
  timestamp: string;
  name: string;
  aum: number;
  revenue: number;
  email: string;
  valuation: number;
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
    console.log('Sheet ID:', process.env.GOOGLE_SHEETS_ID);
    console.log('Service Account:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
    
    // Format private key
    console.log('Formatting private key...');
    const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
    console.log('Private key starts with:', privateKey.substring(0, 50));
    console.log('Private key ends with:', privateKey.substring(privateKey.length - 50));
    
    console.log('Creating spreadsheet instance...');
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_ID);
    
    console.log('Authenticating...');
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
