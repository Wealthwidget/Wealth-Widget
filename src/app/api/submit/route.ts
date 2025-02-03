import { NextRequest, NextResponse } from 'next/server';
import { appendToSheet } from '@/lib/sheets';

interface ErrorWithDetails extends Error {
  cause?: unknown;
}

export async function POST(request: NextRequest) {
  try {
    console.log('Submit API: Starting request processing');
    
    // Parse request body
    let body;
    try {
      const text = await request.text();
      console.log('Raw request body:', text);
      body = JSON.parse(text);
      console.log('Parsed request body:', body);
    } catch (e) {
      console.error('Submit API: Failed to parse request body:', e);
      return NextResponse.json({
        error: "Invalid request body",
        details: e instanceof Error ? e.message : 'Unknown parsing error'
      }, { status: 400 });
    }

    const { name, aum, revenue, email, valuation } = body;
    console.log('Submit API: Extracted fields:', { name, aum, revenue, email, valuation });
    console.log('Submit API: Field types:', {
      name: typeof name,
      aum: typeof aum,
      revenue: typeof revenue,
      email: typeof email,
      valuation: typeof valuation
    });

    // Validate required fields
    if (!name || !aum || !revenue || !email || !valuation) {
      console.log('Submit API: Missing required fields:', {
        name: !name,
        aum: !aum,
        revenue: !revenue,
        email: !email,
        valuation: !valuation
      });
      return NextResponse.json({
        error: "Missing required fields",
        details: {
          name: !name ? "Name is required" : null,
          aum: !aum ? "AUM is required" : null,
          revenue: !revenue ? "Revenue is required" : null,
          email: !email ? "Email is required" : null,
          valuation: !valuation ? "Valuation is required" : null,
        }
      }, { status: 400 });
    }

    // Validate field types
    if (typeof aum !== 'number' || isNaN(aum)) {
      console.log('Submit API: Invalid AUM:', { aum, type: typeof aum });
      return NextResponse.json({
        error: "Invalid AUM value",
        details: `AUM must be a number, got ${typeof aum}`
      }, { status: 400 });
    }

    if (typeof revenue !== 'number' || isNaN(revenue)) {
      console.log('Submit API: Invalid revenue:', { revenue, type: typeof revenue });
      return NextResponse.json({
        error: "Invalid revenue value",
        details: `Revenue must be a number, got ${typeof revenue}`
      }, { status: 400 });
    }

    if (typeof valuation !== 'number' || isNaN(valuation)) {
      console.log('Submit API: Invalid valuation:', { valuation, type: typeof valuation });
      return NextResponse.json({
        error: "Invalid valuation value",
        details: `Valuation must be a number, got ${typeof valuation}`
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Submit API: Invalid email format:', { email });
      return NextResponse.json({
        error: "Invalid email format",
      }, { status: 400 });
    }

    // Log environment variables (safely)
    console.log('Submit API: Environment variables check:', {
      hasSheetId: !!process.env.GOOGLE_SHEETS_ID,
      hasServiceAccount: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
    });

    // Prepare data for spreadsheet
    const data = {
      timestamp: new Date().toISOString(),
      name,
      aum,
      revenue,
      email,
      valuation,
    };
    console.log('Submit API: Prepared sheet data:', data);

    try {
      // Append to sheet
      console.log('Submit API: Attempting to append to sheet...');
      const success = await appendToSheet(data);
      console.log('Submit API: Sheet append result:', success);

      if (!success) {
        console.error('Submit API: Failed to append to sheet');
        return NextResponse.json({
          error: "Failed to save data",
        }, { status: 500 });
      }
    } catch (sheetError) {
      console.error('Submit API: Sheet error:', sheetError);
      if (sheetError instanceof Error) {
        console.error('Submit API: Sheet error details:', {
          name: sheetError.name,
          message: sheetError.message,
          stack: sheetError.stack
        });
      }
      throw sheetError;
    }

    console.log('Submit API: Successfully completed request');
    return NextResponse.json({
      success: true,
      message: "Data successfully added to sheet",
      data: {
        ...data,
        aum: aum.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        revenue: revenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        valuation: valuation.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      },
    });
  } catch (error) {
    const err = error as ErrorWithDetails;
    console.error('Submit API: Error in submit endpoint:', {
      name: err.name || 'UnknownError',
      message: err.message || 'An unknown error occurred',
      stack: err.stack,
      cause: err.cause,
    });

    return NextResponse.json({
      error: "An error occurred while processing your request",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    }, { status: 500 });
  }
}
