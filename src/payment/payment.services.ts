import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

class PaymentsServices {
  private readonly stripe;
  private readonly secretKey = process.env.STRIPE_SECRET || "";

  constructor() {
    this.stripe = new Stripe(this.secretKey, { apiVersion: "2022-11-15" });
  }
  createPayment = async (info: { amount: number; currency: string }) => {
    const paymentIntent = await this.stripe.paymentIntents.create(info);

    return { client_secret: paymentIntent.client_secret };
  };
}

const PaymentService = new PaymentsServices();

export default PaymentService;
