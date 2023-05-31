import productsRouter from "../products/products.routes";
import cartRouter from "../carts/carts.routes";
import chatRouter from "../messages/messages.routes";
import sessionRouter from "../users/users.routes";
import productsMockRouter from "../mocks/productsMock.routes";
import loggerRouter from "../logger/logger.routes";
import authRouter from "../auth/auth.routes";
import paymentRouter from "../payment/payment.routes";

const Routers = {
  productsRouter,
  cartRouter,
  chatRouter,
  sessionRouter,
  productsMockRouter,
  loggerRouter,
  authRouter,
  paymentRouter,
};

export default Routers;
