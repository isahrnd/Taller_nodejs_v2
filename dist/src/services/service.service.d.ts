import { ServiceInput } from "../interfaces";
import { ServiceDocument } from "../models";
declare class ServiceService {
    create(serviceInput: ServiceInput): Promise<ServiceDocument>;
    findByName(name: string): Promise<ServiceDocument | null>;
    getAll(): Promise<ServiceDocument[]>;
    delete(id: string): Promise<ServiceDocument | null>;
    update(id: string, serviceInput: ServiceInput): Promise<ServiceDocument | null>;
    getById(id: string): Promise<ServiceDocument | null>;
}
export declare const serviceService: ServiceService;
export {};
