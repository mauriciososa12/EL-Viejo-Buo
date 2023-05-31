import { Cart, Document, User } from "../../interface/interfaces";

export default class UserDto {
  readonly _id: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly email: string;
  readonly age: number;
  readonly cart: Cart;
  readonly role: string;
  readonly documents: Document[];
  public accessToken: string | undefined;

  constructor(user: User) {
    this._id = user._id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.age = user.age;
    this.email = user.email;
    this.cart = user.cart;
    this.role = user.role;
    this.documents = user.documents;
  }
}
