import "reflect-metadata";

import { AuthorizationService } from "../../src/services/AuthorizationService";
import { RoommateRepository } from "../../src/repository/RoommateRepository";

import { Area } from "../../src/roommate/area";
import { describe, expect, it, beforeAll, afterAll } from "@jest/globals";
import { Roommate } from "../../src/roommate/roommate";
import { RoommateProfile } from "../../src/roommate/roommateProfile";
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

  async findWhere(profile: Partial<RoommateProfile>): Promise<Roommate[]> {
    throw new Error("Function should not be called for this unit test");
  }

  async getAll(): Promise<Roommate[]> {
    return [testRoommate];
  }
  async update(
    username: string,
    roommateProfile: RoommateProfile
  ): Promise<boolean> {
    return username == testRoommate.username;
  }
  async delete(username: string): Promise<boolean> {
    return username == testRoommate.username;
  }
  async findOverlap(
    profileFields: Partial<RoommateProfile>,
    keysToIgnore: string[] = []
  ): Promise<Roommate[]> {
    throw new Error("Function should not be called for this unit test");
  }
  async addToRoommateList(
    username: string,
    usernameToAdd: string
  ): Promise<string[]> {
    throw new Error("Function should not be called for this unit test");
  }
  async deleteFromRoommateList(
    username: string,
    usernameToDelete: string
  ): Promise<string[]> {
    throw new Error("Function should not be called for this unit test");
  }
}

describe("Authorization Service", () => {
  let authorizationService: AuthorizationService;

  beforeAll(async () => {
    container.snapshot();

    dotenv.config();

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
  });

  it("Checks for valid username, password, and access token", async () => {
    const plainTextPassword = testRoommate.password;
    testRoommate.password = authorizationService.encryptPassword(
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

    const accessToken = await authorizationService.login(
      testRoommate.username,
      plainTextPassword
    );
    expect(typeof accessToken).toBe("string");
    expect(
      await authorizationService.login("wrongUsername", plainTextPassword)
    ).toEqual(null);
    expect(
      await authorizationService.login(testRoommate.username, "wrongPassword")
    ).toEqual(null);

    const validAuthorization = "Bearer " + accessToken;
    expect(authorizationService.validToken(validAuthorization)).toEqual(true);
    expect(authorizationService.validToken("wrongAuthorization")).toEqual(
      false
    );
  });
});
