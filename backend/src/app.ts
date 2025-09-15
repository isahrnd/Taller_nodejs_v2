import express from "express";
import { userRouter } from "./routes/user.routes";

const app = express();

// Middleware global
app.use(express.json());

// Rutas
app.use("/users", userRouter); // 👈 todas tus rutas estarán bajo /users

// Manejo de errores genérico (opcional)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});

export default app;
