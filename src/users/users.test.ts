import supertest from "supertest";
import chai from "chai";
import dotenv from "dotenv";
import { newFakerUser } from "../utils/users.mock";
dotenv.config();

const expect = chai.expect;
const requester = supertest(process.env.BASE_URL);

describe("Testing auth and user endpoints", () => {
  describe("POST /register should register a new user", () => {
    const newUser = newFakerUser();

    const incompleteNewUser = {
      email: "juan@Mail.com",
      password: "secret123",
    };

    it("POST/regiser should return status 200 if new user was registed successfully", async () => {
      const { status } = await requester.post("/register").send(newUser);

      expect(status).to.exist.and.to.be.equal(200);
    });

    it("POST/register should return status 401 Unauthorized if any of the new user is already ion DB", async () => {
      const { status } = await requester
        .post("/register")
        .send(incompleteNewUser);

      expect(status).to.exist.and.to.be.equal(401);
    });
  });

  describe("POST /login should log registered user", () => {
    const userAccount = {
      email: "jcvalencia@ismt.edu.ar",
      password: "qweqwe",
    };

    const incompleteUser = {
      email: "juan@Mail.com",
      password: "secret123",
    };

    it("POST/login should return status 200 if mail and password were correct", async () => {
      const status = await requester.post("/login").send(userAccount);

      expect(status).to.exist.and.to.be.equal(200);
    });

    it("POST/login should return cookie with jwt token", async () => {
      const response = await requester.post("/login").send(userAccount);

      const cookie = response.header["set-cookie"][0];

      expect(cookie).to.exist;
    });

    it("POST/login should return status 401 Unauthorized if any of the new user inputs were incomplete or wrong", async () => {
      const { status } = await requester.post("/login").send(incompleteUser);

      expect(status).to.exist.and.to.be.equal(401);
    });
  });

  describe("GET/current must return status 200 and a user with _id, email, cart properties", () => {
    const userAccount = {
      email: "jcvalencia@ismt.edu.ar",
      password: "qweqwe",
    };

    let cookieName: string, cookieToken: string;

    before(async () => {
      const logUser = await requester.post("/login").send(userAccount);
      const cookie = logUser.header["set-cookie"][0];

      cookieName = cookie.split("=")[0];
      cookieToken = cookie.split("=")[1];
    });

    it("GET should return status 200", async () => {
      const { status } = await requester
        .get("/api/sessions/current")
        .set("Cookie", [`${cookieName}=${cookieToken}`]);

      expect(status).to.exist.and.to.be.equal(200);
    });

    it("GET should return an user", async () => {
      const response = await requester
        .get("/api/sessions/current")
        .set("Cookie", [`${cookieName}=${cookieToken}`]);

      expect(response.body.payload).to.exist.and.to.be.an("object");
    });

    it("GET user must have _id, email and cart properties", async () => {
      const { body } = await requester
        .get("/api/sessions/current")
        .set("Cookie", [`${cookieName}=${cookieToken}`]);

      expect(body.payload).to.exist.and.to.haveOwnProperty("_id");
      expect(body.payload).to.exist.and.to.haveOwnProperty("email");
      expect(body.payload).to.exist.and.to.haveOwnProperty("cart");
    });
  });
});
