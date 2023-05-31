import express from "express";
import passport from "passport";
import UserController from "./users.controllers";
import upload from "../utils/multer";
import { authToken } from "../middlewares/authToken";
import { authPolicies } from "../middlewares/authPolicies";
import { ROLES } from "../interface/interfaces";

const Router = express.Router();

Router.get(
  "/",
  authToken,
  authPolicies(ROLES.ADMIN, null),
  UserController.getAll
);

Router.get("/current", authToken, UserController.getCurrent);

Router.get(
  "/premium/:uid",
  authToken,
  authPolicies(ROLES.USER, ROLES.PREMIUM),
  UserController.changeRole
);

Router.post(
  "/register",
  passport.authenticate("register", {
    failureMessage: "Cannot register new user",
  }),
  UserController.registerOne
);

Router.post("/restore", UserController.sendRestoreMail);

Router.post("/restoreForm/:uid/:token", UserController.restorePassword);

Router.post(
  "/:uid/documents",
  authToken,
  authPolicies(ROLES.USER, ROLES.PREMIUM),

  upload.fields([
    { name: "documents", maxCount: 3 },
    { name: "profiles", maxCount: 1 },
    { name: "products", maxCount: 10 },
  ]),
  UserController.uploadDocument
);

Router.delete(
  "/",
  authToken,
  authPolicies(ROLES.ADMIN, null),
  UserController.deleteAllUsers
);

Router.delete(
  "/:pid",
  authToken,
  authPolicies(ROLES.ADMIN, null),
  UserController.deleteUser
);

export default Router;
