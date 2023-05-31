import { Document, Schema, model } from "mongoose";
import { Cart } from "../interface/interfaces";

type CartDocument = Document & Cart;

const cartSchema: Schema<Cart> = new Schema({
  products: {
    type: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Products",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    default: [],
  },
});

const cartsModel = model<CartDocument>("Carts", cartSchema);

export default cartsModel;
