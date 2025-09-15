import { Request, Response } from "express";
declare class AppointmentController {
    create(req: Request, res: Response): Promise<void>;
    list(req: Request, res: Response): Promise<void>;
    getOne(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    remove(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const appointmentController: AppointmentController;
export {};
