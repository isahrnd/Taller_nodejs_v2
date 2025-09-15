import { z } from "zod";

const isISO = (s: string) => !Number.isNaN(Date.parse(s));

export const appointmentSchema = {
  create: z.object({
    client_id: z.string().min(1, "client_id is required"),
    staff_id: z.string().min(1, "staff_id is required"),
    service_id: z.string().min(1, "service_id is required"),
    start_at: z.string().refine(isISO, { message: "start_at must be ISO datetime" }),
    end_at: z.string().refine(isISO, { message: "end_at must be ISO datetime" }),
    notes: z.string().max(500).optional(),
  }),
  update: z.object({
    start_at: z.string().refine(isISO, { message: "start_at must be ISO datetime" }).optional(),
    end_at: z.string().refine(isISO, { message: "end_at must be ISO datetime" }).optional(),
    status: z.enum(["SCHEDULED", "RESCHEDULED", "CANCELLED", "DONE"]).optional(),
    paid_flag: z.boolean().optional(),
    notes: z.string().max(500).optional(),
  }),
};

