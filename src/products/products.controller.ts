import { ERRORS } from "../interface/interfaces";
import ProductsService from "./products.serivces";
import { Request, Response } from "express";

class ProductsControllers {
  getAll = async (req: Request, res: Response) => {
    try {
      const { query, limit, sort, page } = req.query;

      const queryParam = query?.toString() || ""; //TODO this should not be needed

      const options = {
        limit: Number(limit) || 10,
        page: Number(page) || 1,
        sort: { price: sort } || { price: 1 },
        lean: true,
      };

      const result = await ProductsService.getAll(queryParam, options);

      if (!result) {
        return res
          .status(400)
          .send({ status: "ERROR", message: ERRORS.PRODUCT_NOT_FOUND });
      }

      return res.status(200).send({
        status: "succes",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.prevLink
          ? `/api/products?page=${result.prevPage}`
          : null,
        nextLink: result.nextLink
          ? `/api/products?page=${result.nextPage}`
          : null,
      });
    } catch (error: any) {
      return res
        .status(400)
        .send({ status: error.name, message: error.message });
    }
  };

  getOne = async (req: Request, res: Response) => {
    try {
      const { pid } = req.params;

      const result = await ProductsService.getOne(pid);

      if (!result) {
        return res
          .status(400)
          .send({ status: "ERROR", message: ERRORS.PRODUCT_NOT_FOUND });
      }

      return res.status(200).send({
        payload: result,
      });
    } catch (error: any) {
      return res
        .status(400)
        .send({ status: error.name, message: error.message });
    }
  };

  addOne = async (req: Request, res: Response) => {
    try {
      const newProduct = req.body;

      const user = req.session.user;

      if (!user) {
        return res
          .status(400)
          .send({ status: "ERROR", message: ERRORS.USER_NOT_FOUND });
      }

      const { title, price, description, code, category } = newProduct;

      if (!title || !price || !description || !code || !category) {
        return res
          .status(400)
          .send({ status: "ERROR", message: ERRORS.INVALID_PRODUCT_PROPERTY });
      }

      const result = await ProductsService.addOne(newProduct, user);

      if (!result) {
        return res.status(400).send({
          status: "ERROR",
          message: ERRORS.FAILED_TO_ADD_PRODUCT_TO_CART,
        });
      }

      return res.status(200).send({
        payload: result,
      });
    } catch (error: any) {
      return res
        .status(400)
        .send({ status: error.name, message: error.message });
    }
  };

  updateOne = async (req: Request, res: Response) => {
    try {
      const { pid } = req.params;
      const newProduct = req.body;

      const result = await ProductsService.updateOne(pid, newProduct);

      if (!result) {
        return res
          .status(400)
          .send({ status: "ERROR", message: ERRORS.PRODUCT_NOT_FOUND });
      }

      return res.status(200).send({
        payload: result,
      });
    } catch (error: any) {
      return res
        .status(400)
        .send({ status: error.name, message: error.message });
    }
  };

  deleteOne = async (req: Request, res: Response) => {
    try {
      const { pid } = req.params;

      const user = req.session.user;

      if (!user) {
        return res
          .status(400)
          .send({ status: "ERROR", message: ERRORS.USER_NOT_FOUND });
      }

      const result = await ProductsService.deleteOne(pid, user);

      if (!result) {
        return res
          .status(400)
          .send({ status: "ERROR", message: ERRORS.PRODUCT_NOT_FOUND });
      }

      return res.status(202).send({
        payload: result,
      });
    } catch (error: any) {
      return res
        .status(400)
        .send({ status: error.name, message: error.message });
    }
  };
}

const ProductsController = new ProductsControllers();

export default ProductsController;
