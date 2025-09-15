"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceController = void 0;
const services_1 = require("../services");
class ServiceController {
    async create(req, res) {
        try {
            const newService = await services_1.serviceService.create(req.body);
            res.status(201).json(newService);
        }
        catch (error) {
            if (error instanceof ReferenceError) {
                res.status(400).json({ message: "Service already exists" });
                return;
            }
            else {
                res.status(500).json(error);
                return;
            }
            res.status(500).json(error);
        }
    }
    async getAll(req, res) {
        try {
            const services = await services_1.serviceService.getAll();
            res.status(200).json(services);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }
    async delete(req, res) {
        try {
            const id = req.params.id || "";
            const service = await services_1.serviceService.delete(id);
            if (service === null) {
                res.status(404).json({ message: `Service with id ${id} not found` });
                return;
            }
            res.json({ service, message: "Service deleted successfully" });
        }
        catch (error) {
            res.status(500).json(error);
        }
    }
    async update(req, res) {
        try {
            const id = req.params.id || "";
            const service = await services_1.serviceService.update(id, req.body);
            if (service === null) {
                res.status(404).json({ message: `Service with id ${id} not found` });
                return;
            }
            res.json(service);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }
    async getOne(req, res) {
        try {
            const id = req.params.id || "";
            const service = await services_1.serviceService.getById(id);
            if (service === null) {
                res.status(404).json({ message: `Service with id ${id} not found` });
                return;
            }
            res.json(service);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }
}
exports.serviceController = new ServiceController();
//# sourceMappingURL=service.controller.js.map