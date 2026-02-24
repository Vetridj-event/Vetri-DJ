import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { logAction } from '@/lib/audit-logger';
import { withAuth } from '@/lib/auth-middleware';

export async function PUT(request: NextRequest) {
    return withAuth(request, ['ADMIN', 'CREW', 'CUSTOMER'], async (session) => {
        await dbConnect();
        try {
            const body = await request.json();
            const { currentPassword, newPassword } = body;

            if (!currentPassword || !newPassword) {
                return NextResponse.json({ error: 'Current and new password are required' }, { status: 400 });
            }

            // Find the user from the session ID. withAuth provides the user object partially, but let's query the DB for the full doc including the current password
            const userId = (session as any).id || (session as any)._id;

            if (!userId) {
                return NextResponse.json({ error: 'User session invalid' }, { status: 401 });
            }

            const user = await User.findById(userId);

            if (!user) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            // Verify current password
            if (user.password !== currentPassword) {
                return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
            }

            // Update password
            user.password = newPassword;
            await user.save();

            // Prevent password from being returned
            const { password, ...userWithoutPassword } = user.toObject();

            await logAction(userId, 'UPDATE', 'USER', userId, `User changed password: ${user.name}`);

            return NextResponse.json({ message: 'Password updated successfully', user: userWithoutPassword });

        } catch (error: any) {
            console.error('Update password error:', error);
            return NextResponse.json({ error: 'Failed to update password', details: error.message }, { status: 500 });
        }
    });
}
