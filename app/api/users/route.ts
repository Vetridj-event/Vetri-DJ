import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { seedDatabase } from '@/lib/seed';

export async function GET() {
    try {
        await dbConnect();
        await seedDatabase();
        const users = await User.find({});
        return NextResponse.json(users);
    } catch (error: any) {
        console.error('API Error (GET /api/users):', error.message);
        return NextResponse.json({ error: 'Failed to fetch users', details: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const body = await request.json();
        const user = await User.create(body);
        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    await dbConnect();
    try {
        const body = await request.json();
        const { id, ...updateData } = body;
        const user = await User.findByIdAndUpdate(id, updateData, { new: true });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
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
        return NextResponse.json({ message: 'User deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
