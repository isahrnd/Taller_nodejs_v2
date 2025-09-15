import {number, object, string} from 'zod'; 

export const  serviceSchema: any =  object({
    name: string({error: "Name is required"}),
    durationMin: number({error: "Duration is required"}),
    price: number({error: "Price is required"}),
    status: string({error: "Status is required"})
});