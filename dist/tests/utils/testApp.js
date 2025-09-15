"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTestApp = void 0;
const express_1 = __importDefault(require("express"));
const auth_mock_1 = require("../mocks/middlewares/auth.mock");
const validateSchema_middleware_1 = require("../../src/middlewares/validateSchema.middleware");
const appointment_schema_1 = require("../../src/schemas/appointment.schema");
const controllers_1 = require("../../src/controllers");
const buildTestApp = () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    const router = express_1.default.Router();
    // Create
    router.post('/appointments', auth_mock_1.authMock, (0, validateSchema_middleware_1.validateSchema)(appointment_schema_1.appointmentSchema.create), (req, res) => controllers_1.appointmentController.create(req, res));
    // List
    router.get('/appointments', auth_mock_1.authMock, (req, res) => controllers_1.appointmentController.list(req, res));
    // Get one
    router.get('/appointments/:id', auth_mock_1.authMock, (req, res) => controllers_1.appointmentController.getOne(req, res));
    // Update
    router.patch('/appointments/:id', auth_mock_1.authMock, (0, validateSchema_middleware_1.validateSchema)(appointment_schema_1.appointmentSchema.update), (req, res) => controllers_1.appointmentController.update(req, res));
    // Remove
    router.delete('/appointments/:id', auth_mock_1.authMock, (req, res) => controllers_1.appointmentController.remove(req, res));
    app.use('/', router);
    return app;
};
exports.buildTestApp = buildTestApp;
//# sourceMappingURL=testApp.js.map