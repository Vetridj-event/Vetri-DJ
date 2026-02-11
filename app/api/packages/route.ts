import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Package from '@/models/Package';

export async function GET() {
    await dbConnect();
    try {
        const packages = await Package.find({});
        return NextResponse.json(packages);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const body = await request.json();
        const pkg = await Package.create(body);
        return NextResponse.json(pkg, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create package' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    await dbConnect();
    try {
        const body = await request.json();
        const { id, ...updateData } = body;
        const pkg = await Package.findByIdAndUpdate(id, updateData, { new: true });
        if (!pkg) {
            return NextResponse.json({ error: 'Package not found' }, { status: 404 });
        }
        return NextResponse.json(pkg);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update package' }, { status: 500 });
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
        const pkg = await Package.findByIdAndDelete(id);
        if (!pkg) {
            return NextResponse.json({ error: 'Package not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Package deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 });
    }
}
