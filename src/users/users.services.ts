import CustomError from "../errors/customError";
import tokenModel from "../models/token.model";
import userModel from "../models/users.model";
import sendMail from "../utils/nodemailer";
import { v4 as uuidv4 } from "uuid";
import UserDto from "./dto/user.dto";
import {
  Document,
  User,
  ERRORS,
  ROLES,
  DOCUMENTS,
} from "../interface/interfaces";
import path from "path";
import UsersDto from "./dto/users.dto";

class UserServices {
  finAll = async () => {
    try {
      const users = await userModel.find().lean().exec();

      const mapedUsers = users.map((user) => new UsersDto(user));

      return mapedUsers;
    } catch (error: any) {
      CustomError.createError({
        name: error.name,
        message: error.message,
      });

      return;
    }
  };

  findOneByEmail = async (email: User["email"]) => {
    try {
      const user = await userModel.findOne({ email }).lean().exec();

      if (!user) {
        CustomError.createError({
          name: ERRORS.USER_NOT_FOUND,
          message: ERRORS.USER_NOT_FOUND,
        });

        return;
      }

      const userDto = new UserDto(user);

      return userDto;
    } catch (error: any) {
      CustomError.createError({
        name: error.name,
        message: error.message,
      });

      return;
    }
  };

  findOneById = async (uid: User["_id"]) => {
    try {
      const user = await userModel.findById({ _id: uid }).lean().exec();

      if (!user) {
        CustomError.createError({
          name: ERRORS.USER_NOT_FOUND,
          message: ERRORS.USER_NOT_FOUND,
        });
      }

      return user;
    } catch (error: any) {
      CustomError.createError({
        name: error.name,
        message: error.message,
      });

      return;
    }
  };

  changeRole = async (uid: User["_id"]) => {
    try {
      const user = await this.findOneById(uid);

      if (!user) {
        CustomError.createError({
          name: ERRORS.USER_NOT_FOUND,
          message: ERRORS.USER_NOT_FOUND,
        });

        return;
      }

      if (user?.role === ROLES.USER) {
        const userDocuments = user?.documents.map((document: Document) => {
          if (!document) {
            CustomError.createError({
              name: ERRORS.DOCUMENTS_NOT_FOUND_IN_DB,
              message: ERRORS.DOCUMENTS_NOT_FOUND_IN_DB,
            });

            return;
          }

          const result = path.parse(document.name).name;

          return result;
        });

        const arrayEnum = Object.values(DOCUMENTS) as string[];
        const verifyDocuments = userDocuments.every((document) =>
          arrayEnum.includes(document!)
        );

        if (!verifyDocuments) {
          CustomError.createError({
            name: ERRORS.DOCUMENTS_NOT_FOUND_IN_DB,
            message: `${DOCUMENTS.ACCOUNT_STATE}, ${DOCUMENTS.ADDRESS}, ${DOCUMENTS.ID}`,
          });

          return false;
        }
      }

      const result = await userModel.updateOne(
        { _id: uid },
        { role: user?.role === ROLES.USER ? ROLES.PREMIUM : ROLES.USER }
      );

      if (!result) return false;

      return true;
    } catch (error: any) {
      CustomError.createError({
        name: error.name,
        message: error.message,
      });

      return;
    }
  };

  sendRestoreMail = async (email: string) => {
    try {
      const user = await this.findOneByEmail(email);

      if (!user) {
        CustomError.createError({
          name: ERRORS.USER_NOT_FOUND,
          message: ERRORS.USER_NOT_FOUND,
        });

        return;
      }

      let token = await tokenModel.findOne({ userId: user?._id });

      if (!token) {
        token = await new tokenModel({
          userId: user._id,
          token: uuidv4(),
        }).save();
      }

      const link = `${process.env.NEXT_URL}/restoreForm/${user?._id}/${token.token}`;

      await sendMail.send(user.email, "Password reset", link);

      return true;
    } catch (error: any) {
      CustomError.createError({
        name: error.name,
        message: error.message,
      });

      return;
    }
  };

  restorePassword = async (
    uid: User["_id"],
    password: string,
    token: string
  ) => {
    try {
      const user = await this.findOneById(uid);

      if (!user) {
        CustomError.createError({
          name: ERRORS.USER_NOT_FOUND,
          message: ERRORS.USER_NOT_FOUND,
        });

        return;
      }

      const userToken = await this.findUserToken(uid, token);

      if (!userToken) {
        CustomError.createError({
          name: ERRORS.INVALID_OR_EXPIRED_TOKEN,
          message: ERRORS.INVALID_OR_EXPIRED_TOKEN,
        });

        return;
      }

      const verifyPassword = await userModel.comparePassword(
        password,
        user.password
      );

      if (verifyPassword) {
        CustomError.createError({
          name: ERRORS.CAN_NOT_USE_THE_LAST_PASSWORD,
          message: ERRORS.CAN_NOT_USE_THE_LAST_PASSWORD,
        });

        return;
      }

      const result = await userModel.updateOne(
        { _id: uid },
        { password: await userModel.encryptPassword(password) }
      );

      if (!result) {
        return false;
      }

      await this.deleteToken(uid);

      return true;
    } catch (error: any) {
      CustomError.createError({
        name: error.name,
        message: error.message,
      });

      return;
    }
  };

  findUserToken = async (uid: User["_id"], token: string) => {
    try {
      const userToken = await tokenModel.findOne({ userId: uid });

      return userToken;
    } catch (error: any) {
      CustomError.createError({
        name: error.name,
        message: error.message,
      });

      return;
    }
  };

  deleteToken = async (uid: User["_id"]) => {
    try {
      const userToken = await tokenModel.deleteOne({ userId: uid });

      return userToken;
    } catch (error: any) {
      CustomError.createError({
        name: error.name,
        message: error.message,
      });

      return;
    }
  };

  updateUpload = async (uid: User["_id"], newDocument: Document) => {
    try {
      const user = await userModel.findById({ _id: uid }).lean().exec();

      if (!user) {
        CustomError.createError({
          name: ERRORS.USER_NOT_FOUND,
          message: ERRORS.USER_NOT_FOUND,
        });

        return;
      }

      return await userModel.updateOne(
        { _id: uid },
        { $push: { documents: newDocument } }
      );
    } catch (error: any) {
      CustomError.createError({
        name: error.name,
        message: error.message,
      });

      return;
    }
  };

  deleteOne = async (uid: User["_id"]) => {
    try {
      const user = await this.findOneById(uid);

      if (!user) {
        CustomError.createError({
          name: ERRORS.USER_NOT_FOUND,
          message: ERRORS.USER_NOT_FOUND,
        });

        return false;
      }
      const body =
        "We have to inform that your account was deleted because inactivity";

      await sendMail.send(user.email, "User deleted", body);

      await userModel.deleteOne({ _id: uid });

      return true;
    } catch (error: any) {
      CustomError.createError({
        name: error.name,
        message: error.message,
      });

      return;
    }
  };

  deleteAll = async () => {
    try {
      const allUsers = await this.finAll();

      allUsers?.map(async (user) => {
        const todayDate = new Date();

        const userLastLogin = new Date(user.last_connection);

        const result =
          (todayDate.getTime() - userLastLogin.getTime()) /
          (1000 * 60 * 60 * 24);

        if (result < 2) return;

        await this.deleteOne(user._id);
      });

      return;
    } catch (error: any) {
      CustomError.createError({
        name: error.name,
        message: error.message,
      });

      return;
    }
  };
}

const UserService = new UserServices();

export default UserService;
