"use strict";
// GET /services
// POST /admin/services (admin)
// PATCH /admin/services/:id
// GET /availability?serviceId&staffId&date — calcular huecos libres
// POST /appointments (cliente)
// PATCH /appointments/:id (reprogramar/cancelar)
// GET /agenda?view=day|week&staffId (estilista/admin)
// POST /appointments/:id/attend (estilista marca atendida)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentRouter = void 0;
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const schemas_1 = require("../schemas");
exports.appointmentRouter = express_1.default.Router();
// Create
exports.appointmentRouter.post("/", middlewares_1.auth, (0, middlewares_1.validateSchema)(schemas_1.appointmentSchema.create), (req, res) => controllers_1.appointmentController.create(req, res));
// List with optional filters
exports.appointmentRouter.get("/", middlewares_1.auth, (req, res) => controllers_1.appointmentController.list(req, res));
// Get one
exports.appointmentRouter.get("/:id", middlewares_1.auth, (req, res) => controllers_1.appointmentController.getOne(req, res));
// Update
exports.appointmentRouter.patch("/:id", middlewares_1.auth, (0, middlewares_1.validateSchema)(schemas_1.appointmentSchema.update), (req, res) => controllers_1.appointmentController.update(req, res));
// Remove
exports.appointmentRouter.delete("/:id", middlewares_1.auth, (req, res) => controllers_1.appointmentController.remove(req, res));
//# sourceMappingURL=appointment.routes.js.map