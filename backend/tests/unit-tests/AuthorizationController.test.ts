import TYPES from "../../types";
import container from "../../inversify.config";
import { describe, expect, it, beforeAll, afterAll } from "@jest/globals";
import { Roommate } from "../../src/roommate/roommate";
import { Area } from "../../src/roommate/area";
import { AuthorizationService } from "../../src/services/AuthorizationService";
import { injectable } from "inversify";
import request from "supertest";
import { RegistrableController } from "../../src/controllers/RegistrableController";
import express from "express";
import { json } from "body-parser";

const testRoommate: Roommate = {
  username: "username",
  password: "password",
  profile: {
    firstName: "Tom",
    lastName: "Richard",
    email: "tom@gmail.com",
    area: "Los Angeles" as Area,
    bio: "NYU grad",
    hobbies: [],
    personality: [],
    additionalInfo: "Looking for 1 roommate",
  },
};

@injectable()
class AuthorizationServiceMock extends AuthorizationService {
  public async login(
    username: string,
    password: string
  ): Promise<string | null> {
    if (
      username != testRoommate.username ||
      password != testRoommate.password
    ) {
      return null;
    }
    return "accessToken";
  }
}

describe("POST /roommate/login", function () {
  const app = express();
  app.use(json());

  beforeAll(async () => {
    container.snapshot();
    container.unbind(TYPES.AuthorizationService);
    container
      .bind<AuthorizationService>(TYPES.AuthorizationService)
      .to(AuthorizationServiceMock);
    const controllers: RegistrableController[] =
      container.getAll<RegistrableController>(TYPES.Controller);
    controllers.forEach((controller) => controller.register(app));
  });

  afterAll(async () => {
    container.restore();
  });

  it("responds accessToken to correct password and username", async function () {
    const response = await request(app)
      .post("/roommate/login")
      .set("Accept", "application/json")
      .send({
        username: testRoommate.username,
        password: testRoommate.password,
      });
    expect(response.status).toEqual(200);
    expect(response.body.accessToken).toEqual("accessToken");
  });

  it("responds error if the password does not match with the username", async function () {
    const response = await request(app)
      .post("/roommate/login")
      .set("Accept", "application/json")
      .send({ username: testRoommate.username, password: "wrongPassword" });
    expect(response.status).toEqual(401);
  });

  it("responds error if password is missing", async function () {
    const response = await request(app)
      .post("/roommate/login")
      .set("Accept", "application/json")
      .send({ username: testRoommate.username });
    expect(response.status).toEqual(401);
  });

  it("responds error if username is missing", async function () {
    const response = await request(app)
      .post("/roommate/login")
      .set("Accept", "application/json")
      .send({ password: testRoommate.password });
    expect(response.status).toEqual(401);
  });
});
