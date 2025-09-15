
import { appointmentRouter } from "./appointment.routes";
import { serviceRouter } from "./service.routes";
import { userRouter } from "./user.routes";
import express, {Request, Response} from "express";
import { validateSchema, auth } from "../middlewares";

export const apiRouter = express.Router();

apiRouter.use("/appointments", appointmentRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/services", serviceRouter);


