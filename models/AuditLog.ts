import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
    userId: string;
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    entity: 'BOOKING' | 'FINANCE' | 'USER' | 'INVENTORY' | 'PACKAGE';
    entityId: string;
    details: string;
    timestamp: Date;
}

const AuditLogSchema = new Schema({
    userId: { type: String, required: true },
    action: { type: String, enum: ['CREATE', 'UPDATE', 'DELETE'], required: true },
    entity: { type: String, enum: ['BOOKING', 'FINANCE', 'USER', 'INVENTORY', 'PACKAGE'], required: true },
    entityId: { type: String, required: true },
    details: { type: String },
    timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
