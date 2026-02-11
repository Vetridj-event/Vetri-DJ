import mongoose, { Schema, Document } from 'mongoose';
import { EventPackage as EventPackageType } from '@/types';

export interface IEventPackage extends Omit<EventPackageType, 'id'>, Document { }

const PackageSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    features: [{ type: String }],
    isPopular: { type: Boolean, default: false },
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

export default mongoose.models.Package || mongoose.model<IEventPackage>('Package', PackageSchema);
