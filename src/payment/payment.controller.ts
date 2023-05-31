import { Request, Response } from "express";
import PaymentService from "./payment.services";

class PaymentsControllers {
  createPayment = async (req: Request, res: Response) => {
    try {
      const { total } = req.body;

      const paymentInfo = {
        amount: total,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      };

      const clientSecret = await PaymentService.createPayment(paymentInfo);

      return res.status(200).send({ payload: clientSecret });
    } catch (error) {
      req.logger.error(error);

      res.status(400).send();
    }
  };
}

const PaymentController = new PaymentsControllers();

export default PaymentController;
