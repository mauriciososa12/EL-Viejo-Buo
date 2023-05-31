import "express-session";
import "express";
import { SessionUser } from "./interfaces";

declare module "express-session" {
  export interface SessionData {
    user?: SessionUser;
  }
}
declare global {
  namespace Express {
    export interface Request {
      user?: SessionUser;
      logger?: any;
    }
  }
}
