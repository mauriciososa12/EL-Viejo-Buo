import supertest from "supertest";
import chai from "chai";
import dotenv from "dotenv";
import { fakerUpdateProduct, genFakerProduct } from "../utils/products.mock";
import { Product } from "../interface/interfaces";
dotenv.config();

const expect = chai.expect;
const requester = supertest(process.env.BASE_URL);

describe("Testing products endpoint", () => {
  describe("GET/api/products", () => {
    it("GET should return status 200", async () => {
      const { status } = await requester.get("/api/products");

      expect(status).to.exist.and.to.be.equal(200);
    });

    it("GET should return an array", async () => {
      const { body } = await requester.get("/api/products");

      expect(body.payload).to.be.an("array").that.is.not.empty;
    });
  });

  describe("POST/api/products", () => {
    const userAccount = {
      email: "jcvalencia@ismt.edu.ar",
      password: "qweqwe",
    };
    const newProductWithoutProperties = {
      title: "Product one",
    };
    let cookieName: string, cookieToken: string, newProduct: Partial<Product>;

    before(async () => {
      const logUser = await requester.post("/login").send(userAccount);

      const cookie = logUser.header["set-cookie"][0];

      cookieName = cookie.split("=")[0];
      cookieToken = cookie.split("=")[1];
      newProduct = genFakerProduct();
    });

    it("POST a new product should return status 201 if all required properties was sended and must save the product in DB with a new _id property", async () => {
      const { body, status } = await requester
        .post("/api/products")
        .set("Cookie", [`${cookieName}=${cookieToken}`])
        .send(newProduct);

      expect(status).to.exist.and.to.be.equal(201);
      expect(body.payload).to.exist.and.to.haveOwnProperty("_id");
    });

    it("POST a new product should return status 400 if any of the required properties was undefined", async () => {
      const { status } = await requester
        .post("/api/products")
        .set("Cookie", [`${cookieName}=${cookieToken}`])
        .send(newProductWithoutProperties);

      expect(status).to.exist.and.to.be.equal(400);
    });
  });

  describe("GET/api/products/:pid", () => {
    const pid = "63bf146e58e7baa835ee6870";

    it("GET should return status 200 if pid is defined", async () => {
      const { status } = await requester.get(`/api/products/${pid}`);

      expect(status).to.exist.and.to.be.equal(200);
    });

    it("GET payload should return an object is pid is defined", async () => {
      const { body } = await requester.get(`/api/products/${pid}`);

      expect(body.payload).to.exist.and.to.be.an("object");
    });

    it("GET payload object must have property _id", async () => {
      const { body } = await requester.get(`/api/products/${pid}`);

      expect(body.payload).to.haveOwnProperty("_id");
    });

    it("GET should return status 400 if pid is not defined", async () => {
      const { status } = await requester.get(`/api/products/123456`);

      expect(status).to.exist.and.to.be.equal(400);
    });
  });

  describe("PUT/api/products/:pid", () => {
    before;

    const userAccount = {
      email: "jcvalencia@ismt.edu.ar",
      password: "qweqwe",
    };

    let cookieName: string, cookieToken: string, pid: Product["_id"];

    const productUpdated = fakerUpdateProduct();

    before(async () => {
      const logUser = await requester.post("/login").send(userAccount);

      const cookie = logUser.header["set-cookie"][0];

      cookieName = cookie.split("=")[0];
      cookieToken = cookie.split("=")[1];

      const newProduct = genFakerProduct();
      const { body } = await requester
        .post("/api/products")
        .set("Cookie", [`${cookieName}=${cookieToken}`])
        .send(newProduct);

      pid = body.payload._id;
    });

    it("PUT should return status 202 if the product was updated", async () => {
      const { status, body } = await requester
        .put(`/api/products/${pid}`)
        .set("Cookie", [`${cookieName}=${cookieToken}`])
        .send(productUpdated);

      expect(status).to.exist.and.to.be.equal(202);
    });

    it("PUT should return status 400 if the products wasnt founded", async () => {
      const { status } = await requester
        .put(`/api/products/123456`)
        .set("Cookie", [`${cookieName}=${cookieToken}`]);

      expect(status).to.exist.and.to.be.equal(400);
    });
  });

  describe("DELETE/api/products/:pid", () => {
    const userAccount = {
      email: "jcvalencia@ismt.edu.ar",
      password: "qweqwe",
    };
    let cookieName: string, cookieToken: string, pid: Product["_id"];

    before(async () => {
      const logUser = await requester.post("/login").send(userAccount);

      const cookie = logUser.header["set-cookie"][0];

      cookieName = cookie.split("=")[0];
      cookieToken = cookie.split("=")[1];

      const newProduct = genFakerProduct();
      const { body } = await requester
        .post("/api/products")
        .set("Cookie", [`${cookieName}=${cookieToken}`])
        .send(newProduct);

      pid = body.payload._id;
    });

    it("DELETE should return status 202 if the product was deleted", async () => {
      const { status } = await requester
        .delete(`/api/products/${pid}`)
        .set("Cookie", [`${cookieName}=${cookieToken}`]);

      expect(status).to.exist.and.to.be.equal(202);
    });

    it("DELETE should return status 400 if the products wasnt founded", async () => {
      const { status } = await requester
        .delete(`/api/products/123456`)
        .set("Cookie", [`${cookieName}=${cookieToken}`]);

      expect(status).to.exist.and.to.be.equal(400);
    });
  });
});
