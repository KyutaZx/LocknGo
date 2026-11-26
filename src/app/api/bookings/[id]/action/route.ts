import { NextResponse } from 'next/server';
import {
  BookingActionPayload,
  performBookingAction,
} from '@/services/bookingService';

export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const bookingId = context.params.id;
    if (!bookingId) {
      return NextResponse.json(
        { error: 'ID booking tidak valid.' },
        { status: 400 }
      );
    }

    const body = (await request.json()) as BookingActionPayload;
    if (!body || !body.type) {
      return NextResponse.json(
        { error: 'Tipe aksi tidak valid.' },
        { status: 400 }
      );
    }

    const result = await performBookingAction(bookingId, body);
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
      error instanceof Error ? error.message : 'Gagal memproses aksi booking.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
