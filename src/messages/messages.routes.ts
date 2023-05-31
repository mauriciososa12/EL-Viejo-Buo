import express from "express";
import { getChatPage } from "./messages.controller";

const Router = express.Router();

Router.get("/", getChatPage);

export default Router;
