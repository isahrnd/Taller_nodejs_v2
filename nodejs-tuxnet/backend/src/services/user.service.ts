import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { UserInput, UserInputUpdate, UserLogin } from "../interfaces";
import { UserModel, UserDocument } from "../models/User"; // modelo e interfaz

type Role = "admin" | "stylist" | "client";
type UserCtx = { id: string; role: Role };

export class UserService {
  // Crear usuario (registro o admin)
  async create(data: UserInput): Promise<UserDocument> {
    const exists = await UserModel.findOne({ email: data.email });
    if (exists) {
      throw Object.assign(new Error("User already exists"), { status: 400 });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const created = await UserModel.create({
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role ?? "client",
      status: "active",
    });

    return created;
  }

  // Listar todos (solo admin)
  async list(user: UserCtx): Promise<UserDocument[]> {
    if (user.role !== "admin") {
      throw Object.assign(new Error("Forbidden"), { status: 403 });
    }
    return UserModel.find();
  }

  // Obtener un usuario
  async getOne(id: string, user: UserCtx): Promise<UserDocument | null> {
    const u = await UserModel.findById(id);
    if (!u) return null;

    const isSelf = String(u._id) === user.id;
    if (user.role !== "admin" && !isSelf) {
      throw Object.assign(new Error("Forbidden"), { status: 403 });
    }
    return u;
  }

  // Actualizar perfil o admin
  async update(id: string, data: UserInputUpdate, user: UserCtx): Promise<UserDocument | null> {
    const u = await UserModel.findById(id);
    if (!u) return null;

    const isSelf = String(u._id) === user.id;
    if (user.role !== "admin" && !isSelf) {
      throw Object.assign(new Error("Forbidden"), { status: 403 });
    }

    if (data.password) {
      (data as any).passwordHash = await bcrypt.hash(data.password, 10);
      delete (data as any).password;
    }

    const updated = await UserModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    return updated;
  }

  // Eliminar usuario (solo admin o uno mismo)
  async remove(id: string, user: UserCtx): Promise<boolean> {
    const u = await UserModel.findById(id);
    if (!u) return false;

    const isSelf = String(u._id) === user.id;
    if (user.role !== "admin" && !isSelf) {
      throw Object.assign(new Error("Forbidden"), { status: 403 });
    }

    const res = await UserModel.deleteOne({ _id: new Types.ObjectId(id) });
    return res.deletedCount === 1;
  }

  // Login
  async login(data: UserLogin): Promise<{ user: UserDocument; accessToken: string; refreshToken: string }> {
    const u = await UserModel.findOne({ email: data.email });
    if (!u) {
      throw Object.assign(new Error("Invalid credentials"), { status: 401 });
    }

    const ok = await bcrypt.compare(data.password, u.passwordHash);
    if (!ok) {
      throw Object.assign(new Error("Invalid credentials"), { status: 401 });
    }

    const accessToken = jwt.sign(
      { user: { id: u._id, role: u.role } }, 
      process.env.SECRET!,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { sub: u._id },
      process.env.REFRESH_SECRET!,
      { expiresIn: "7d" }
    );

    return { user: u, accessToken, refreshToken };
  }
}

export const userService = new UserService();
