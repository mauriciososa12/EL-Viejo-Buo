import CustomError from "../errors/customError";
import {
  Cart,
  CartProduct,
  ERRORS,
  Product,
  User,
} from "../interface/interfaces";
import cartsModel from "../models/carts.model";
import productsModel from "../models/products.model";
import ticketModel from "../models/ticket.model";
import userModel from "../models/users.model";
import ProductsService from "../products/products.serivces";
import sendMail from "../utils/nodemailer";

class CartsServices {
  createCart = async () => {
    try {
      const newCart = {
        cart: [],
      };
      const cart = await cartsModel.create(newCart);

      return cart;
    } catch (error: any) {
      CustomError.createError({
        name: error.name,
        message: error.message,
      });

      return;
    }
  };

  getAllCarts = async () => {
    try {
      const carts = await cartsModel.find();

      return carts;
    } catch (error: any) {
      CustomError.createError({
        name: error.name,
        message: error.message,
      });

      return;
    }
  };

  getCartById = async (cid: Cart["id"]) => {
    try {
      const cart = await cartsModel
        .findById({ _id: cid })
        .populate("products.product")
        .lean()
        .exec();

      if (!cart) {
        CustomError.createError({
          name: ERRORS.CART_NOT_FOUND,
          message: ERRORS.CART_NOT_FOUND,
        });

        return;
      }

      return cart;
    } catch (error: any) {
      CustomError.createError({
        name: error.name,
        message: error.message,
      });

      return;
    }
  };

  addProductToCart = async (
    cid: Cart["id"],
    pid: Product["_id"],
    user: User
  ) => {
    try {
      const cart = await this.getCartById(cid);

      if (!cart) {
        CustomError.createError({
          name: ERRORS.CART_NOT_FOUND,
          message: ERRORS.CART_NOT_FOUND,
        });

        return;
      }

      const product = await productsModel.findById({ _id: pid }).lean().exec();

      if (!product) {
        CustomError.createError({
          name: ERRORS.PRODUCT_NOT_FOUND,
          message: ERRORS.PRODUCT_NOT_FOUND,
        });

        return;
      }

      if (product.owner == user._id) {
        CustomError.createError({
          name: ERRORS.FAILED_TO_ADD_PRODUCT_TO_CART,
          message: ERRORS.FAILED_TO_ADD_PRODUCT_TO_CART,
        });

        return;
      }

      const findProduct = await cartsModel.findOne({ "products.product": pid });

      if (findProduct) {
        const result = await cartsModel.updateOne(
          { "products.product": pid },
          {
            $inc: {
              "products.$.quantity": 1,
            },
          }
        );

        return result;
      }

      const result = await cartsModel.updateOne(
        { _id: cid },
        { $push: { products: { product: pid } } }
      );

      return result;
    } catch (error: any) {
      CustomError.createError({
        name: error.name,
        message: error.message,
      });

      return;
    }
  };

  updateQuantity = async (
    cid: Cart["id"],
    pid: Product["_id"],
    quantity: number
  ) => {
    try {
      const cart = await this.getCartById(cid);

      if (!cart) {
        CustomError.createError({
          name: ERRORS.CART_NOT_FOUND,
          message: ERRORS.CART_NOT_FOUND,
        });

        return;
      }

      const product = await cartsModel.findOne({ "products.product": pid });

      if (!product) {
        CustomError.createError({
          name: ERRORS.PRODUCT_NOT_FOUND,
          message: ERRORS.PRODUCT_NOT_FOUND,
        });

        return;
      }

      const result = await cartsModel.updateOne(
        { "products.product": pid },
        {
          $inc: {
            "products.$.quantity": quantity,
          },
        }
      );

      return result;
    } catch (error: any) {
      CustomError.createError({
        name: error.name,
        message: error.message,
      });

      return;
    }
  };

  addArrayOfProducts = async (cid: Cart["id"], arrayOfProducts: Product[]) => {
    try {
      const cart = await this.getCartById(cid);

      if (!cart) {
        CustomError.createError({
          name: ERRORS.CART_NOT_FOUND,
          message: ERRORS.CART_NOT_FOUND,
        });

        return;
      }

      const mapProducts = arrayOfProducts.map((product) => {
        product: product._id;
      });

      const result = await cartsModel.updateOne(
        { _id: cid },
        { $push: { products: { $each: mapProducts } } }
      );

      return result;
    } catch (error: any) {
      CustomError.createError({
        name: error.name,
        message: error.message,
      });

      return;
    }
  };

