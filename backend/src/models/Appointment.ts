import { Schema, model, Types } from 'mongoose';

export type AppointmentStatus =
  | 'SCHEDULED'
  | 'RESCHEDULED'
  | 'CANCELLED'
  | 'DONE';

export interface AppointmentDocument {
  _id: Types.ObjectId;
  client_id: Types.ObjectId;
  staff_id: Types.ObjectId;
  service_id: Types.ObjectId;
  start_at: Date;
  end_at: Date;
  status: AppointmentStatus;
  notes?: string;
  paid_flag: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<AppointmentDocument>(
  {
    client_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    staff_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    service_id: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    start_at: { type: Date, required: true },
    end_at: { type: Date, required: true },
    status: {
      type: String,
      enum: ['SCHEDULED', 'RESCHEDULED', 'CANCELLED', 'DONE'],
      default: 'SCHEDULED',
    },
    notes: { type: String },
    paid_flag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

AppointmentSchema.index({ staff_id: 1, start_at: 1 });
AppointmentSchema.index({ staff_id: 1, end_at: 1 });

export const AppointmentModel = model<AppointmentDocument>('Appointment', AppointmentSchema);
