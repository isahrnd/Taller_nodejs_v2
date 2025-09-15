import express from "express";
import { serviceController } from "../controllers";
import { auth, validateSchema } from "../middlewares";
import { serviceSchema } from "../schemas";

// GET /services
// POST /admin/services (admin)
// PATCH /admin/services/:id
// GET /availability?serviceId&staffId&date — calcular huecos libres
// POST /appointments (cliente)
// PATCH /appointments/:id (reprogramar/cancelar)
// GET /agenda?view=day|week&staffId (estilista/admin)
// POST /appointments/:id/attend (estilista marca atendida)


export const serviceRouter = express.Router();

serviceRouter.get("/", serviceController.getAll);
serviceRouter.get("/:id", serviceController.getOne);
serviceRouter.post("/", validateSchema(serviceSchema), serviceController.create);
serviceRouter.put("/:id", validateSchema(serviceSchema), serviceController.update);
serviceRouter.delete("/:id", serviceController.delete);
