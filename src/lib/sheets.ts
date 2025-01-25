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
    if (!process.env.GOOGLE_SHEETS_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      console.error('Missing required environment variables');
      return false;
    }

    console.log('Spreadsheet ID:', process.env.GOOGLE_SHEETS_ID);

    // Format private key by replacing escaped newlines with actual newlines
    const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
    
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
      const error = new Error('No sheet found at index 0');
      console.error(error);
      throw error;
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
  } catch (error: any) {
    console.error('Error in appendToSheet:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause,
      response: error.response?.data || 'No response data',
      status: error.response?.status || 'No status',
      headers: error.response?.headers || 'No headers',
    });
    throw error;
  }
}
