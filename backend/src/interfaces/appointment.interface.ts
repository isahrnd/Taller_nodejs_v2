export type AppointmentStatus = 
    | "SCHEDULED"
    | "RESCHEDULED"
    | "CANCELLED"
    | "DONE";

// Que datos necesitamos para crear una cita
export interface AppointmentInput{
    client_id: string;
    staff_id: string;
    service_id: string;
    start_at: string;
    end_at: string;
    notes?:string;
}

// Que datos se puede actualizar en una cita
export interface AppointmentUpdateInput {
    start_at?: string;
    end_at?: string;
    status?: AppointmentStatus;
    paid_flag?: boolean;
    notes?: string;
}