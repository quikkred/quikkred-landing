/**
 * eSign API Routes for Quikkred
 *
 * These endpoints handle the SurePass NSDL eSign integration
 * for digital signing of loan agreements.
 */

import { NextRequest, NextResponse } from 'next/server';

// SurePass API Configuration
const SUREPASS_BASE_URL = 'https://kyc-api.surepass.io/api/v1';
const SUREPASS_API_KEY = process.env.SUREPASS_API_KEY || '';

// ============================================
// POST /api/esign - Main handler
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'upload':
        return handleUpload(body);
      case 'init':
        return handleInit(body);
      case 'status':
        return handleStatus(body);
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('eSign API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// UPLOAD DOCUMENT
// ============================================

interface UploadRequest {
  action: 'upload';
  documentHtml: string;
  documentType: string;
  loanId: string;
  fileName: string;
}

async function handleUpload(body: UploadRequest) {
  const { documentHtml, loanId, fileName } = body;

  // Convert HTML to PDF (using a service or library)
  // For production, use: puppeteer, html-pdf, or a cloud service
  const pdfBase64 = await convertHtmlToPdfBase64(documentHtml);

  // Upload to SurePass
  const response = await fetch(`${SUREPASS_BASE_URL}/esign/nsdl/file-upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUREPASS_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      file: pdfBase64,
      file_name: fileName,
      // Signature positions on the PDF (page, x, y coordinates)
      signature_positions: [
        {
          page_number: 1,
          x_coordinate: 100,
          y_coordinate: 700,
          width: 150,
          height: 50
        }
      ]
    }),
  });

  const result = await response.json();

  if (result.success || result.data?.client_id) {
    // Store document reference in database
    await storeDocumentReference(loanId, result.data?.client_id, fileName);

    return NextResponse.json({
      success: true,
      documentId: result.data?.client_id,
      message: 'Document uploaded successfully'
    });
  }

  return NextResponse.json({
    success: false,
    error: result.message || 'Upload failed'
  }, { status: 400 });
}

// ============================================
// INITIALIZE ESIGN REQUEST
// ============================================

interface InitRequest {
  action: 'init';
  documentId: string;
  aadhaarNumber: string;
  signerName: string;
  signerEmail: string;
  signerMobile: string;
  purpose: string;
  callbackUrl: string;
}

async function handleInit(body: InitRequest) {
  const {
    documentId,
    aadhaarNumber,
    signerName,
    signerEmail,
    signerMobile,
    purpose,
    callbackUrl
  } = body;

  // Initialize eSign with SurePass
  const response = await fetch(`${SUREPASS_BASE_URL}/esign/nsdl/init-request`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUREPASS_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: documentId,
      // Signer details
      signer_name: signerName,
      signer_email: signerEmail,
      signer_mobile: signerMobile,
      // Aadhaar for OTP verification
      aadhaar_number: aadhaarNumber,
      // Purpose displayed to user
      purpose: purpose,
      // Callback URL for webhook
      redirect_url: callbackUrl,
      // eSign configuration
      auth_type: 'otp',  // OTP-based Aadhaar authentication
      signature_type: 'aadhaar',
      // Additional options
      send_otp: true,
      expiry_minutes: 30
    }),
  });

  const result = await response.json();

  if (result.success || result.data?.url) {
    return NextResponse.json({
      success: true,
      signingUrl: result.data?.url,
      transactionId: result.data?.transaction_id,
      message: 'eSign initialized successfully'
    });
  }

  return NextResponse.json({
    success: false,
    error: result.message || 'Init failed'
  }, { status: 400 });
}

// ============================================
// CHECK ESIGN STATUS
// ============================================

interface StatusRequest {
  action: 'status';
  transactionId: string;
}

async function handleStatus(body: StatusRequest) {
  const { transactionId } = body;

  const response = await fetch(
    `${SUREPASS_BASE_URL}/esign/nsdl/get-signed-document/${transactionId}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUREPASS_API_KEY}`,
      },
    }
  );

  const result = await response.json();

  if (result.success || result.data) {
    return NextResponse.json({
      success: true,
      status: result.data?.status || 'pending',
      signedDocumentUrl: result.data?.signed_document_url,
      signedAt: result.data?.signed_at,
      certificate: result.data?.certificate
    });
  }

  return NextResponse.json({
    success: false,
    status: 'pending',
    error: result.message
  });
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Convert HTML to PDF Base64
 * In production, use puppeteer or a cloud PDF service
 */
async function convertHtmlToPdfBase64(html: string): Promise<string> {
  // Option 1: Use a cloud service like html2pdf.app
  // Option 2: Use puppeteer (requires server-side rendering)
  // Option 3: Use html-pdf library

  // For now, return a placeholder
  // TODO: Implement actual PDF conversion

  // Example with a cloud service:
  /*
  const response = await fetch('https://api.html2pdf.app/v1/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.HTML2PDF_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      html: html,
      options: {
        format: 'A4',
        margin: { top: '20mm', bottom: '20mm', left: '20mm', right: '20mm' }
      }
    })
  });

  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer).toString('base64');
  */

  // Placeholder - in production, implement actual conversion
  return Buffer.from(html).toString('base64');
}

/**
 * Store document reference in database
 */
async function storeDocumentReference(
  loanId: string,
  documentId: string,
  fileName: string
): Promise<void> {
  // TODO: Store in your database
  // Example with Prisma:
  /*
  await prisma.loanDocument.create({
    data: {
      loanId,
      documentId,
      fileName,
      type: 'LOAN_AGREEMENT',
      status: 'PENDING_SIGNATURE',
      createdAt: new Date()
    }
  });
  */
  // console.log(`Stored document reference: ${loanId} -> ${documentId}`);
}

// ============================================
// WEBHOOK CALLBACK HANDLER
// ============================================

export async function GET(request: NextRequest) {
  // Handle webhook callback from SurePass after signing
  const searchParams = request.nextUrl.searchParams;
  const transactionId = searchParams.get('transaction_id');
  const status = searchParams.get('status');

  if (status === 'signed' && transactionId) {
    // Update loan status in database
    // await updateLoanStatus(transactionId, 'AGREEMENT_SIGNED');

    // Redirect to success page
    return NextResponse.redirect(
      new URL(`/apply/success?signed=true&txn=${transactionId}`, request.url)
    );
  }

  // Redirect to failure page
  return NextResponse.redirect(
    new URL(`/apply/quick?esign_error=true`, request.url)
  );
}
