import { Document } from 'mongoose';
import mongoose from "mongoose";
import { ServiceInput } from '../interfaces';
export interface ServiceDocument extends ServiceInput, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
export declare const ServiceModel: mongoose.Model<ServiceDocument, {}, {}, {}, Document<unknown, {}, ServiceDocument, {}, {}> & ServiceDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
