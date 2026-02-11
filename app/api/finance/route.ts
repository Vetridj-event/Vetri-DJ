import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Finance from '@/models/Finance';
import { logAction } from '@/lib/audit-logger';

export async function GET() {
    await dbConnect();
    try {
        const finance = await Finance.find({}).sort({ date: -1 });
        return NextResponse.json(finance);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch finance records' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const body = await request.json();
        const record = await Finance.create(body);
        await logAction('ADMIN', 'CREATE', 'FINANCE', record.id, `${record.type}: ${record.description} (₹${record.amount})`);
        return NextResponse.json(record, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create finance record' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    await dbConnect();
    try {
        const body = await request.json();
        const { id, ...updateData } = body;
        const record = await Finance.findByIdAndUpdate(id, updateData, { new: true });
        if (!record) {
            return NextResponse.json({ error: 'Record not found' }, { status: 404 });
        }
        await logAction('ADMIN', 'UPDATE', 'FINANCE', id, `Updated ${record.description}`);
        return NextResponse.json(record);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update finance record' }, { status: 500 });
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
        const record = await Finance.findByIdAndDelete(id);
        if (!record) {
            return NextResponse.json({ error: 'Record not found' }, { status: 404 });
        }
        await logAction('ADMIN', 'DELETE', 'FINANCE', id, `Deleted record: ${record.description}`);
        return NextResponse.json({ message: 'Record deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete finance record' }, { status: 500 });
    }
}
