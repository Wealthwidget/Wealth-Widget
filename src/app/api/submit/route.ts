import { NextRequest, NextResponse } from 'next/server';
import { appendToSheet } from '@/lib/sheets';

interface ErrorWithDetails extends Error {
  cause?: unknown;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({
        error: "Invalid request body",
      }, { status: 400 });
    }

    const { name, aum, revenue, email } = body;

    // Validate required fields
    if (!name || !aum || !revenue || !email) {
      return NextResponse.json({
        error: "Missing required fields",
        details: {
          name: !name ? "Name is required" : null,
          aum: !aum ? "AUM is required" : null,
          revenue: !revenue ? "Revenue is required" : null,
          email: !email ? "Email is required" : null,
        }
      }, { status: 400 });
    }

    // Validate field types
    if (typeof aum !== 'number' || isNaN(aum)) {
      return NextResponse.json({
        error: "Invalid AUM value",
      }, { status: 400 });
    }

    if (typeof revenue !== 'number' || isNaN(revenue)) {
      return NextResponse.json({
        error: "Invalid revenue value",
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        error: "Invalid email format",
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
      console.error('Failed to append to sheet');
      return NextResponse.json({
        error: "Failed to save data",
      }, { status: 500 });
    }

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
    console.error('Error in submit endpoint:', {
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
