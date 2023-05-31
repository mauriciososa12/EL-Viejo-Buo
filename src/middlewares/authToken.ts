import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { SessionUser } from "../interface/interfaces";
dotenv.config();

export const authToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const signedJwt = req.headers["authorization"];

    if (!signedJwt) return;
    const payload = jwt.verify(
      signedJwt.split(" ")[1],
      process.env.JWT_SECRET!
    ) as SessionUser;

    req.user = payload;

    next();
  } catch (error) {
    return res.status(403).send({
      error: "Not Authorized from JWT",
    });
  }
};
