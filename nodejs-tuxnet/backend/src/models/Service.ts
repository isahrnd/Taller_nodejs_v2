import { Schema, model, Document } from 'mongoose';
import mongoose from "mongoose";
import { ServiceInput } from '../interfaces';


export interface ServiceDocument extends ServiceInput, mongoose.Document{
    createdAt: Date, 
    updatedAt: Date, 
    deletedAt: Date
}

const ServiceSchema = new Schema({
  name: { type: String, required: true },
  category: String,
  durationMin: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: 'active' }
});

export const ServiceModel = model<ServiceDocument>('Service', ServiceSchema);
