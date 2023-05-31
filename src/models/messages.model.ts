import { Document, Schema, model } from "mongoose";
import { Message } from "../interface/interfaces";



type MessageDocument = Document & Message;

const messageSchema: Schema<MessageDocument> = new Schema({
  user: String,
  message: String,
});

const messageModel = model<MessageDocument>("Messages", messageSchema);

export default messageModel;
