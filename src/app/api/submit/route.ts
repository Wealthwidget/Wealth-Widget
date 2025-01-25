import { NextRequest, NextResponse } from 'next/server';
import { appendToSheet } from '@/lib/sheets';

interface ErrorWithDetails extends Error {
  cause?: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, aum, revenue, email } = body;

    // Validate required fields
    if (!name || !aum || !revenue || !email) {
      return NextResponse.json({
        error: "Missing required fields",
      }, { status: 400 });
    }

    // Calculate valuation (4.5x AUM to match the rest of the app)
    const valuation = aum * 4.5;

    // Prepare data for spreadsheet
    const data = {
      timestamp: new Date().toISOString(),
      name,
      aum,
      revenue,
      email,
      valuation,
    };

    // Append to sheet
    const success = await appendToSheet(data);

    if (!success) {
      return NextResponse.json({
        error: "Failed to save data to sheet",
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Data successfully added to sheet",
      data,
    });
  } catch (error) {
    const err = error as ErrorWithDetails;
    console.error('Error in submit endpoint:', {
      name: err.name || 'UnknownError',
      message: err.message || 'An unknown error occurred',
      stack: err.stack,
      cause: err.cause,
    });

    return NextResponse.json({
      error: "An error occurred while processing your request",
    }, { status: 500 });
  }
}
