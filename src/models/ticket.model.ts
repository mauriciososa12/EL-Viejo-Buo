import { Document, Schema, model } from "mongoose";
import { Ticket } from "../interface/interfaces";
import { v4 as uuidv4 } from "uuid";

type TicketDocument = Document & Ticket;

const ticketSchema: Schema<TicketDocument> = new Schema({
  id: Schema.Types.ObjectId,
  code: {
    type: String,
    default: uuidv4(),
    unique: true,
  },
  amount: Number,
  purchaser: String,
});

ticketSchema.set("timestamps", {
  createdAt: "purchased_datetime",
});

const ticketModel = model<TicketDocument>("Tickets", ticketSchema);

export default ticketModel;
