import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";

export const validateSchema = (schema: ZodObject<any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync(req.body);
            next()
        } catch (error) {
            res.status(400).json(error);
        }
    }
}