import messageModel from "../models/messages.model";
import { Server } from "socket.io";

export default (io: Server) => {
  io.on("connection", (socket) => {
    const getMessages = async () => {
      const messages = await messageModel.find();

      socket.emit("server:messages", messages);
    };
    getMessages();

    socket.on("client:newMessage", async (data) => {
      const newMessage = new messageModel(data);

      const result = await newMessage.save();

      io.emit("server:newMessage", result);
    });
  });
};
