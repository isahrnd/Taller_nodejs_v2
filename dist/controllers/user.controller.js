"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const services_1 = require("../services");
// Contexto con datos del usuario autenticado
const ctx = (req) => {
    const u = req.user;
    return { id: u.id, role: u.role };
};
class UserController {
    // Registro
    async register(req, res) {
        try {
            const newUser = await services_1.userService.create(req.body);
            res.status(201).json(newUser);
        }
        catch (e) {
            res.status(e.status || 500).json({ message: e.message || "Server error" });
        }
    }
    // Login
    async login(req, res) {
        try {
            const userLogin = req.body;
            const { user, accessToken, refreshToken } = await services_1.userService.login(userLogin);
            if (!user) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            return res.status(200).json({ accessToken, refreshToken, user });
        }
        catch (e) {
            return res.status(e.status || 500).json({ message: e.message || "Server error" });
        }
    }
    // Logout
    async logout(req, res) {
        try {
            res.status(200).json({ message: "Logged out successfully" });
        }
        catch (e) {
            res.status(e.status || 500).json({ message: e.message || "Server error" });
        }
    }
    // Perfil
    async getProfile(req, res) {
        try {
            if (!req.user)
                return res.status(401).json({ message: "Unauthorized" });
            res.status(200).json(req.user);
        }
        catch (e) {
            res.status(e.status || 500).json({ message: e.message || "Server error" });
        }
    }
    async updateProfile(req, res) {
        try {
            if (!req.user)
                return res.status(401).json({ message: "Unauthorized" });
            const updated = await services_1.userService.update(req.user.id, req.body, ctx(req));
            res.status(200).json(updated);
        }
        catch (e) {
            res.status(e.status || 500).json({ message: e.message || "Server error" });
        }
    }
    // Admin
    async listUsers(req, res) {
        try {
            const users = await services_1.userService.list(ctx(req));
            res.status(200).json(users);
        }
        catch (e) {
            res.status(e.status || 500).json({ message: e.message || "Server error" });
        }
    }
    async createUser(req, res) {
        try {
            const newUser = await services_1.userService.create(req.body);
            res.status(201).json(newUser);
        }
        catch (e) {
            res.status(e.status || 500).json({ message: e.message || "Server error" });
        }
    }
    async updateUser(req, res) {
        try {
            const id = req.params.id;
            const updated = await services_1.userService.update(id, req.body, ctx(req));
            if (!updated)
                return res.status(404).json({ message: "User not found" });
            res.status(200).json(updated);
        }
        catch (e) {
            res.status(e.status || 500).json({ message: e.message || "Server error" });
        }
    }
    async deleteUser(req, res) {
        try {
            const id = req.params.id;
            const deleted = await services_1.userService.remove(id, ctx(req));
            if (!deleted)
                return res.status(404).json({ message: "User not found" });
            res.status(200).json({ message: "User deleted successfully" });
        }
        catch (e) {
            res.status(e.status || 500).json({ message: e.message || "Server error" });
        }
    }
}
exports.userController = new UserController();
//# sourceMappingURL=user.controller.js.map