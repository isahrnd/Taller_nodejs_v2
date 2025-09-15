"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
const User_1 = require("../models/User"); // modelo e interfaz
class UserService {
    // Crear usuario (registro o admin)
    async create(data) {
        const exists = await User_1.UserModel.findOne({ email: data.email });
        if (exists) {
            throw Object.assign(new Error("User already exists"), { status: 400 });
        }
        const passwordHash = await bcrypt_1.default.hash(data.password, 10);
        const created = await User_1.UserModel.create({
            name: data.name,
            email: data.email,
            passwordHash,
            role: data.role ?? "client",
            status: "active",
        });
        return created;
    }
    // Listar todos (solo admin)
    async list(user) {
        if (user.role !== "admin") {
            throw Object.assign(new Error("Forbidden"), { status: 403 });
        }
        return User_1.UserModel.find();
    }
    // Obtener un usuario
    async getOne(id, user) {
        const u = await User_1.UserModel.findById(id);
        if (!u)
            return null;
        const isSelf = String(u._id) === user.id;
        if (user.role !== "admin" && !isSelf) {
            throw Object.assign(new Error("Forbidden"), { status: 403 });
        }
        return u;
    }
    // Actualizar perfil o admin
    async update(id, data, user) {
        const u = await User_1.UserModel.findById(id);
        if (!u)
            return null;
        const isSelf = String(u._id) === user.id;
        if (user.role !== "admin" && !isSelf) {
            throw Object.assign(new Error("Forbidden"), { status: 403 });
        }
        if (data.password) {
            data.passwordHash = await bcrypt_1.default.hash(data.password, 10);
            delete data.password;
        }
        const updated = await User_1.UserModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        return updated;
    }
    // Eliminar usuario (solo admin o uno mismo)
    async remove(id, user) {
        const u = await User_1.UserModel.findById(id);
        if (!u)
            return false;
        const isSelf = String(u._id) === user.id;
        if (user.role !== "admin" && !isSelf) {
            throw Object.assign(new Error("Forbidden"), { status: 403 });
        }
        const res = await User_1.UserModel.deleteOne({ _id: new mongoose_1.Types.ObjectId(id) });
        return res.deletedCount === 1;
    }
    // Login
    async login(data) {
        const u = await User_1.UserModel.findOne({ email: data.email });
        if (!u) {
            throw Object.assign(new Error("Invalid credentials"), { status: 401 });
        }
        const ok = await bcrypt_1.default.compare(data.password, u.passwordHash);
        if (!ok) {
            throw Object.assign(new Error("Invalid credentials"), { status: 401 });
        }
        const accessToken = jsonwebtoken_1.default.sign({ user: { id: u._id, role: u.role } }, process.env.SECRET, { expiresIn: "15m" });
        const refreshToken = jsonwebtoken_1.default.sign({ sub: u._id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });
        return { user: u, accessToken, refreshToken };
    }
}
exports.UserService = UserService;
exports.userService = new UserService();
//# sourceMappingURL=user.service.js.map