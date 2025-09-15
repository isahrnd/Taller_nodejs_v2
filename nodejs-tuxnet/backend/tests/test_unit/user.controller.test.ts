import { userController } from "../../src/controllers/user.controller";
import { userService } from "../../src/services/user.service";
import { Request, Response } from "express";

jest.mock("../services/user.service");

// helpers para mockear res
const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe("UserController", () => {
  let req: Partial<Request>;
  let res: Response;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {};
    res = mockResponse();
  });

  // register
  it("register debería crear un usuario", async () => {
    (userService.create as jest.Mock).mockResolvedValue({ email: "test@test.com" });
    req.body = { name: "Test", email: "test@test.com", password: "1234" };

    await userController.register(req as Request, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ email: "test@test.com" });
  });

  // login OK
  it("login debería autenticar", async () => {
    (userService.login as jest.Mock).mockResolvedValue({
      user: { id: "1", email: "login@test.com" },
      accessToken: "fakeAccess",
      refreshToken: "fakeRefresh",
    });
    req.body = { email: "login@test.com", password: "1234" };

    await userController.login(req as Request, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      user: { id: "1", email: "login@test.com" },
      accessToken: "fakeAccess",
      refreshToken: "fakeRefresh",
    });
  });

  // login inválido
  it("login debería rechazar credenciales inválidas", async () => {
    (userService.login as jest.Mock).mockResolvedValue({ user: null });
    req.body = { email: "bad@test.com", password: "wrong" };

    await userController.login(req as Request, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
  });

  // logout
  it("logout debería responder success", async () => {
    await userController.logout(req as Request, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Logged out successfully" });
  });

  // getProfile autorizado
  it("getProfile debería devolver el usuario autenticado", async () => {
    req.user = { id: "1", email: "test@test.com", role: "client" } as any;

    await userController.getProfile(req as Request, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(req.user);
  });

  // getProfile no autorizado
  it("getProfile debería rechazar si no hay usuario", async () => {
    await userController.getProfile(req as Request, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
  });

  // updateProfile
  it("updateProfile debería actualizar usuario", async () => {
    req.user = { id: "1", role: "client" } as any;
    req.body = { name: "Updated" };
    (userService.update as jest.Mock).mockResolvedValue({ id: "1", name: "Updated" });

    await userController.updateProfile(req as Request, res);

    expect(userService.update).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: "1", name: "Updated" });
  });

  // listUsers
  it("listUsers debería devolver lista", async () => {
    req.user = { id: "1", role: "admin" } as any;
    (userService.list as jest.Mock).mockResolvedValue([{ id: "1" }]);

    await userController.listUsers(req as Request, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: "1" }]);
  });

  // createUser
  it("createUser debería crear admin user", async () => {
    req.body = { name: "New", email: "new@test.com", password: "1234" };
    (userService.create as jest.Mock).mockResolvedValue({ email: "new@test.com" });

    await userController.createUser(req as Request, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ email: "new@test.com" });
  });

  // updateUser OK
  it("updateUser debería actualizar usuario existente", async () => {
    req.params = { id: "1" };
    req.user = { id: "admin", role: "admin" } as any;
    req.body = { name: "Updated" };
    (userService.update as jest.Mock).mockResolvedValue({ id: "1", name: "Updated" });

    await userController.updateUser(req as Request, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: "1", name: "Updated" });
  });

  // updateUser Not Found
  it("updateUser debería responder 404 si no existe", async () => {
    req.params = { id: "2" };
    req.user = { id: "admin", role: "admin" } as any;
    (userService.update as jest.Mock).mockResolvedValue(null);

    await userController.updateUser(req as Request, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  // deleteUser OK
  it("deleteUser debería eliminar usuario", async () => {
    req.params = { id: "1" };
    req.user = { id: "admin", role: "admin" } as any;
    (userService.remove as jest.Mock).mockResolvedValue(true);

    await userController.deleteUser(req as Request, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "User deleted successfully" });
  });

  // deleteUser Not Found
  it("deleteUser debería responder 404 si no existe", async () => {
    req.params = { id: "2" };
    req.user = { id: "admin", role: "admin" } as any;
    (userService.remove as jest.Mock).mockResolvedValue(false);

    await userController.deleteUser(req as Request, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });
});
