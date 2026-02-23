import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Setting from '@/models/Setting';
import { withAuth, validateBody } from '@/lib/auth-middleware';
import { settingsSchema } from '@/lib/validations/schemas';

export async function GET() {
    try {
        await dbConnect();
        const settings = await Setting.find({});
        const settingsMap = settings.reduce((acc: any, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});
        return NextResponse.json(settingsMap);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    return withAuth(request, ['ADMIN'], async () => {
        try {
            await dbConnect();
            const body = await request.json();
            const { key, value } = body;

            // Optional: If we want to validate specific keys using our schema
            if (key === 'upi_id' || key === 'business_name' || key === 'contact_phone') {
                const validated = settingsSchema.partial().parse({ [key]: value });
            }

            const setting = await Setting.findOneAndUpdate(
                { key },
                { value },
                { upsert: true, new: true }
            );
            return NextResponse.json(setting);
        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    });
}

