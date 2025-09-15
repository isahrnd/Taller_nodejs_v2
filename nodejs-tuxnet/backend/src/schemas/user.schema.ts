import { object, string } from "zod";

export const userSchema = {
  register: object({
    name: string().min(1, "Name is required"),
    email: string().email("Not a valid email address"),
    password: string().min(8, "Password must be at least 8 characters long"),
  }),

  login: object({
    email: string().email("Not a valid email address"),
    password: string().min(8, "Password must be at least 8 characters long"),
  }),

  updateProfile: object({
    name: string().optional(),
    email: string().email("Not a valid email address").optional(),
  }),

  createUser: object({
    name: string().min(1),
    email: string().email(),
    password: string().min(8),
    role: string().optional(),
  }),

  updateUser: object({
    name: string().optional(),
    email: string().email().optional(),
    role: string().optional(),
    status: string().optional(),
  }),
};
