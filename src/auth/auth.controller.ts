import AuthService from "./auth.service";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { SessionUser } from "../interface/interfaces";
dotenv.config();

class AuthControllers {
  async loginCtrl(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(400);

      const user = req.user as SessionUser;

      const loggedUser = await AuthService.login(user);

      if (!loggedUser)
        return res.status(404).send({ message: "User not found" });

      req.session.user = loggedUser;

      res.status(200).send(loggedUser);
    } catch (error) {
      req.logger.error(error);

      return res.status(400).send();
    }
  }
}

const AuthController = new AuthControllers();

export default AuthController;