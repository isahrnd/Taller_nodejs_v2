"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceSchema = void 0;
const zod_1 = require("zod");
exports.serviceSchema = (0, zod_1.object)({
    name: (0, zod_1.string)({ error: "Name is required" }),
    durationMin: (0, zod_1.number)({ error: "Duration is required" }),
    price: (0, zod_1.number)({ error: "Price is required" }),
    status: (0, zod_1.string)({ error: "Status is required" })
});
//# sourceMappingURL=service.schema.js.map