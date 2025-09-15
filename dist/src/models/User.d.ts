import { Document } from 'mongoose';
export type Role = 'admin' | 'stylist' | 'client';
export interface UserDocument extends Document {
    name: string;
    email: string;
    passwordHash: string;
    role: Role;
    status: 'active' | 'inactive';
    createdAt: Date;
}
export declare const UserModel: import("mongoose").Model<UserDocument, {}, {}, {}, Document<unknown, {}, UserDocument, {}, {}> & UserDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
