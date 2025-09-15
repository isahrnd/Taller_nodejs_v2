import { userService } from "../../src/services/user.service";
import { UserModel } from "../../src/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
    (UserModel.create as jest.Mock).mockResolvedValue({ ...mockUser, passwordHash: "hashedPassword" });

    const result = await userService.create({
      name: "Test",
      email: "test@test.com",
      password: "12345678",
    });

    expect(UserModel.findOne).toHaveBeenCalledWith({ email: "test@test.com" });
    expect(UserModel.create).toHaveBeenCalled();
    expect(result.passwordHash).toBe("hashedPassword");
  });

  it("no debería permitir crear un usuario duplicado", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);

    await expect(
      userService.create({ name: "X", email: "test@test.com", password: "12345678" })
    ).rejects.toThrow("User already exists");
  });

  // 🔹 LIST
  it("list debería devolver usuarios si es admin", async () => {
    (UserModel.find as jest.Mock).mockResolvedValue([mockUser]);

    const result = await userService.list({ id: "1", role: "admin" });

    expect(result).toEqual([mockUser]);
  });

  it("list debería fallar si no es admin", async () => {
    await expect(userService.list({ id: "1", role: "client" })).rejects.toThrow("Forbidden");
  });

  // 🔹 GETONE
  it("getOne debería devolver usuario propio", async () => {
    (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

    const result = await userService.getOne(mockUser._id, { id: mockUser._id, role: "client" });

    expect(result).toEqual(mockUser);
  });

  it("getOne debería lanzar Forbidden si no es admin ni self", async () => {
    (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

    await expect(userService.getOne(mockUser._id, { id: "other", role: "client" })).rejects.toThrow("Forbidden");
  });

  it("getOne debería devolver null si no existe", async () => {
    (UserModel.findById as jest.Mock).mockResolvedValue(null);

    const result = await userService.getOne("invalid", { id: "1", role: "admin" });
    expect(result).toBeNull();
  });

  // 🔹 UPDATE
  it("update debería permitir al usuario actualizar su perfil", async () => {
    (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);
    (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({ ...mockUser, name: "Updated" });

    const result = await userService.update(mockUser._id, { name: "Updated" }, { id: mockUser._id, role: "client" });

    expect(result?.name).toBe("Updated");
  });

  it("update debería lanzar Forbidden si no tiene permiso", async () => {
    (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

    await expect(userService.update(mockUser._id, { name: "X" }, { id: "other", role: "client" }))
      .rejects.toThrow("Forbidden");
  });

  it("update debería devolver null si el usuario no existe", async () => {
    (UserModel.findById as jest.Mock).mockResolvedValue(null);

    const result = await userService.update("invalid", { name: "X" }, { id: "1", role: "admin" });
    expect(result).toBeNull();
  });

  it("update debería actualizar password correctamente", async () => {
    (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.hash as jest.Mock).mockResolvedValue("newHashed");
    (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({ ...mockUser, passwordHash: "newHashed" });

    const result = await userService.update(
      mockUser._id,
      { password: "newPassword" } as any,
      { id: mockUser._id, role: "client" }
    );

    expect(result?.passwordHash).toBe("newHashed");
  });

  // 🔹 REMOVE
  it("remove debería eliminar si es admin", async () => {
    (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);
    (UserModel.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 });

    const result = await userService.remove(mockUser._id, { id: "admin", role: "admin" });
    expect(result).toBe(true);
  });

  it("remove debería lanzar Forbidden si no es admin ni self", async () => {
    (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

    await expect(userService.remove(mockUser._id, { id: "other", role: "client" })).rejects.toThrow("Forbidden");
  });

  it("remove debería devolver false si no existe", async () => {
    (UserModel.findById as jest.Mock).mockResolvedValue(null);

    const result = await userService.remove("invalid", { id: "1", role: "admin" });
    expect(result).toBe(false);
  });

  // 🔹 LOGIN
  it("login debería autenticar correctamente", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("token");

    const result = await userService.login({ email: "test@test.com", password: "12345678" });

    expect(result.user.email).toBe("test@test.com");
    expect(result.accessToken).toBe("token");
    expect(result.refreshToken).toBe("token");
  });

  it("login debería fallar si el usuario no existe", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);

    await expect(userService.login({ email: "x@test.com", password: "1234" })).rejects.toThrow("Invalid credentials");
  });

  it("login debería fallar si el password es incorrecto", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(userService.login({ email: "test@test.com", password: "wrong" })).rejects.toThrow("Invalid credentials");
  });
});
