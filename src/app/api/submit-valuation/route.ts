import { NextResponse } from 'next/server';
import { appendToSheet, ValuationData } from '@/lib/sheets';

export async function POST(request: Request) {
  try {
    console.log('API Route: Received request');
    const data: ValuationData = await request.json();
    console.log('API Route: Parsed data:', data);
    
    // Log environment variables (without sensitive data)
    console.log('API Route: Environment variables:', {
      SHEETS_ID: process.env.GOOGLE_SHEETS_ID?.substring(0, 5) + '...',
      SERVICE_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      HAS_KEY: !!process.env.GOOGLE_PRIVATE_KEY
    });
    
    // Append to Google Sheet
    console.log('API Route: Attempting to append to sheet...');
    await appendToSheet(data);
    console.log('API Route: Successfully appended to sheet');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Route: Error in submit-valuation route:', error);
    if (error instanceof Error) {
      console.error('API Route: Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      return NextResponse.json({ 
        error: 'Internal server error', 
        details: error.message 
      }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
