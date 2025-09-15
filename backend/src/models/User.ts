import { Schema, model, Document } from 'mongoose';

export type Role = 'admin' | 'stylist' | 'client';

export interface UserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  status: 'active' | 'inactive';
  createdAt: Date;
}

const UserSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin','stylist','client'], default: 'client' },
  status: { type: String, default: 'active' }
}, { timestamps: true });

export const UserModel = model<UserDocument>('User', UserSchema);
