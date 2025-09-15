"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentController = void 0;
const services_1 = require("../services");
const ctx = (req) => {
    const u = req.user;
    return { id: u.id, role: u.role };
};
class AppointmentController {
    async create(req, res) {
        try {
            const output = await services_1.appointmentService.create(req.body, ctx(req));
            res.status(201).json(output);
        }
        catch (e) {
            res.status(e.status || 500).json({ message: e.message || "Server error" });
        }
    }
    async list(req, res) {
        try {
            const { from, to, staffId, serviceId } = req.query;
            const output = await services_1.appointmentService.list({ from, to, staffId, serviceId }, ctx(req));
            res.status(200).json(output);
        }
        catch (e) {
            res.status(e.status || 500).json({ message: e.message || "Server error" });
        }
    }
    async getOne(req, res) {
        try {
            const appt = await services_1.appointmentService.getOne(req.params.id, ctx(req));
            if (!appt)
                return res.status(404).json({ message: "Not found" });
            res.status(200).json(appt);
        }
        catch (e) {
            res.status(e.status || 500).json({ message: e.message || "Server error" });
        }
    }
    async update(req, res) {
        try {
            const appt = await services_1.appointmentService.update(req.params.id, req.body, ctx(req));
            if (!appt)
                return res.status(404).json({ message: "Not found" });
            res.status(200).json(appt);
        }
        catch (e) {
            res.status(e.status || 500).json({ message: e.message || "Server error" });
        }
    }
    async remove(req, res) {
        try {
            const ok = await services_1.appointmentService.remove(req.params.id, ctx(req));
            if (!ok)
                return res.status(404).json({ message: "Not found" });
            res.status(200).json({ deleted: true });
        }
        catch (e) {
            res.status(e.status || 500).json({ message: e.message || "Server error" });
        }
    }
}
exports.appointmentController = new AppointmentController();
//# sourceMappingURL=appointment.controller.js.map