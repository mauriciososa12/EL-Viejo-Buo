import { Schema, model, Model } from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../interface/interfaces";

interface UserModel extends Model<User> {
  encryptPassword: (password: string) => Promise<string>;
  comparePassword: (
    password: string,
    recivedPassword: string
  ) => Promise<boolean>;
}

const userSchema: Schema<User> = new Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
  },
  age: Number,
  password: String,
  cart: {
    type: Schema.Types.ObjectId,
    ref: "Carts",
  },
  role: {
    type: String,
    default: "USER",
  },
  documents: [
    {
      name: String,
      reference: String,
    },
  ],
  last_connection: {
    type: Date,
    default: Date.now,
  },
});

userSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(password, salt);
  return encryptedPassword;
};

userSchema.statics.comparePassword = async (password, recivedPassword) => {
  return await bcrypt.compare(password, recivedPassword);
};

const userModel = model<User, UserModel>("User", userSchema);

export default userModel;
