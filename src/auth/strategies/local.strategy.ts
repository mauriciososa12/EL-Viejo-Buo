import passport from "passport";
import * as passportLocal from "passport-local";
import userModel from "../../models/users.model";
import CartsService from "../../carts/carts.services";
import AuthService from "../auth.service";
import { validateNewUser } from "../../utils/utils";
import dotenv from "dotenv";
import { User } from "../../interface/interfaces";

dotenv.config();
const LocalStrategy = passportLocal.Strategy;

const initializeLocalPassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async function (req, username, password, done) {
        const user = await userModel.findOne({ email: username }).lean().exec();

        if (user) return done(null, false);

        const createCart = await CartsService.createCart();

        const newUser: Partial<User> = {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          age: req.body.age,
          password: await userModel.encryptPassword(password),
          cart: createCart!,
        };

        if (!validateNewUser(newUser)) {
          return done(null, false);
        }

        const createNewUser = await userModel.create(newUser);

        return done(null, createNewUser);
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async function (username, password, done) {
        const user = await AuthService.validateUser(username, password);

        if (!user) {
          return done(null, false);
        }

        AuthService.updateLoginDate(user._id);

        return done(null, user);
      }
    )
  );
};

export default initializeLocalPassport;