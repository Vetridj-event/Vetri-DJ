import AuditLog from '@/models/AuditLog';
import dbConnect from '@/lib/mongodb';

export async function logAction(
    userId: string,
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    entity: 'BOOKING' | 'FINANCE' | 'USER' | 'INVENTORY' | 'PACKAGE',
    entityId: string,
    details?: string
) {
    await dbConnect();
    try {
        await AuditLog.create({
            userId,
            action,
            entity,
            entityId,
            details,
        });
    } catch (error) {
        console.error('Audit Logging failed:', error);
    }
}
