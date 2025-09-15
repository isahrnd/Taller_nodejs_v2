import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.header("Authorization");
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not Authorized" });
    }

    const token = header.replace("Bearer ", "");
    const secret = process.env.SECRET;
    if (!secret) {
      throw new Error("JWT secret not configured");
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    // Aquí puedes decidir qué guardar en la request
    req.user = decoded.user as Express.AuthUser; // Ej: { id, email, role }
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Not Authorized" });
  }
};
