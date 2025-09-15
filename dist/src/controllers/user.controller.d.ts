import { Request, Response } from "express";
declare class UserController {
    register(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    logout(req: Request, res: Response): Promise<void>;
    getProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    listUsers(req: Request, res: Response): Promise<void>;
    createUser(req: Request, res: Response): Promise<void>;
    updateUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const userController: UserController;
export {};
