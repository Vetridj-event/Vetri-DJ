import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { logAction } from '@/lib/audit-logger';

export async function POST(request: NextRequest) {
    await dbConnect();
    try {
        const { identifier, password, phone, otp, type } = await request.json();

        if (type === 'team') {
            // Team Login (Password)
            const user = await User.findOne({
                $or: [
                    { phone: identifier },
                    { _id: identifier.match(/^[0-9a-fA-F]{24}$/) ? identifier : undefined }
                ].filter(Boolean)
            });

            if (!user || user.password !== password) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }

            const userData = user.toJSON();
            console.log('Login Success (Team):', { id: userData.id, role: userData.role });

            const response = NextResponse.json(userData);
            const sessionData = encodeURIComponent(JSON.stringify(userData));
            response.cookies.set('vetri_session', sessionData, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7,
                sameSite: 'lax'
            });

            await logAction(userData.id, 'UPDATE', 'USER', userData.id, `User logged in: ${userData.name}`);
            return response;
        } else {
            const normalizePhone = (p: string) => {
                const d = p.replace(/\D/g, '')
                return d.length > 10 ? d.slice(-10) : d
            }
            const normalizedInput = normalizePhone(phone);

            let user = await User.findOne({ phone: new RegExp(normalizedInput + '$') });

            if (!user) {
                // Create new customer
                user = await User.create({
                    name: 'Guest Customer',
                    phone: phone,
                    role: 'CUSTOMER',
                    password: 'otp_auth',
                    joinedDate: new Date().toISOString()
                });
            }

            const userData = user.toJSON();
            console.log('Login Success (Customer):', { id: userData.id, role: userData.role });

            const response = NextResponse.json(userData);
            const sessionData = encodeURIComponent(JSON.stringify(userData));
            response.cookies.set('vetri_session', sessionData, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7,
                sameSite: 'lax'
            });

            await logAction(userData.id, 'UPDATE', 'USER', userData.id, `Customer logged in: ${userData.name}`);
            return response;
        }
    } catch (error: any) {
        console.error('Login API error:', error);
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
