import express from 'express';
import { authMock } from '../mocks/middlewares/auth.mock';
import { validateSchema } from '../../src/middlewares/validateSchema.middleware';
import { appointmentSchema } from '../../src/schemas/appointment.schema';
import { appointmentController } from '../../src/controllers';

export const buildTestApp = () => {
  const app = express();
  app.use(express.json());

  const router = express.Router();
  // Create
  router.post(
    '/appointments',
    authMock,
    validateSchema(appointmentSchema.create),
    (req, res) => appointmentController.create(req, res)
  );

  // List
  router.get('/appointments', authMock, (req, res) => appointmentController.list(req, res));

  // Get one
  router.get('/appointments/:id', authMock, (req, res) => appointmentController.getOne(req, res));

  // Update
  router.patch(
    '/appointments/:id',
    authMock,
    validateSchema(appointmentSchema.update),
    (req, res) => appointmentController.update(req, res)
  );

  // Remove
  router.delete('/appointments/:id', authMock, (req, res) => appointmentController.remove(req, res));

  app.use('/', router);
  return app;
};
