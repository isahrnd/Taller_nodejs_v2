import { z } from "zod";
export declare const appointmentSchema: {
    create: z.ZodObject<{
        client_id: z.ZodString;
        staff_id: z.ZodString;
        service_id: z.ZodString;
        start_at: z.ZodString;
        end_at: z.ZodString;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    update: z.ZodObject<{
        start_at: z.ZodOptional<z.ZodString>;
        end_at: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<{
            SCHEDULED: "SCHEDULED";
            RESCHEDULED: "RESCHEDULED";
            CANCELLED: "CANCELLED";
            DONE: "DONE";
        }>>;
        paid_flag: z.ZodOptional<z.ZodBoolean>;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
};
