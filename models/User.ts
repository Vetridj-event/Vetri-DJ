import mongoose, { Schema, Document } from 'mongoose';
import { User as UserType } from '@/types';

export interface IUser extends Omit<UserType, 'id'>, Document { }

const UserSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String },
    role: { type: String, enum: ['ADMIN', 'CREW', 'CUSTOMER'], default: 'CUSTOMER' },
    phone: { type: String, required: true, unique: true },
    whatsapp: { type: String },
    pincode: { type: String },
    city: { type: String },
    state: { type: String },
    joinedDate: { type: String, default: () => new Date().toISOString() },
    avatar: { type: String },
    salary: { type: Number, default: 0 },
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret: any) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            delete ret.password;
            return ret;
        }
    },
    toObject: {
        transform: (doc, ret: any) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            delete ret.password;
            return ret;
        }
    }
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
