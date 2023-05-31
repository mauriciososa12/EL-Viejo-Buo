import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { SessionUser } from "../interface/interfaces";
dotenv.config();

export const generateToken = (user: SessionUser) => {
  const token = jwt.sign({ user }, process.env.JWT_SECRET!, {
    expiresIn: "24h",
  });

  return token;
};
