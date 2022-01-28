import "reflect-metadata";

import { AuthorizationService } from "../../src/services/AuthorizationService";
import { RoommateRepository } from "../../src/repository/RoommateRepository";

import { Area } from "../../../shared/src/area";
import { describe, expect, it, beforeAll, afterAll } from "@jest/globals";
import { RoommateModel } from "../../src/repository/Schemas";
import { Roommate } from "../../../shared/src/roommate";
import { connect, disconnect } from "mongoose";
import * as dotenv from "dotenv";
import TYPES from "../../types";

import container from "../../inversify.config";
import { injectable } from "inversify";

const testRoommate: Roommate = {
  username: "Tom",
  password: "TomPassword",
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
class RoommateRepositoryMock implements RoommateRepository {
  async create(roommate: Roommate): Promise<boolean> {
    return true;
  }

  async findOne(username: string): Promise<Roommate | null> {
    if (username == testRoommate.username) {
      return testRoommate;
    } else {
      return null;
    }
  }
  async getAll(): Promise<Roommate[]> {
    return [testRoommate];
  }
  async update(username: string, roommate: Roommate): Promise<boolean> {
    return username == testRoommate.username;
  }
  async delete(username: string): Promise<boolean> {
    return username == testRoommate.username;
  }
}

describe("Authorization Service", () => {
  let authorizationService: AuthorizationService;

  beforeAll(async () => {
    container.snapshot();

    dotenv.config();

    const MONGODB_URL = process.env.DB_URL_TEST;
    await connect(MONGODB_URL);
    await RoommateModel.deleteMany({});

    container.unbind(TYPES.RoommateRepository);
    container
      .bind<RoommateRepository>(TYPES.RoommateRepository)
      .to(RoommateRepositoryMock);

    authorizationService = container.get<AuthorizationService>(
      TYPES.AuthorizationService
    );
  });

  afterAll(async () => {
    container.restore();
    await RoommateModel.deleteMany({});
    disconnect();
  });

  it("Test", async () => {
    const plainTextPassword = testRoommate.password;
    testRoommate.password = await authorizationService.encryptPassword(
      testRoommate.password
    );
    expect(
      await authorizationService.validUsernamePassword(
        testRoommate.username,
        plainTextPassword
      )
    ).toEqual(true);
    expect(
      await authorizationService.validUsernamePassword(
        testRoommate.username,
        "wrongPassword"
      )
    ).toEqual(false);
    expect(
      await authorizationService.validUsernamePassword(
        "wrongUserName",
        plainTextPassword
      )
    ).toEqual(false);

    const tokens = await authorizationService.login(
      testRoommate.username,
      plainTextPassword
    );
    expect(tokens).toHaveProperty("accessToken");
    expect(tokens).toHaveProperty("refreshToken");
    expect(
      await authorizationService.login("wrongUsername", plainTextPassword)
    ).toEqual(null);
    expect(
      await authorizationService.login(testRoommate.username, "wrongPassword")
    ).toEqual(null);

    const validAuthorization = "Bearer " + tokens.accessToken;
    expect(await authorizationService.validToken(validAuthorization)).toEqual(
      true
    );
    expect(await authorizationService.validToken("wrongAuthorization")).toEqual(
      false
    );
  });
});
