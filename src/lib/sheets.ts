import { GoogleSpreadsheet } from 'google-spreadsheet';
import { readFileSync } from 'fs';
import { join } from 'path';

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
    // Read the service account credentials file
    const credentialsPath = join(process.cwd(), 'wealth-valuation-widget-f562711c2859.json');
    console.log('Reading credentials from:', credentialsPath);
    const credentials = JSON.parse(readFileSync(credentialsPath, 'utf8'));

    console.log('Service account email:', credentials.client_email);
    console.log('Spreadsheet ID:', process.env.GOOGLE_SHEETS_ID);

    console.log('Creating spreadsheet instance...');
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_ID!);
    
    console.log('Authenticating...');
    await doc.useServiceAccountAuth({
      client_email: credentials.client_email,
      private_key: credentials.private_key,
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
