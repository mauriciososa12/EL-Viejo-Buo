import { User } from "../../interface/interfaces";

export default class UsersDto {
  readonly _id: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly email: string;
  readonly role: string;
  readonly last_connection: Date;

  constructor(user: User) {
    this._id = user._id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.role = user.role;
    this.last_connection = user.last_connection;
  }
}
