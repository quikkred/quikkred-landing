import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId, ...updateData } = body;

    if (!applicationId) {
      return NextResponse.json(
        { success: false, message: 'Application ID is required' },
        { status: 400 }
      );
    }

    // Get auth token from headers
    const authHeader = request.headers.get('Authorization');

    // Forward the update request to the backend API
    const response = await fetch(`http://93.127.167.88:4050/api/application/loan/update/${applicationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
      body: JSON.stringify(updateData)
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Loan Application Update API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update loan application' },
      { status: 500 }
    );
  }
}
