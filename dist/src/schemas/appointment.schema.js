"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentSchema = void 0;
const zod_1 = require("zod");
const isISO = (s) => !Number.isNaN(Date.parse(s));
exports.appointmentSchema = {
    create: zod_1.z.object({
        client_id: zod_1.z.string().min(1, "client_id is required"),
        staff_id: zod_1.z.string().min(1, "staff_id is required"),
        service_id: zod_1.z.string().min(1, "service_id is required"),
        start_at: zod_1.z.string().refine(isISO, { message: "start_at must be ISO datetime" }),
        end_at: zod_1.z.string().refine(isISO, { message: "end_at must be ISO datetime" }),
        notes: zod_1.z.string().max(500).optional(),
    }),
    update: zod_1.z.object({
        start_at: zod_1.z.string().refine(isISO, { message: "start_at must be ISO datetime" }).optional(),
        end_at: zod_1.z.string().refine(isISO, { message: "end_at must be ISO datetime" }).optional(),
        status: zod_1.z.enum(["SCHEDULED", "RESCHEDULED", "CANCELLED", "DONE"]).optional(),
        paid_flag: zod_1.z.boolean().optional(),
        notes: zod_1.z.string().max(500).optional(),
    }),
};
//# sourceMappingURL=appointment.schema.js.map