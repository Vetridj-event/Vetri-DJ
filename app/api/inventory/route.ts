import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Inventory from '@/models/Inventory';

export async function GET() {
    await dbConnect();
    try {
        const inventory = await Inventory.find({});
        return NextResponse.json(inventory);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const body = await request.json();
        const item = await Inventory.create(body);
        return NextResponse.json(item, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create inventory item' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    await dbConnect();
    try {
        const body = await request.json();
        const { id, ...updateData } = body;
        const item = await Inventory.findByIdAndUpdate(id, updateData, { new: true });
        if (!item) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }
        return NextResponse.json(item);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update inventory item' }, { status: 500 });
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
        const item = await Inventory.findByIdAndDelete(id);
        if (!item) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Item deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete inventory item' }, { status: 500 });
    }
}
