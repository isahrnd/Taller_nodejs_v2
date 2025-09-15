import { Request, Response } from "express";
declare class ServiceController {
    create(req: Request, res: Response): Promise<void>;
    getAll(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    getOne(req: Request, res: Response): Promise<void>;
}
export declare const serviceController: ServiceController;
export {};
