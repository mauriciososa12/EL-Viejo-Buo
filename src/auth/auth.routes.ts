import { Router } from "express";
import passport from "passport";
import AuthController from "./auth.controller";

const router = Router();

router.post(
  "/login",
  passport.authenticate("login", { failureMessage: "Not Auth" }),
  AuthController.loginCtrl
);

export default router;