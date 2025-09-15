import { Types } from 'mongoose';
export type AppointmentStatus = 'SCHEDULED' | 'RESCHEDULED' | 'CANCELLED' | 'DONE';
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
export declare const AppointmentModel: import("mongoose").Model<AppointmentDocument, {}, {}, {}, import("mongoose").Document<unknown, {}, AppointmentDocument, {}, {}> & AppointmentDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
