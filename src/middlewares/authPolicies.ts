import { ROLES, UserSession } from "../interface/interfaces";
import { Request, Response, NextFunction } from "express";

export const authPolicies =
  (policieOne: ROLES | null, policieTwo: ROLES | null) =>
  (req: Request, res: Response, next: NextFunction) => {
    const data = req.user as UserSession;
    const { role } = data.user._doc;

    if (typeof policieOne === "undefined") {
      policieOne = policieTwo;
      policieTwo = null;
    }

    if (role !== policieOne && role !== policieTwo) {
      return res.status(403).send({
        error: "Not Authorized from Policies",
      });
    }

    next();
  };
