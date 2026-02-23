import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { logAction } from '@/lib/audit-logger';
import { withAuth, validateBody } from '@/lib/auth-middleware';
import { registerSchema } from '@/lib/validations/schemas';

export async function GET(request: NextRequest) {
    return withAuth(request, ['ADMIN'], async () => {
        await dbConnect();
        try {
            const users = await User.find({}).select('-password').sort({ joinedDate: -1 });
            return NextResponse.json(users);
        } catch (error) {
            return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
        }
    });
}

export async function POST(request: NextRequest) {
    await dbConnect();
    const { data, errorResponse } = await validateBody(request, registerSchema);
    if (errorResponse || !data) return errorResponse || NextResponse.json({ error: 'Data required' }, { status: 400 });

    try {
        const existingUser = await User.findOne({ phone: data.phone });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists with this email or phone' }, { status: 400 });
        }

        const user = await User.create({
            ...data,
            role: 'CUSTOMER',
            joinedDate: new Date().toISOString()
        });

        // Don't return password
        const { password, ...userWithoutPassword } = user.toObject();

        await logAction('SYSTEM', 'CREATE', 'USER', user.id, `User registered: ${user.name}`);
        return NextResponse.json(userWithoutPassword, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    return withAuth(request, ['ADMIN', 'CUSTOMER', 'CREW'], async (session) => {
        await dbConnect();
        try {
            const body = await request.json();
            const { id, _id, ...updateData } = body;
            const targetId = id || _id;

            console.log('Update User Attempt:', {
                providedId: id,
                providedUnderscoreId: _id,
                targetId,
                sessionRole: session.role,
                sessionId: (session as any).id
            });

            if (!targetId) {
                return NextResponse.json({ error: 'User ID required' }, { status: 400 });
            }

            // Clean up updateData to avoid immutable field errors
            delete (updateData as any).id;
            delete (updateData as any)._id;
            delete (updateData as any).password; // Security: Don't update password here

            const user = await User.findByIdAndUpdate(
                targetId,
                updateData,
                { returnDocument: 'after' }
            ).select('-password');

            if (!user) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }
            return NextResponse.json(user);
        } catch (error: any) {
            console.error('Update user error:', error);
            return NextResponse.json({ error: 'Failed to update user', details: error.message }, { status: 500 });
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
            const user = await User.findByIdAndDelete(id);
            if (!user) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }
            await logAction('ADMIN', 'DELETE', 'USER', id, `User deleted: ${user.name}`);
            return NextResponse.json({ message: 'User deleted' });
        } catch (error) {
            return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
        }
    });
}

