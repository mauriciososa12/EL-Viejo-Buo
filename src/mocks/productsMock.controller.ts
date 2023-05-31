import { saveGeneratedProducts } from "./productsMock.services";
import { Request, Response } from "express";

export const generateMockProducts = (req: Request, res: Response) => {
  try {
    const products = saveGeneratedProducts();

    res.send({ status: "succes", payload: products });
  } catch (error) {
    req.logger.error(error);
  }
};
