// src/types/express.d.ts
import "express";

declare global {
  namespace Express {
    type Role = "admin" | "stylist" | "client";

    interface AuthUser {
      id: string;
      role: Role;
      email?: string;
    }

    interface Request {
      user?: AuthUser;
    }
  }
}

// Necesario para que sea tratado como módulo
export {};
