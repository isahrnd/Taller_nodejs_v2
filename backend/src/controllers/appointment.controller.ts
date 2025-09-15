import { Request, Response } from "express";
import { appointmentService } from "../services";

type Role = "admin" | "stylist" | "client";

const ctx = (req: Request) => {
  const u = req.user!;
  return { id: u.id, role: u.role as Role };
};

class AppointmentController {
  async create(req: Request, res: Response) {
    try {
      const output = await appointmentService.create(req.body, ctx(req));
      res.status(201).json(output);
    } catch (e: any) {
      res.status(e.status || 500).json({ message: e.message || "Server error" });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const { from, to, staffId, serviceId } = req.query as Record<string, string>;
      const output = await appointmentService.list({ from, to, staffId, serviceId }, ctx(req));
      res.status(200).json(output);
    } catch (e: any) {
      res.status(e.status || 500).json({ message: e.message || "Server error" });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const appt = await appointmentService.getOne(req.params.id, ctx(req));
      if (!appt) return res.status(404).json({ message: "Not found" });
      res.status(200).json(appt);
    } catch (e: any) {
      res.status(e.status || 500).json({ message: e.message || "Server error" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const appt = await appointmentService.update(req.params.id, req.body, ctx(req));
      if (!appt) return res.status(404).json({ message: "Not found" });
      res.status(200).json(appt);
    } catch (e: any) {
      res.status(e.status || 500).json({ message: e.message || "Server error" });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const ok = await appointmentService.remove(req.params.id, ctx(req));
      if (!ok) return res.status(404).json({ message: "Not found" });
      res.status(200).json({ deleted: true });
    } catch (e: any) {
      res.status(e.status || 500).json({ message: e.message || "Server error" });
    }
  }
}

export const appointmentController = new AppointmentController();
