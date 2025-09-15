import jwt from "jsonwebtoken";
import { ServiceInput } from "../interfaces";
import { ServiceDocument, ServiceModel } from "../models";

class ServiceService {

    public async create(serviceInput: ServiceInput): Promise<ServiceDocument>{

        process.loadEnvFile();

        const serviceExists: ServiceDocument | null = await this.findByName(serviceInput.name); 
        if (serviceExists !== null){
            throw new ReferenceError("Service already exists"); 
        }
    
        return ServiceModel.create(serviceInput);
    }


     public findByName(name: string): Promise<ServiceDocument | null> {

        return ServiceModel.findOne({name});
    }

    public getAll(): Promise<ServiceDocument[]> {

        return ServiceModel.find();
    }


    public async delete(id: string): Promise<ServiceDocument | null>{
        try {
            const service: ServiceDocument | null = await ServiceModel.findOneAndDelete(
               {_id: id}
         );
           return service; 
        } catch (error) {
               throw error;
         }
    } 

    public async update(id: string, serviceInput: ServiceInput): Promise<ServiceDocument | null>{
        try {
            const service: ServiceDocument | null = await ServiceModel.findOneAndUpdate(
                {_id: id}, 
                serviceInput, 
                {returnOriginal: false}
            );
            return service; 
        } catch (error) {
            throw error;
        }
    }

     public getById(id: string): Promise<ServiceDocument | null>{
            return ServiceModel.findById(id);
        }

    



}

export const serviceService = new ServiceService();