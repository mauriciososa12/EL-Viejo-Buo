import { Types } from "mongoose";

export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  age: number;
  password: string;
  cart: Cart;
  role: string;
  documents: Document[];
  last_connection: Date;
}

export interface UserSession {
  user: {
    _doc: User;
  };
}

export interface Document {
  name: string;
  reference: string;
}

export enum FIELDNAMES {
  DOCUMENTS = "documents",
  PROFILES = "profiles",
  PRODUCTS = "products",
}

export interface Message {
  user: string;
  message: string;
}

export interface Ticket {
  id: Types.ObjectId;
  code: string;
  amount: number;
  purchaser: string;
  purchased_datetime: Date;
}

export interface Token {
  userId: Types.ObjectId;
  token: string;
  expireAt: Date;
}

export interface SessionUser extends Express.User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  age: number;
  cart: Cart;
  role: string;
  accessToken: string;
}

export interface Cart {
  id: string;
  products: CartProduct[];
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  code: string;
  price: number;
  status: boolean;
  stock: number;
  category: string;
  thumbnails: string[];
  owner: string;
}

export interface CartProduct {
  product: Product;
  quantity: number;
}

export enum ERRORS {
  CART_NOT_FOUND = "CART NOT FOUND",
  INVALID_CART_PROPERTY = "INVALID CART PROPERTY",
  PRODUCT_ALREADY_IS_IN_CART = "PRODUCT ALREADY IS IN CART",
  CART_IS_EMPTY = "CART IS EMPTY",
  PRODUCT_NOT_FOUND = "PRODUCT NOT FOUND",
  INVALID_PRODUCT_PROPERTY = "INVALID PRODUCT PROPERTY",
  USER_NOT_FOUND = "USER NOT FOUND",
  INVALID_USER_PROPERTY = "INVALID USER PROPERTY",
  INVALID_PASSWORD = "INVALID PASSWORD",
  INVALID_EMAIL = "INVALID EMAIL",
  PRODUCT_ALREADY_IS_IN_DB = "PRODUCT ALREADY IS IN DB",
  INVALID_USER = "INVALID USER",
  FAILED_TO_ADD_PRODUCT_TO_CART = "FAILED TO ADD PRODUCT TO CART",
  DOCUMENTS_NOT_FOUND_IN_DB = "DOCUMENTS NOT FOUND IN DB",
  INVALID_OR_EXPIRED_TOKEN = "INVALID OR EXPIRED TOKEN",
  CAN_NOT_USE_THE_LAST_PASSWORD = "CAN NOT USE THE LAST PASSWORD",
}

export enum DOCUMENTS {
  ID = "identificacion",
  ADDRESS = "comprobante de domicilio",
  ACCOUNT_STATE = "comprobante de estado de cuenta",
}

export enum ROLES {
  USER = "USER",
  PREMIUM = "PREMIUM",
  ADMIN = "ADMIN",
}