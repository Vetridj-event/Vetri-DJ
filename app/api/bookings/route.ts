import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { seedDatabase } from '@/lib/seed';
import { logAction } from '@/lib/audit-logger';
import { withAuth, validateBody } from '@/lib/auth-middleware';
import { bookingSchema } from '@/lib/validations/schemas';

export async function GET(request: NextRequest) {
    return withAuth(request, ['ADMIN', 'CREW', 'CUSTOMER'], async (user) => {
        await dbConnect();
        try {
            const { searchParams } = new URL(request.url);
            const customerId = searchParams.get('customerId');

            // SECURITY: If customer, they can only view THEIR OWN bookings
            let filter = {};
            if (user.role === 'CUSTOMER') {
                filter = { customerId: user.id };
            } else if (customerId) {
                filter = { customerId };
            }

            const bookings = await Booking.find(filter).sort({ date: -1 });
            return NextResponse.json(bookings);
        } catch (error) {
            return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
        }
    });
}

export async function POST(request: NextRequest) {
    return withAuth(request, ['ADMIN'], async () => {
        await dbConnect();
        const { data, errorResponse } = await validateBody(request, bookingSchema);
        if (errorResponse || !data) return errorResponse || NextResponse.json({ error: 'Data required' }, { status: 400 });

        try {
            const booking = await Booking.create(data);
            await logAction('ADMIN', 'CREATE', 'BOOKING', booking.id, `Booking created for ${booking.customerName}`);
            return NextResponse.json(booking, { status: 201 });
        } catch (error) {
            return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
        }
    });
}

export async function PUT(request: NextRequest) {
    return withAuth(request, ['ADMIN'], async () => {
        await dbConnect();
        try {
            const body = await request.json();
            const { id, ...updateData } = body;

            if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

            // Validate the update data (partial is okay for PUT usually, but here we expect full structure or use bookingSchema.partial())
            const validated = bookingSchema.partial().parse(updateData);

            const booking = await Booking.findByIdAndUpdate(id, validated, { new: true });
            if (!booking) {
                return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
            }
            await logAction('ADMIN', 'UPDATE', 'BOOKING', id, `Booking status: ${booking.status}`);
            return NextResponse.json(booking);
        } catch (error) {
            return NextResponse.json({ error: 'Validation failed or Server Error' }, { status: 500 });
        }
    });
}

export async function DELETE(request: NextRequest) {
    return withAuth(request, ['ADMIN'], async () => {
        await dbConnect();
        try {
            const { searchParams } = new URL(request.url);
            const id = searchParams.get('id');
            if (!id) {
                return NextResponse.json({ error: 'ID required' }, { status: 400 });
            }
            const booking = await Booking.findByIdAndDelete(id);
            if (!booking) {
                return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
            }
            await logAction('ADMIN', 'DELETE', 'BOOKING', id, `Booking deleted: ${booking.customerName}`);
            return NextResponse.json({ message: 'Booking deleted' });
        } catch (error) {
            return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
        }
    });
}
