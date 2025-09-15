import { Types, FilterQuery } from "mongoose";
import { AppointmentInput, AppointmentUpdateInput } from "../interfaces";
import { ServiceModel } from "../models";
import { AppointmentModel } from "../models/Appointment";

type Role = "admin" | "stylist" | "client";
type UserCtx = { id: string; role: Role };

export class AppointmentService {
  async create(data: AppointmentInput, user: UserCtx) {
    if (user.role === "client" && data.client_id !== user.id) {
      throw Object.assign(new Error("Cannot create for another client"), { status: 403 });
    }

    const svc = await ServiceModel.findById(data.service_id);
    if (!svc) {
      throw Object.assign(new Error("Service not found"), { status: 404 });
    }
    if (svc.status !== "active") {
      throw Object.assign(new Error("Service inactive"), { status: 400 });
    }

    const start = new Date(data.start_at);
    const end = new Date(data.end_at);
    const invalidDates = Number.isNaN(+start) || Number.isNaN(+end);
    if (invalidDates || start >= end) {
      throw Object.assign(new Error("Invalid time range"), { status: 400 });
    }

    // Optional duration validation with tolerance
    if (typeof (svc as any).durationMin === "number") {
      const durationMin = (svc as any).durationMin as number;
      const diffMin = Math.round((end.getTime() - start.getTime()) / 60000);
      const TOL = 5;
      if (Math.abs(diffMin - durationMin) > TOL) {
        throw Object.assign(
          new Error(`Time range must match service duration (${durationMin} min)`),
          { status: 400 }
        );
      }
    }

    const overlap = await AppointmentModel.exists({
      staff_id: new Types.ObjectId(data.staff_id),
      start_at: { $lt: end },
      end_at: { $gt: start },
      status: { $in: ["SCHEDULED", "RESCHEDULED", "DONE"] },
    });
    if (overlap) {
      throw Object.assign(new Error("Staff not available in this time range"), { status: 409 });
    }

    const created = await AppointmentModel.create({
      client_id: new Types.ObjectId(data.client_id),
      staff_id: new Types.ObjectId(data.staff_id),
      service_id: new Types.ObjectId(data.service_id),
      start_at: start,
      end_at: end,
      notes: data.notes ?? "",
      status: "SCHEDULED",
      paid_flag: false,
    });
    return created;
  }

  async list(
    query: { from?: string; to?: string; staffId?: string; serviceId?: string },
    user: UserCtx
  ) {
    const filter: FilterQuery<any> = {};
    if (user.role === "client") {
      filter.client_id = new Types.ObjectId(user.id);
    } else if (user.role === "stylist") {
      filter.staff_id = new Types.ObjectId(user.id);
    }

    if (query.staffId) filter.staff_id = new Types.ObjectId(query.staffId);
    if (query.serviceId) filter.service_id = new Types.ObjectId(query.serviceId);

    if (query.from || query.to) {
      filter.start_at = {} as any;
      if (query.from) (filter.start_at as any).$gte = new Date(query.from);
      if (query.to) (filter.start_at as any).$lte = new Date(query.to);
    }

    const items = await AppointmentModel.find(filter).sort({ start_at: 1 });
    return items;
  }

  async getOne(id: string, user: UserCtx) {
    const appt = await AppointmentModel.findById(id);
    if (!appt) return null;

    const isOwner = String(appt.client_id) === user.id;
    const isStylist = String(appt.staff_id) === user.id;
    const isAdmin = user.role === "admin";
    if (!isAdmin && !isOwner && !isStylist) {
      throw Object.assign(new Error("Forbidden"), { status: 403 });
    }
    return appt;
  }

  async update(id: string, data: AppointmentUpdateInput, user: UserCtx) {
    const appt = await AppointmentModel.findById(id);
    if (!appt) return null;

    const isOwner = String(appt.client_id) === user.id;
    const isStylist = String(appt.staff_id) === user.id;
    const isAdmin = user.role === "admin";

    if (!isAdmin && !isOwner && !isStylist) {
      throw Object.assign(new Error("Forbidden"), { status: 403 });
    }

    // If trying to set DONE, only stylist assigned or admin can
    if (data.status === "DONE" && !(isStylist || isAdmin)) {
      throw Object.assign(new Error("Forbidden"), { status: 403 });
    }

    // Re-schedule validations (optional: before start_at)
    const next: any = {};
    if (data.start_at) next.start_at = new Date(data.start_at);
    if (data.end_at) next.end_at = new Date(data.end_at);
    if (data.notes !== undefined) next.notes = data.notes;
    if (data.paid_flag !== undefined) next.paid_flag = data.paid_flag;
    if (data.status) next.status = data.status;

    // If dates provided, validate them and ensure no overlap
    const newStart = next.start_at ?? appt.start_at;
    const newEnd = next.end_at ?? appt.end_at;
    if (Number.isNaN(+newStart) || Number.isNaN(+newEnd) || newStart >= newEnd) {
      throw Object.assign(new Error("Invalid time range"), { status: 400 });
    }

    const overlap = await AppointmentModel.exists({
      _id: { $ne: appt._id },
      staff_id: appt.staff_id,
      start_at: { $lt: newEnd },
      end_at: { $gt: newStart },
      status: { $in: ["SCHEDULED", "RESCHEDULED", "DONE"] },
    });
    if (overlap) {
      throw Object.assign(new Error("Staff not available in this time range"), { status: 409 });
    }

    const updated = await AppointmentModel.findByIdAndUpdate(id, next, { new: true, runValidators: true });
    return updated;
  }

  async remove(id: string, user: UserCtx) {
    const appt = await AppointmentModel.findById(id);
    if (!appt) return false;

    const isOwner = String(appt.client_id) === user.id;
    const isAdmin = user.role === "admin";
    if (!isAdmin && !isOwner) {
      throw Object.assign(new Error("Forbidden"), { status: 403 });
    }

    const res = await AppointmentModel.deleteOne({ _id: appt._id });
    return res.deletedCount === 1;
  }
}

export const appointmentService = new AppointmentService();
