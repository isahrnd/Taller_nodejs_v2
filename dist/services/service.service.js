"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceService = void 0;
const models_1 = require("../models");
class ServiceService {
    async create(serviceInput) {
        process.loadEnvFile();
        const serviceExists = await this.findByName(serviceInput.name);
        if (serviceExists !== null) {
            throw new ReferenceError("Service already exists");
        }
        return models_1.ServiceModel.create(serviceInput);
    }
    findByName(name) {
        return models_1.ServiceModel.findOne({ name });
    }
    getAll() {
        return models_1.ServiceModel.find();
    }
    async delete(id) {
        try {
            const service = await models_1.ServiceModel.findOneAndDelete({ _id: id });
            return service;
        }
        catch (error) {
            throw error;
        }
    }
    async update(id, serviceInput) {
        try {
            const service = await models_1.ServiceModel.findOneAndUpdate({ _id: id }, serviceInput, { returnOriginal: false });
            return service;
        }
        catch (error) {
            throw error;
        }
    }
    getById(id) {
        return models_1.ServiceModel.findById(id);
    }
}
exports.serviceService = new ServiceService();
//# sourceMappingURL=service.service.js.map