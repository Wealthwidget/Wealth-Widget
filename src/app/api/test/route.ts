import { NextResponse } from 'next/server';
import { appendToSheet } from '@/lib/sheets';

export const dynamic = 'force-dynamic';

interface ErrorWithDetails extends Error {
  cause?: unknown;
}

export async function GET() {
  try {
    // Log environment variables (excluding sensitive data)
    console.log('Environment check:', {
      hasSheetId: !!process.env.GOOGLE_SHEETS_ID,
      hasServiceAccount: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
      sheetId: process.env.GOOGLE_SHEETS_ID,
      serviceAccount: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    });

    // Test data
    const testData = {
      timestamp: new Date().toISOString(),
      name: "John Smith",
      aum: 1000000,
      revenue: 500000,
      email: 'test@example.com',
      valuation: 1000000 * 4.5, // Match the 4.5x multiplier from submit endpoint
    };

    console.log('Test data:', testData);
    console.log('Attempting to append data to sheet...');
    
    const success = await appendToSheet(testData);
    console.log('Append result:', success);

    if (!success) {
      console.error('Failed to save data to sheet');
      return NextResponse.json(
        { error: 'Failed to save data to sheet' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Data successfully added to sheet',
      data: testData
    });
  } catch (error) {
    // Type guard for Error objects
    const err = error as ErrorWithDetails;
    
    // Log the full error details
    console.error('Error in test API:', {
      name: err.name || 'UnknownError',
      message: err.message || 'An unknown error occurred',
      stack: err.stack,
      cause: err.cause,
    });

    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: {
          message: err.message || 'An unknown error occurred',
          type: err.name || 'UnknownError',
          ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
        }
      },
      { status: 500 }
    );
  }
}
