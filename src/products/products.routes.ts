import { Router } from "express";
import ProductsController from "./products.controller";
import { authPolicies } from "../middlewares/authPolicies";
import { authToken } from "../middlewares/authToken";
import { ROLES } from "../interface/interfaces";

const router = Router();

router.get("/", authToken, ProductsController.getAll);

router.get("/:pid", authToken, ProductsController.getOne);

router.post(
  "/",
  authToken,
  authPolicies(ROLES.ADMIN, ROLES.PREMIUM),
  ProductsController.addOne
);

router.put(
  "/:pid",
  authToken,
  authPolicies(ROLES.ADMIN, ROLES.PREMIUM),
  ProductsController.updateOne
);

router.delete(
  "/:pid",
  authToken,
  authPolicies(ROLES.ADMIN, ROLES.PREMIUM),
  ProductsController.deleteOne
);

export default router;
