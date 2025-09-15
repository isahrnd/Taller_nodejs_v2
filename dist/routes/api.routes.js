"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const appointment_routes_1 = require("./appointment.routes");
const service_routes_1 = require("./service.routes");
const user_routes_1 = require("./user.routes");
const express_1 = __importDefault(require("express"));
exports.apiRouter = express_1.default.Router();
exports.apiRouter.use("/appointments", appointment_routes_1.appointmentRouter);
exports.apiRouter.use("/users", user_routes_1.userRouter);
exports.apiRouter.use("/services", service_routes_1.serviceRouter);
//# sourceMappingURL=api.routes.js.map