import TYPES from "../../types";
import container from "../../inversify.config";
import {
  describe,
  expect,
  it,
  beforeAll,
  afterAll,
  beforeEach,
} from "@jest/globals";
import { Roommate } from "../../../shared/src/roommate";
import { Area } from "../../../shared/src/area";
import request from "supertest";
import { RegistrableController } from "../../src/controllers/RegistrableController";
import express from "express";
import { json } from "body-parser";
import { RoommateModel } from "../../src/repository/Schemas";
import { connect, disconnect } from "mongoose";
import * as dotenv from "dotenv";

const testRoommate1: Roommate = {
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

const testRoommate2: Roommate = {
  username: "username2",
  password: "password2",
  profile: {
    firstName: "Bob",
    lastName: "Smith",
    email: "bob@gmail.com",
    area: "Los Angeles" as Area,
    bio: "NYU grad",
    hobbies: [],
    personality: [],
    additionalInfo: "Looking for 1 roommate",
  },
};

describe("Roommates API", function () {
  const app = express();
  app.use(json());

  beforeAll(async () => {
    container.snapshot();

    dotenv.config();

    const MONGODB_URL = process.env.DB_URL_TEST;
    await connect(MONGODB_URL);
    await RoommateModel.deleteMany({});

    const controllers: RegistrableController[] =
      container.getAll<RegistrableController>(TYPES.Controller);
    controllers.forEach((controller) => controller.register(app));
  });

  beforeEach(async () => {
    await RoommateModel.deleteMany({});
  });

  afterAll(async () => {
    container.restore();
    await RoommateModel.deleteMany({});
    await disconnect();
  });

  it("Successful workflow", async () => {
    const createRoommateResponse = await request(app)
      .post("/roommate/")
      .set("Accept", "application/json")
      .send(testRoommate1);
    expect(createRoommateResponse.status).toEqual(200);

    const loginRoommateResponse = await request(app)
      .post("/roommate/login")
      .set("Accept", "application/json")
      .send({
        username: testRoommate1.username,
        password: testRoommate1.password,
      });
    expect(loginRoommateResponse.status).toEqual(200);
    const accessToken = loginRoommateResponse.body.accessToken;
    expect(typeof accessToken).toEqual("string");

    const updatedTestRoommate = testRoommate1;
    updatedTestRoommate.profile.bio = "Updated bio";

    const authorizationHeader = "Bearer " + accessToken;

    const updateRoommateResponse = await request(app)
      .put("/roommate/")
      .query({ username: updatedTestRoommate.username })
      .set("Accept", "application/json")
      .set("Authorization", authorizationHeader)
      .send(updatedTestRoommate.profile);
    expect(updateRoommateResponse.status).toEqual(200);

    const createSecondRoommateResponse = await request(app)
      .post("/roommate/")
      .set("Accept", "application/json")
      .send(testRoommate2);
    expect(createSecondRoommateResponse.status).toEqual(200);

    const getRoommatesResponse = await request(app)
      .get("/roommate/")
      .set("Accept", "application/json")
      .set("Authorization", authorizationHeader);
    expect(getRoommatesResponse.status).toEqual(200);
    expect(getRoommatesResponse.body.data).toEqual(
      expect.arrayContaining([
        updatedTestRoommate.profile,
        testRoommate2.profile,
      ])
    );
  });

  it("Checks for taken usernames", async () => {
    const createRoommateResponse = await request(app)
      .post("/roommate/")
      .set("Accept", "application/json")
      .send(testRoommate1);
    expect(createRoommateResponse.status).toEqual(200);

    const failedCreateRoommateResponse = await request(app)
      .post("/roommate/")
      .set("Accept", "application/json")
      .send(testRoommate1);
    expect(failedCreateRoommateResponse.status).toEqual(400);
  });

  it("Checks for valid tokens", async () => {
    const failedRoommateResponse = await request(app)
      .get("/roommate/")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer random")
      .send(testRoommate1);
    expect(failedRoommateResponse.status).toEqual(401);
  });

  it("Fails gracefully", async () => {
    const failedCreateRoommateResponse = await request(app)
      .post("/roommate/")
      .set("Accept", "application/json")
      .send({ password: "password", profile: { firstName: "Tom" } });
    expect(failedCreateRoommateResponse.status).toEqual(500);
  });
});