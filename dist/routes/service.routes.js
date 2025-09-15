"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceRouter = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const schemas_1 = require("../schemas");
// GET /services
// POST /admin/services (admin)
// PATCH /admin/services/:id
// GET /availability?serviceId&staffId&date — calcular huecos libres
// POST /appointments (cliente)
// PATCH /appointments/:id (reprogramar/cancelar)
// GET /agenda?view=day|week&staffId (estilista/admin)
// POST /appointments/:id/attend (estilista marca atendida)
exports.serviceRouter = express_1.default.Router();
exports.serviceRouter.get("/", controllers_1.serviceController.getAll);
exports.serviceRouter.get("/:id", controllers_1.serviceController.getOne);
exports.serviceRouter.post("/", (0, middlewares_1.validateSchema)(schemas_1.serviceSchema), controllers_1.serviceController.create);
exports.serviceRouter.put("/:id", (0, middlewares_1.validateSchema)(schemas_1.serviceSchema), controllers_1.serviceController.update);
exports.serviceRouter.delete("/:id", controllers_1.serviceController.delete);
//# sourceMappingURL=service.routes.js.map