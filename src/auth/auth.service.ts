import jwt from "jsonwebtoken";
import userModel from "../models/users.model";
import dotenv from "dotenv";
import { SessionUser, User } from "../interface/interfaces";
dotenv.config();

class AuthServices {
  constructor() {}

  async validateUser(username: User["email"], password: User["password"]) {
    const user = await userModel.findOne({ email: username });

    if (user && (await userModel.comparePassword(password, user.password))) {
      return user;
    }

    return null;
  }

  async login(payload: SessionUser) {
    const user = { ...payload };

    const token = jwt.sign({ user }, process.env.JWT_SECRET!, {
      expiresIn: 7 * 24 * 60 * 60,
    });

    user.accessToken = token;

    return user;
  }

  updateLoginDate = async (id: User["_id"]) => {
    return await userModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: { last_connection: Date.now() },
      },
      { new: true }
    );
  };
}

const AuthService = new AuthServices();

export default AuthService;