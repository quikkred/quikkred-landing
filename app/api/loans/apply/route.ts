import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward the loan application to the backend API
    const response = await fetch('https://beta.quikkred.in/api/application/loan/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Loan Application API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit loan application' },
      { status: 500 }
    );
  }
}
