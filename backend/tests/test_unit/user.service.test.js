"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = require("../../src/services/user.service");
const User_1 = require("../../src/models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
jest.mock("../models/User");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
describe("UserService", () => {
    const mockUser = {
        _id: "507f1f77bcf86cd799439011",
        name: "Test",
        email: "test@test.com",
        passwordHash: "hashed123",
        role: "client",
        status: "active",
    };
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.SECRET = "testsecret";
        process.env.REFRESH_SECRET = "refreshsecret";
    });
    // 🔹 CREATE
    it("debería crear un usuario nuevo", async () => {
        User_1.UserModel.findOne.mockResolvedValue(null);
        bcrypt_1.default.hash.mockResolvedValue("hashedPassword");
        User_1.UserModel.create.mockResolvedValue({ ...mockUser, passwordHash: "hashedPassword" });
        const result = await user_service_1.userService.create({
            name: "Test",
            email: "test@test.com",
            password: "12345678",
        });
        expect(User_1.UserModel.findOne).toHaveBeenCalledWith({ email: "test@test.com" });
        expect(User_1.UserModel.create).toHaveBeenCalled();
        expect(result.passwordHash).toBe("hashedPassword");
    });
    it("no debería permitir crear un usuario duplicado", async () => {
        User_1.UserModel.findOne.mockResolvedValue(mockUser);
        await expect(user_service_1.userService.create({ name: "X", email: "test@test.com", password: "12345678" })).rejects.toThrow("User already exists");
    });
    // 🔹 LIST
    it("list debería devolver usuarios si es admin", async () => {
        User_1.UserModel.find.mockResolvedValue([mockUser]);
        const result = await user_service_1.userService.list({ id: "1", role: "admin" });
        expect(result).toEqual([mockUser]);
    });
    it("list debería fallar si no es admin", async () => {
        await expect(user_service_1.userService.list({ id: "1", role: "client" })).rejects.toThrow("Forbidden");
    });
    // 🔹 GETONE
    it("getOne debería devolver usuario propio", async () => {
        User_1.UserModel.findById.mockResolvedValue(mockUser);
        const result = await user_service_1.userService.getOne(mockUser._id, { id: mockUser._id, role: "client" });
        expect(result).toEqual(mockUser);
    });
    it("getOne debería lanzar Forbidden si no es admin ni self", async () => {
        User_1.UserModel.findById.mockResolvedValue(mockUser);
        await expect(user_service_1.userService.getOne(mockUser._id, { id: "other", role: "client" })).rejects.toThrow("Forbidden");
    });
    it("getOne debería devolver null si no existe", async () => {
        User_1.UserModel.findById.mockResolvedValue(null);
        const result = await user_service_1.userService.getOne("invalid", { id: "1", role: "admin" });
        expect(result).toBeNull();
    });
    // 🔹 UPDATE
    it("update debería permitir al usuario actualizar su perfil", async () => {
        User_1.UserModel.findById.mockResolvedValue(mockUser);
        User_1.UserModel.findByIdAndUpdate.mockResolvedValue({ ...mockUser, name: "Updated" });
        const result = await user_service_1.userService.update(mockUser._id, { name: "Updated" }, { id: mockUser._id, role: "client" });
        expect(result?.name).toBe("Updated");
    });
    it("update debería lanzar Forbidden si no tiene permiso", async () => {
        User_1.UserModel.findById.mockResolvedValue(mockUser);
        await expect(user_service_1.userService.update(mockUser._id, { name: "X" }, { id: "other", role: "client" }))
            .rejects.toThrow("Forbidden");
    });
    it("update debería devolver null si el usuario no existe", async () => {
        User_1.UserModel.findById.mockResolvedValue(null);
        const result = await user_service_1.userService.update("invalid", { name: "X" }, { id: "1", role: "admin" });
        expect(result).toBeNull();
    });
    it("update debería actualizar password correctamente", async () => {
        User_1.UserModel.findById.mockResolvedValue(mockUser);
        bcrypt_1.default.hash.mockResolvedValue("newHashed");
        User_1.UserModel.findByIdAndUpdate.mockResolvedValue({ ...mockUser, passwordHash: "newHashed" });
        const result = await user_service_1.userService.update(mockUser._id, { password: "newPassword" }, { id: mockUser._id, role: "client" });
        expect(result?.passwordHash).toBe("newHashed");
    });
    // 🔹 REMOVE
    it("remove debería eliminar si es admin", async () => {
        User_1.UserModel.findById.mockResolvedValue(mockUser);
        User_1.UserModel.deleteOne.mockResolvedValue({ deletedCount: 1 });
        const result = await user_service_1.userService.remove(mockUser._id, { id: "admin", role: "admin" });
        expect(result).toBe(true);
    });
    it("remove debería lanzar Forbidden si no es admin ni self", async () => {
        User_1.UserModel.findById.mockResolvedValue(mockUser);
        await expect(user_service_1.userService.remove(mockUser._id, { id: "other", role: "client" })).rejects.toThrow("Forbidden");
    });
    it("remove debería devolver false si no existe", async () => {
        User_1.UserModel.findById.mockResolvedValue(null);
        const result = await user_service_1.userService.remove("invalid", { id: "1", role: "admin" });
        expect(result).toBe(false);
    });
    // 🔹 LOGIN
    it("login debería autenticar correctamente", async () => {
        User_1.UserModel.findOne.mockResolvedValue(mockUser);
        bcrypt_1.default.compare.mockResolvedValue(true);
        jsonwebtoken_1.default.sign.mockReturnValue("token");
        const result = await user_service_1.userService.login({ email: "test@test.com", password: "12345678" });
        expect(result.user.email).toBe("test@test.com");
        expect(result.accessToken).toBe("token");
        expect(result.refreshToken).toBe("token");
    });
    it("login debería fallar si el usuario no existe", async () => {
        User_1.UserModel.findOne.mockResolvedValue(null);
        await expect(user_service_1.userService.login({ email: "x@test.com", password: "1234" })).rejects.toThrow("Invalid credentials");
    });
    it("login debería fallar si el password es incorrecto", async () => {
        User_1.UserModel.findOne.mockResolvedValue(mockUser);
        bcrypt_1.default.compare.mockResolvedValue(false);
        await expect(user_service_1.userService.login({ email: "test@test.com", password: "wrong" })).rejects.toThrow("Invalid credentials");
    });
});
//# sourceMappingURL=user.service.test.js.map