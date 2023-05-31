import { Request, Response } from "express";
import UserService from "./users.services";
import dotenv from "dotenv";
import UserDto from "./dto/user.dto";
import { UserSession } from "../interface/interfaces";
dotenv.config();

class UserControllers {
  getAll = async (req: Request, res: Response) => {
    try {
      const users = await UserService.finAll();

      return res.status(200).send({ payload: users });
    } catch (error) {
      req.logger.error(error);

      return res.status(400).send({ message: "SOMETHING WENT WRONG" });
    }
  };

  getCurrent = (req: Request, res: Response) => {
    try {
      const sessionUser = { ...req.user } as UserSession;

      if (!sessionUser)
        return res.status(404).send({ message: "User Not Found" });

      const user = new UserDto(sessionUser.user._doc);

      return res.status(200).send(user);
    } catch (error) {
      req.logger.error(error);

      return res.status(404).send({ message: "SOMETHING WENT WRONG" });
    }
  };

  registerOne = (req: Request, res: Response) => {
    if (!req.user) return res.status(400);

    return res.status(200).send({ paylaod: req.user });
  };

  changeRole = async (req: Request, res: Response) => {
    try {
      const { uid } = req.params;

      await UserService.changeRole(uid);

      return res.status(200).send({
        message: "User succesfully changed role",
      });
    } catch (error: any) {
      req.logger.error(error);

      return res.status(404).send({ message: "SOMETHING WENT WRONG" });
    }
  };

  sendRestoreMail = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      await UserService.sendRestoreMail(email);

      return res.status(200).send();
    } catch (error) {
      req.logger.error(error);

      return res.status(404).send({ message: "SOMETHING WENT WRONG" });
    }
  };

  restorePassword = async (req: Request, res: Response) => {
    try {
      const { password } = req.body;
      const { uid, token } = req.params;

      await UserService.restorePassword(uid, password, token);

      return res.status(200).send();
    } catch (error) {
      req.logger.error(error);

      return res.status(404).send({ message: "SOMETHING WENT WRONG" });
    }
  };

  uploadDocument = async (req: Request, res: Response) => {
    try {
      const { uid } = req.params;

      if (!req.files)
        return res.status(404).send({ message: "SOMETHING WENT WRONG" });

      const filesValues = Object.values(req.files);

      filesValues.map(async (arrayOfFiles: Express.Multer.File[]) => {
        return arrayOfFiles.map(async (file: Express.Multer.File) => {
          const newDocument = {
            name: file.originalname,
            reference: file.path,
          };

          await UserService.updateUpload(uid, newDocument);

          return;
        });
      });

      return res.status(200).send({
        message: `Document succesfully upload`,
      });
    } catch (error) {
      req.logger.error(error);

      return res.status(404).send({ message: "SOMETHING WENT WRONG" });
    }
  };

  deleteAllUsers = async (req: Request, res: Response) => {
    try {
      await UserService.deleteAll();

      return res.status(200).send({ message: "ALL UNUSED USERS DELETED" });
    } catch (error) {
      req.logger.error(error);

      return res.status(400).send({ message: "SOMETHING WENT WRONG " });
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      const { uid } = req.params;

      await UserService.deleteOne(uid);

      return res.status(200).send({ message: "USER DELETED" });
    } catch (error) {
      req.logger.error(error);

      return res.status(400).send({ message: "SOMETHING WENT WRONG " });
    }
  };
}

const UserController = new UserControllers();

export default UserController;