  deleteProductFromCart = async (cid: Cart["id"], pid: Product["_id"]) => {
    try {
      const cart = await cartsModel.findOne({ _id: cid }).lean().exec();

      if (!cart) {
        CustomError.createError({
          name: ERRORS.CART_NOT_FOUND,
          message: ERRORS.CART_NOT_FOUND,
        });

        return;
      }

      const product = cart?.products.find(
        (product) => product.product._id === pid
      );

      if (product && product?.quantity > 1) {
        const result = await cartsModel.updateOne(
          { "products.product": pid },
          {
            $inc: {
              quantity: -1,
            },
          }
        );

        return result;
      }

      const result = await cartsModel.updateOne(
        { _id: cid },
        { $pull: { products: { product: pid } } }
      );

      return result;
    } catch (error: any) {
      CustomError.createError({
        name: error.name,
        message: error.message,
      });

      return;
    }
  };

  deleteAllProducts = async (cid: Cart["id"]) => {
    try {
      const cart = await this.getCartById(cid);

      if (!cart) {
        CustomError.createError({
          name: ERRORS.CART_NOT_FOUND,
          message: ERRORS.CART_NOT_FOUND,
        });

        return;
      }

      const result = await cartsModel.updateOne(
        { _id: cid },
        { $set: { products: [] } }
      );

      return result;
    } catch (error: any) {
      CustomError.createError({
        name: error.name,
        message: error.message,
      });

      return;
    }
  };

  purchaseProducts = async (cid: Cart["id"]) => {
    try {
      const cart = await this.getCartById(cid);

      if (!cart) {
        CustomError.createError({
          name: ERRORS.CART_NOT_FOUND,
          message: ERRORS.CART_NOT_FOUND,
        });

        return;
      }

      const products = Array.from(cart.products);

      const purchaser = await userModel.findOne({ cart: cid }).lean().exec();

      if (!purchaser) {
        CustomError.createError({
          name: ERRORS.USER_NOT_FOUND,
          message: ERRORS.USER_NOT_FOUND,
        });

        return;
      }

      const total = await this.removeProductFromStock(cid, products);

      const ticket = await this.generateTicket(purchaser.email, total!);

      const ticketBody = `Muchas gracias por su compra: ${purchaser.first_name}!
      Compra realizada con exito por un total: ${total}      
      `;

      await sendMail.send(
        purchaser.email,
        "Gracias por su compra!",
        ticketBody
      );

      return ticket;
    } catch (error: any) {
      CustomError.createError({
        name: error.name,
        message: error.message,
      });

      return;
    }
  };

  generateTicket = async (purchaser: string, total: number) => {
    try {
      const isTicket = await ticketModel
        .find({ purchaser: purchaser })
        .lean()
        .exec();

      if (isTicket) {
        await ticketModel.deleteOne({ purchaser: purchaser });
      }

      const result = await ticketModel.create({
        amount: total,
        purchaser: purchaser,
      });

      return result;
    } catch (error: any) {
      CustomError.createError({
        name: error.name,
        message: error.message,
      });

      return;
    }
  };

  removeProductFromStock = async (cid: Cart["id"], products: CartProduct[]) => {
    try {
      const total: number[] = [];

      await Promise.all(
        products.map(async (product) => {
          const pid = product.product._id;

          const productInDb = await ProductsService.getOne(pid);

          if (!productInDb) {
            CustomError.createError({
              name: ERRORS.PRODUCT_NOT_FOUND,
              message: ERRORS.PRODUCT_NOT_FOUND,
            });

            return;
          }

          if (await ProductsService.updateStock(pid, product.quantity)) {
            await this.deleteProductFromCart(cid, pid);

            total.push(productInDb?.price);
          }
        })
      );

      return total.reduce((acc, curr) => acc + curr, 0);
    } catch (error: any) {
      CustomError.createError({
        name: error.name,
        message: error.message,
      });

      return;
    }
  };
}

const CartsService = new CartsServices();

export default CartsService;