"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("../../src/controllers/user.controller");
const user_service_1 = require("../../src/services/user.service");
jest.mock("../services/user.service");
// helpers para mockear res
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
describe("UserController", () => {
    let req;
    let res;
    beforeEach(() => {
        jest.clearAllMocks();
        req = {};
        res = mockResponse();
    });
    // register
    it("register debería crear un usuario", async () => {
        user_service_1.userService.create.mockResolvedValue({ email: "test@test.com" });
        req.body = { name: "Test", email: "test@test.com", password: "1234" };
        await user_controller_1.userController.register(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ email: "test@test.com" });
    });
    // login OK
    it("login debería autenticar", async () => {
        user_service_1.userService.login.mockResolvedValue({
            user: { id: "1", email: "login@test.com" },
            accessToken: "fakeAccess",
            refreshToken: "fakeRefresh",
        });
        req.body = { email: "login@test.com", password: "1234" };
        await user_controller_1.userController.login(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            user: { id: "1", email: "login@test.com" },
            accessToken: "fakeAccess",
            refreshToken: "fakeRefresh",
        });
    });
    // login inválido
    it("login debería rechazar credenciales inválidas", async () => {
        user_service_1.userService.login.mockResolvedValue({ user: null });
        req.body = { email: "bad@test.com", password: "wrong" };
        await user_controller_1.userController.login(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
    });
    // logout
    it("logout debería responder success", async () => {
        await user_controller_1.userController.logout(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Logged out successfully" });
    });
    // getProfile autorizado
    it("getProfile debería devolver el usuario autenticado", async () => {
        req.user = { id: "1", email: "test@test.com", role: "client" };
        await user_controller_1.userController.getProfile(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(req.user);
    });
    // getProfile no autorizado
    it("getProfile debería rechazar si no hay usuario", async () => {
        await user_controller_1.userController.getProfile(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    });
    // updateProfile
    it("updateProfile debería actualizar usuario", async () => {
        req.user = { id: "1", role: "client" };
        req.body = { name: "Updated" };
        user_service_1.userService.update.mockResolvedValue({ id: "1", name: "Updated" });
        await user_controller_1.userController.updateProfile(req, res);
        expect(user_service_1.userService.update).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ id: "1", name: "Updated" });
    });
    // listUsers
    it("listUsers debería devolver lista", async () => {
        req.user = { id: "1", role: "admin" };
        user_service_1.userService.list.mockResolvedValue([{ id: "1" }]);
        await user_controller_1.userController.listUsers(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ id: "1" }]);
    });
    // createUser
    it("createUser debería crear admin user", async () => {
        req.body = { name: "New", email: "new@test.com", password: "1234" };
        user_service_1.userService.create.mockResolvedValue({ email: "new@test.com" });
        await user_controller_1.userController.createUser(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ email: "new@test.com" });
    });
    // updateUser OK
    it("updateUser debería actualizar usuario existente", async () => {
        req.params = { id: "1" };
        req.user = { id: "admin", role: "admin" };
        req.body = { name: "Updated" };
        user_service_1.userService.update.mockResolvedValue({ id: "1", name: "Updated" });
        await user_controller_1.userController.updateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ id: "1", name: "Updated" });
    });
    // updateUser Not Found
    it("updateUser debería responder 404 si no existe", async () => {
        req.params = { id: "2" };
        req.user = { id: "admin", role: "admin" };
        user_service_1.userService.update.mockResolvedValue(null);
        await user_controller_1.userController.updateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });
    // deleteUser OK
    it("deleteUser debería eliminar usuario", async () => {
        req.params = { id: "1" };
        req.user = { id: "admin", role: "admin" };
        user_service_1.userService.remove.mockResolvedValue(true);
        await user_controller_1.userController.deleteUser(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "User deleted successfully" });
    });
    // deleteUser Not Found
    it("deleteUser debería responder 404 si no existe", async () => {
        req.params = { id: "2" };
        req.user = { id: "admin", role: "admin" };
        user_service_1.userService.remove.mockResolvedValue(false);
        await user_controller_1.userController.deleteUser(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });
});
//# sourceMappingURL=user.controller.test.js.map