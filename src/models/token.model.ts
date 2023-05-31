import { Document, Schema, model } from "mongoose";
import { Token } from "../interface/interfaces";

type TokenDocument = Document & Token;

const tokenSchema: Schema<TokenDocument> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    default: new Date(),
    expires: 3600,
  },
});

const tokenModel = model<TokenDocument>("Token", tokenSchema);

export default tokenModel;
