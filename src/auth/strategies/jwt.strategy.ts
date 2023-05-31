import passport from "passport";
import passportJWT from "passport-jwt";
import userModel from "../../models/users.model";
import dotenv from "dotenv";
import { SessionUser } from "../../interface/interfaces";

dotenv.config();
const JwtStrategy = passportJWT.Strategy;
const JwtExtractor = passportJWT.ExtractJwt;

const initializeJwtPassport = () => {
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: JwtExtractor.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      async function (jwtPayload, done) {
        return done(null, jwtPayload);
      }
    )
  );

  passport.serializeUser(function (user: Partial<SessionUser>, done) {
    done(null, user._id);
  });

  passport.deserializeUser(async function (id, done) {
    const user = await userModel.findOne({ _id: id }).lean().exec();

    done(null, user);
  });
};

export default initializeJwtPassport;