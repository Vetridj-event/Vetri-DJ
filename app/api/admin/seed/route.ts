import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Package from '@/models/Package';
import { INITIAL_USERS, INITIAL_PACKAGES } from '@/lib/data';

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        // Seed Users
        for (const user of INITIAL_USERS) {
            const exists = await User.findOne({ $or: [{ email: user.email }, { phone: user.phone }] });
            if (!exists) {
                const { id, ...userData } = user;
                // If it's a valid ObjectId string, use it as _id
                const finalData = id.match(/^[0-9a-fA-F]{24}$/)
                    ? { _id: id, ...userData }
                    : userData;

                await User.create(finalData);
                console.log(`Seeded user: ${user.name}`);
            }
        }

        // Seed Packages
        for (const pkg of INITIAL_PACKAGES) {
            const exists = await Package.findOne({ name: pkg.name });
            if (!exists) {
                const { id, ...pkgData } = pkg;
                await Package.create(pkgData);
                console.log(`Seeded package: ${pkg.name}`);
            }
        }

        return NextResponse.json({ message: 'Database seeded successfully' });
    } catch (error: any) {
        console.error('Seeding error:', error);
        return NextResponse.json({ error: 'Seeding failed', details: error.message }, { status: 500 });
    }
}
