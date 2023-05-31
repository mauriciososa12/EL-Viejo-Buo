import { Schema, model, PaginateModel, Document } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { Product } from "../interface/interfaces";

type ProductDocument = Document & Product;

const productsSchema: Schema<ProductDocument> = new Schema({
  title: String,
  description: String,
  code: String,
  price: Number,
  status: {
    type: Boolean,
    default: true,
  },
  stock: {
    type: Number,
    index: true,
    default: 0,
  },
  category: {
    type: String,
    index: true,
  },
  thumbnails: [String],
  owner: {
    type: String,
    ref: "User",
    default: "ADMIN",
  },
});

productsSchema.plugin(mongoosePaginate);

const productsModel = model<ProductDocument, PaginateModel<ProductDocument>>(
  "Products",
  productsSchema
);

export default productsModel;
