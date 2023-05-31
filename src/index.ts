import express, { Router } from "express";
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
//routers
import Routers from "./utils/routers";
//utils
import socket from "./utils/socket";
import initSwagger from "./utils/swagger";
import { errorHandler } from "./middlewares/errors/index";
import { addLogger } from "./utils/logger";
//conections
import MongoConnection, { MongoStoreInstance } from "./utils/mongo";
import swaggerUiExpress from "swagger-ui-express";
import { jwtStrategy, localStrategy } from "./auth/strategies/index";
//const and env variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

//mongoDb init
MongoConnection.getInstance();

//passport strategies init
jwtStrategy();
localStrategy();

//handlebars
app.engine("handlebars", engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");

//middlewares
app.use(cors());
app.use(session(MongoStoreInstance));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(errorHandler);
app.use(addLogger);
app.use(express.static("./src/public"));

//routers
app.use("/auth", Routers.authRouter);
app.use("/api/users", Routers.sessionRouter);
app.use("/api/products", Routers.productsRouter);
app.use("/api/carts", Routers.cartRouter);
app.use("/api/payment", Routers.paymentRouter);
app.use("/chat", Routers.chatRouter);
app.use("/mocks", Routers.productsMockRouter);
app.use("/loggerTest", Routers.loggerRouter);
app.use(
  "/api/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(initSwagger())
);

//app.listen
const httpServer = app.listen(PORT, () => {
  console.log("Server up!");
});

//socket
const io = new Server(httpServer);
socket(io);
