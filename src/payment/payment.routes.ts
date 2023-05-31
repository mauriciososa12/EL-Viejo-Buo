import { Router } from "express";
import PaymentController from "./payment.controller";
import { authToken } from "../middlewares/authToken";

const router = Router();

router.post(
  "/client-payment-intent",
  authToken,
  PaymentController.createPayment
);

export default router;
