import { Types } from "mongoose";
import { AppointmentInput, AppointmentUpdateInput } from "../interfaces";
type Role = "admin" | "stylist" | "client";
type UserCtx = {
    id: string;
    role: Role;
};
export declare class AppointmentService {
    create(data: AppointmentInput, user: UserCtx): Promise<import("mongoose").Document<unknown, {}, import("../models").AppointmentDocument, {}, {}> & import("../models").AppointmentDocument & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    list(query: {
        from?: string;
        to?: string;
        staffId?: string;
        serviceId?: string;
    }, user: UserCtx): Promise<(import("mongoose").Document<unknown, {}, import("../models").AppointmentDocument, {}, {}> & import("../models").AppointmentDocument & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getOne(id: string, user: UserCtx): Promise<(import("mongoose").Document<unknown, {}, import("../models").AppointmentDocument, {}, {}> & import("../models").AppointmentDocument & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    update(id: string, data: AppointmentUpdateInput, user: UserCtx): Promise<(import("mongoose").Document<unknown, {}, import("../models").AppointmentDocument, {}, {}> & import("../models").AppointmentDocument & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    remove(id: string, user: UserCtx): Promise<boolean>;
}
export declare const appointmentService: AppointmentService;
export {};
