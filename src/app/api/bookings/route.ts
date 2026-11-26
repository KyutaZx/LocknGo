import { NextResponse } from 'next/server';
import {
  createBooking,
  CreateBookingInput,
  getActiveBookingByPhone,
} from '@/services/bookingService';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone') ?? '';

  if (!phone) {
    return NextResponse.json(
      { error: 'Parameter phone wajib diisi.' },
      { status: 400 }
    );
  }

  const result = await getActiveBookingByPhone(phone);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: result.statusCode }
    );
  }

  return NextResponse.json(
    {
      success: true,
      booking: result.data,
      persistence: result.persistence,
    },
    { status: 200 }
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<CreateBookingInput>;

    const result = await createBooking({
      phone: body.phone ?? '',
      locationId: body.locationId ?? '',
      size: body.size as 'M' | 'L',
      durationHours: Number(body.durationHours ?? 0),
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.statusCode }
      );
    }

    return NextResponse.json(
      {
        success: true,
        booking: result.data,
        persistence: result.persistence,
      },
      { status: result.statusCode }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Gagal memproses pemesanan.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
