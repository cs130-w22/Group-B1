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
import { Roommate } from "../../src/roommate/roommate";
import { Area } from "../../src/roommate/area";
import request from "supertest";
import { RegistrableController } from "../../src/controllers/RegistrableController";
import express from "express";
import { json } from "body-parser";
import { RoommateModel } from "../../src/repository/Schemas";
import { Areas } from "../../src/roommate/area";
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
      .put("/roommate/username")
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
    expect(getRoommatesResponse.body).toEqual(
      expect.arrayContaining([
        {
          username: updatedTestRoommate.username,
          profile: updatedTestRoommate.profile,
        },
        { username: testRoommate2.username, profile: testRoommate2.profile },
      ])
    );

    const getRoommateByUsernameResponse = await request(app)
      .get("/roommate/username")
      .set("Accept", "application/json")
      .set("Authorization", authorizationHeader);
    expect(getRoommateByUsernameResponse.status).toEqual(200);
    expect(getRoommateByUsernameResponse.body).toEqual(
      updatedTestRoommate.profile
    );

    const getRoommatesByFilterResponse = await request(app)
      .get("/roommate/")
      .query({
        firstName: testRoommate2.profile.firstName,
        email: testRoommate2.profile.email,
      })
      .set("Accept", "application/json")
      .set("Authorization", authorizationHeader);
    expect(getRoommatesByFilterResponse.status).toEqual(200);
    expect(getRoommatesByFilterResponse.body).toEqual(
      expect.arrayContaining([
        { username: testRoommate2.username, profile: testRoommate2.profile },
      ])
    );

    const getRecommendationsResponse = await request(app)
      .get("/roommate/recommendations/username")
      .set("Accept", "application/json")
      .set("Authorization", authorizationHeader);
    expect(getRecommendationsResponse.body).toEqual(
      expect.arrayContaining([
        { username: testRoommate2.username, profile: testRoommate2.profile },
      ])
    );

    const getRoommateList = await request(app)
      .get("/roommate/list/username")
      .set("Accept", "application/json")
      .set("Authorization", authorizationHeader);
    expect(getRoommateList.body).toEqual([]);

    const addToRoommateList = await request(app)
      .post("/roommate/list/username")
      .set("Accept", "application/json")
      .set("Authorization", authorizationHeader)
      .send({ usernameToAdd: testRoommate2.username });
    expect(addToRoommateList.body).toEqual([testRoommate2.username]);

    const addToRoommateListDuplicate = await request(app)
      .post("/roommate/list/username")
      .set("Accept", "application/json")
      .set("Authorization", authorizationHeader)
      .send({ usernameToAdd: testRoommate2.username });
    expect(addToRoommateListDuplicate.body).toEqual([testRoommate2.username]);

    const getRoommateList2 = await request(app)
      .get("/roommate/list/username")
      .set("Accept", "application/json")
      .set("Authorization", authorizationHeader);
    expect(getRoommateList2.body).toEqual([testRoommate2.username]);

    const deleteFromRoommateList = await request(app)
      .delete("/roommate/list/username")
      .set("Accept", "application/json")
      .set("Authorization", authorizationHeader)
      .send({ usernameToDelete: testRoommate2.username });
    expect(deleteFromRoommateList.body).toEqual([]);

    const deleteFromRoommateListDuplicate = await request(app)
      .delete("/roommate/list/username")
      .set("Accept", "application/json")
      .set("Authorization", authorizationHeader)
      .send({ usernameToDelete: testRoommate2.username });
    expect(deleteFromRoommateListDuplicate.body).toEqual([]);

    const failedAddToRoommateList = await request(app)
      .post("/roommate/list/username")
      .set("Accept", "application/json")
      .set("Authorization", authorizationHeader)
      .send({ usernameToAdd: "UserNotExist" });
    expect(failedAddToRoommateList.status).toEqual(500);

    const failedDeleteFromRoommateList = await request(app)
      .post("/roommate/list/username")
      .set("Accept", "application/json")
      .set("Authorization", authorizationHeader)
      .send({ usernameToAdd: "UserNotExist" });
    expect(failedDeleteFromRoommateList.status).toEqual(500);

    const failedGetRoommateList = await request(app)
      .get("/roommate/list/differentUsername")
      .set("Accept", "application/json")
      .set("Authorization", authorizationHeader);
    expect(failedGetRoommateList.status).toEqual(401);

    const failedAddToRoommateList2 = await request(app)
      .post("/roommate/list/username")
      .set("Accept", "application/json")
      .set("Authorization", authorizationHeader)
      .send({ usernameToAdd: testRoommate1.username });
    expect(failedAddToRoommateList2.status).toEqual(400);

    const getAreasResponse = await request(app)
      .get("/roommate/types/areas")
      .set("Accept", "application/json");
    const areas = Object.values(Areas).filter((x) => typeof x === "string");
    expect(getAreasResponse.body).toEqual(expect.arrayContaining(areas));
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

  it("Checks that token matches username", async () => {
    const createRoommateResponse = await request(app)
      .post("/roommate/")
      .set("Accept", "application/json")
      .send(testRoommate1);
    expect(createRoommateResponse.status).toEqual(200);

    const createSecondRoommateResponse = await request(app)
      .post("/roommate/")
      .set("Accept", "application/json")
      .send(testRoommate2);
    expect(createSecondRoommateResponse.status).toEqual(200);

    const loginRoommateResponse = await request(app)
      .post("/roommate/login")
      .set("Accept", "application/json")
      .send({
        username: testRoommate1.username,
        password: testRoommate1.password,
      });
    expect(loginRoommateResponse.status).toEqual(200);
    const accessToken = loginRoommateResponse.body.accessToken;

    const updatedTestRoommate = testRoommate1;
    updatedTestRoommate.profile.bio = "Updated bio";

    const authorizationHeader = "Bearer " + accessToken;

    const unauthedUpdateRoommateResponse = await request(app)
      .put("/roommate/username2")
      .set("Accept", "application/json")
      .set("Authorization", authorizationHeader)
      .send(updatedTestRoommate.profile);
    expect(unauthedUpdateRoommateResponse.status).toEqual(401);
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
