import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check for new variable name first, then fallback to old name for backwards compatibility
    const applicationId = process.env.TELLER_APPLICATION_ID || process.env.NEXT_PUBLIC_TELLER_APPLICATION_ID;
    const environment = process.env.TELLER_ENV || process.env.NEXT_PUBLIC_TELLER_ENV || 'development';

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Teller configuration is not available' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      applicationId,
      environment: environment as 'sandbox' | 'development' | 'production',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to fetch Teller configuration', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
