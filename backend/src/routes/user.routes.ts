import express from "express";
import { userController } from "../controllers";
import { validateSchema, auth } from "../middlewares";
import { userSchema } from "../schemas";

// Middleware para validar roles
const requireRole = (role: "admin" | "stylist" | "client") => {
  return (req: any, res: any, next: any) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }
    next();
  };
};
export const userRouter = express.Router();

// Auth
userRouter.post(
  "/auth/register",
  validateSchema(userSchema.register),
  userController.register
);
userRouter.post(
  "/auth/login",
  validateSchema(userSchema.login),
  userController.login
);
userRouter.post("/auth/logout", auth, userController.logout);

// Perfil
userRouter.get("/me", auth, userController.getProfile);
userRouter.patch(
  "/me",
  auth,
  validateSchema(userSchema.updateProfile),
  userController.updateProfile
);

//Administración (solo admin)
userRouter.get(
  "/admin/users",
  auth,
  requireRole("admin"),
  userController.listUsers
);
userRouter.post(
  "/admin/users",
  auth,
  requireRole("admin"),
  validateSchema(userSchema.createUser),
  userController.createUser
);
userRouter.patch(
  "/admin/users/:id",
  auth,
  requireRole("admin"),
  validateSchema(userSchema.updateUser),
  userController.updateUser
);
userRouter.delete(
  "/admin/users/:id",
  auth,
  requireRole("admin"),
  userController.deleteUser
);
