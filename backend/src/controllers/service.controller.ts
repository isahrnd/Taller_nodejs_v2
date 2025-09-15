import { Request, Response } from "express";
import {  } from "../models";
import { ServiceDocument } from "../models/Service";
import { serviceService } from "../services";
import { ServiceInput } from "../interfaces";
import mongoose from "mongoose";

class ServiceController {


    public async create(req: Request, res: Response){
        try {
            const newService: ServiceDocument = await serviceService.create(req.body as ServiceInput); 
            res.status(201).json(newService);
        } catch (error) {
            if(error instanceof ReferenceError){
                res.status(400).json({message: "Service already exists"}); 
                return;
            } else {
                res.status(500).json(error);
                return;
            }

            res.status(500).json(error);
        }

    }


    public async getAll(req: Request, res: Response){
        try {
            const services: ServiceDocument[] = await serviceService.getAll(); 
            res.status(200).json(services);            
        } catch (error) {                
            res.status(500).json(error);            
        }

    }

     public async delete(req: Request, res: Response){
            try {
                const id: string = req.params.id || "";
                const service: ServiceDocument | null =  await serviceService.delete(id); 
                if(service === null){
                    res.status(404).json({message: `Service with id ${id} not found`});
                    return;
                }
                res.json({service, message:"Service deleted successfully" });
            } catch (error) {
                res.status(500).json(error);
            }
        }



        public async  update(req: Request, res: Response){
                try {
                    const id: string = req.params.id || "";
                    const service: ServiceDocument | null =  await serviceService.update(id, req.body as ServiceInput); 
                    if(service === null){
                        res.status(404).json({message: `Service with id ${id} not found`});
                        return;
                    }
                    res.json(service);
                } catch (error) {
                    res.status(500).json(error);
                }
            }

         public async getOne(req: Request, res: Response){
                try {
                    const id: string = req.params.id || "";
                    const service: ServiceDocument | null =  await serviceService.getById(id); 
                    if(service === null){
                        res.status(404).json({message: `Service with id ${id} not found`});
                        return;
                    }
                    res.json(service);
                } catch (error) {
                    res.status(500).json(error);
                }        
            }


    

}

export const serviceController = new ServiceController();