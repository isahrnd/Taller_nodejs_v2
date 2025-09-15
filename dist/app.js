"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = require("./routes/user.routes");
const app = (0, express_1.default)();
// Middleware global
app.use(express_1.default.json());
// Rutas
app.use("/users", user_routes_1.userRouter); // 👈 todas tus rutas estarán bajo /users
// Manejo de errores genérico (opcional)
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});
exports.default = app;
//# sourceMappingURL=app.js.map