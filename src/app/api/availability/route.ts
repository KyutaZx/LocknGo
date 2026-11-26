import { NextResponse } from 'next/server';
import { getAvailability } from '@/services/bookingService';

export const dynamic = 'force-dynamic';

export async function GET() {
  const result = await getAvailability();

  if (!result.success) {
    return NextResponse.json(
      { error: result.error ?? 'Gagal memuat ketersediaan loker.' },
      { status: result.statusCode }
    );
  }

  return NextResponse.json(
    {
      success: true,
      availability: result.data,
      persistence: result.persistence,
    },
    { status: 200 }
  );
}
