import { Role } from "../models/User";
export interface UserInput {
    name: string;
    email: string;
    password: string;
    role?: Role;
    status?: "active" | "inactive";
}
export interface UserInputUpdate {
    name?: string;
    email?: string;
    password?: string;
    role?: Role;
    status?: "active" | "inactive";
}
export interface UserLogin {
    email: string;
    password: string;
}
