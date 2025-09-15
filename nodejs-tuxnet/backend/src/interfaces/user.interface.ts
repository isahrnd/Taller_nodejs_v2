import { Role } from "../models/User"; // Usa el mismo tipo definido en tu modelo

// Para registrar un usuario
export interface UserInput { 
  name: string;
  email: string;
  password: string;
  role?: Role; // opcional, por defecto será "client"
  status?: "active" | "inactive"; // opcional, se asigna "active" al crear
}

// Para actualizar un usuario existente
export interface UserInputUpdate {
  name?: string;
  email?: string;
  password?: string; // opcional: si quieres que pueda actualizar la contraseña
  role?: Role;
  status?: "active" | "inactive";
}

// Para login
export interface UserLogin {
  email: string;
  password: string;
}
