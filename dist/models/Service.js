"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceModel = void 0;
const mongoose_1 = require("mongoose");
const ServiceSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    category: String,
    durationMin: { type: Number, required: true },
    price: { type: Number, required: true },
    status: { type: String, default: 'active' }
});
exports.ServiceModel = (0, mongoose_1.model)('Service', ServiceSchema);
//# sourceMappingURL=Service.js.map