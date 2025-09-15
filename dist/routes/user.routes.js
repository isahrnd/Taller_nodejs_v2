"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const schemas_1 = require("../schemas");
// Middleware para validar roles
const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ message: "Forbidden: insufficient permissions" });
        }
        next();
    };
};
exports.userRouter = express_1.default.Router();
// Auth
exports.userRouter.post("/auth/register", (0, middlewares_1.validateSchema)(schemas_1.userSchema.register), controllers_1.userController.register);
exports.userRouter.post("/auth/login", (0, middlewares_1.validateSchema)(schemas_1.userSchema.login), controllers_1.userController.login);
exports.userRouter.post("/auth/logout", middlewares_1.auth, controllers_1.userController.logout);
// Perfil
exports.userRouter.get("/me", middlewares_1.auth, controllers_1.userController.getProfile);
exports.userRouter.patch("/me", middlewares_1.auth, (0, middlewares_1.validateSchema)(schemas_1.userSchema.updateProfile), controllers_1.userController.updateProfile);
//Administración (solo admin)
exports.userRouter.get("/admin/users", middlewares_1.auth, requireRole("admin"), controllers_1.userController.listUsers);
exports.userRouter.post("/admin/users", middlewares_1.auth, requireRole("admin"), (0, middlewares_1.validateSchema)(schemas_1.userSchema.createUser), controllers_1.userController.createUser);
exports.userRouter.patch("/admin/users/:id", middlewares_1.auth, requireRole("admin"), (0, middlewares_1.validateSchema)(schemas_1.userSchema.updateUser), controllers_1.userController.updateUser);
exports.userRouter.delete("/admin/users/:id", middlewares_1.auth, requireRole("admin"), controllers_1.userController.deleteUser);
//# sourceMappingURL=user.routes.js.map