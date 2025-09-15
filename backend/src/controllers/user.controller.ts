import { Request, Response } from "express";
import { userService } from "../services";
import { UserInput, UserInputUpdate, UserLogin } from "../interfaces";
import { UserDocument } from "../models";
import jwt from "jsonwebtoken";
import { Role } from "../models/User";

// Contexto con datos del usuario autenticado
const ctx = (req: Request) => {
  const u = req.user!;
  return { id: u.id, role: u.role as Role };
};

class UserController {
  // Registro
  async register(req: Request, res: Response) {
    try {
      const newUser: UserDocument = await userService.create(req.body as UserInput);
      res.status(201).json(newUser);
    } catch (e: any) {
      res.status(e.status || 500).json({ message: e.message || "Server error" });
    }
  }

  // Login
  async login(req: Request, res: Response) {
  try {
    const userLogin = req.body as UserLogin;
    const { user, accessToken, refreshToken } = await userService.login(userLogin);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({ accessToken, refreshToken, user });
  } catch (e: any) {
    return res.status(e.status || 500).json({ message: e.message || "Server error" });
  }
}


  // Logout
  async logout(req: Request, res: Response) {
    try {
      res.status(200).json({ message: "Logged out successfully" });
    } catch (e: any) {
      res.status(e.status || 500).json({ message: e.message || "Server error" });
    }
  }

  // Perfil
  async getProfile(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      res.status(200).json(req.user);
    } catch (e: any) {
      res.status(e.status || 500).json({ message: e.message || "Server error" });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });

      const updated = await userService.update(req.user.id, req.body as UserInputUpdate, ctx(req));
      res.status(200).json(updated);
    } catch (e: any) {
      res.status(e.status || 500).json({ message: e.message || "Server error" });
    }
  }

  // Admin
  async listUsers(req: Request, res: Response) {
    try {
      const users = await userService.list(ctx(req));
      res.status(200).json(users);
    } catch (e: any) {
      res.status(e.status || 500).json({ message: e.message || "Server error" });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const newUser = await userService.create(req.body as UserInput);
      res.status(201).json(newUser);
    } catch (e: any) {
      res.status(e.status || 500).json({ message: e.message || "Server error" });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updated = await userService.update(id, req.body as UserInputUpdate, ctx(req));
      if (!updated) return res.status(404).json({ message: "User not found" });
      res.status(200).json(updated);
    } catch (e: any) {
      res.status(e.status || 500).json({ message: e.message || "Server error" });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const deleted = await userService.remove(id, ctx(req));
      if (!deleted) return res.status(404).json({ message: "User not found" });
      res.status(200).json({ message: "User deleted successfully" });
    } catch (e: any) {
      res.status(e.status || 500).json({ message: e.message || "Server error" });
    }
  }
}

export const userController = new UserController();
