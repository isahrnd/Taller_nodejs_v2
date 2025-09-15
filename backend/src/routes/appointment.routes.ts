// GET /services
// POST /admin/services (admin)
// PATCH /admin/services/:id
// GET /availability?serviceId&staffId&date — calcular huecos libres
// POST /appointments (cliente)
// PATCH /appointments/:id (reprogramar/cancelar)
// GET /agenda?view=day|week&staffId (estilista/admin)
// POST /appointments/:id/attend (estilista marca atendida)

import express from "express";
import { auth, validateSchema } from "../middlewares";
import { appointmentController } from "../controllers";
import { appointmentSchema } from "../schemas";

export const appointmentRouter = express.Router();

// Create
appointmentRouter.post(
  "/",
  auth,
  validateSchema(appointmentSchema.create),
  (req, res) => appointmentController.create(req, res)
);

// List with optional filters
appointmentRouter.get("/", auth, (req, res) => appointmentController.list(req, res));

// Get one
appointmentRouter.get("/:id", auth, (req, res) => appointmentController.getOne(req, res));

// Update
appointmentRouter.patch(
  "/:id",
  auth,
  validateSchema(appointmentSchema.update),
  (req, res) => appointmentController.update(req, res)
);

// Remove
appointmentRouter.delete("/:id", auth, (req, res) => appointmentController.remove(req, res));
