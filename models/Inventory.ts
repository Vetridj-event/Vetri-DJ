import mongoose, { Schema, Document } from 'mongoose';
import { InventoryItem as InventoryItemType } from '@/types';

export interface IInventoryItem extends Omit<InventoryItemType, 'id'>, Document { }

const InventorySchema = new Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    totalQuantity: { type: Number, required: true },
    status: {
        type: String,
        enum: ['AVAILABLE', 'IN_USE', 'MAINTENANCE'],
        default: 'AVAILABLE'
    },
    lastChecked: { type: String },
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret: any) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

export default mongoose.models.Inventory || mongoose.model<IInventoryItem>('Inventory', InventorySchema);
