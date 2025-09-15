import { UserInput, UserInputUpdate, UserLogin } from "../interfaces";
import { UserDocument } from "../models/User";
type Role = "admin" | "stylist" | "client";
type UserCtx = {
    id: string;
    role: Role;
};
export declare class UserService {
    create(data: UserInput): Promise<UserDocument>;
    list(user: UserCtx): Promise<UserDocument[]>;
    getOne(id: string, user: UserCtx): Promise<UserDocument | null>;
    update(id: string, data: UserInputUpdate, user: UserCtx): Promise<UserDocument | null>;
    remove(id: string, user: UserCtx): Promise<boolean>;
    login(data: UserLogin): Promise<{
        user: UserDocument;
        accessToken: string;
        refreshToken: string;
    }>;
}
export declare const userService: UserService;
export {};
