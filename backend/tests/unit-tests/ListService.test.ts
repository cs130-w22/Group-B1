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
import { ListService } from "../../src/services/ListService";

const testRoommate1: Roommate = {
  username: "Tom",
  password: "TomPassword",
  list: [],
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
  username: "Sam",
  password: "SamPassword",
  list: [],
  profile: {
    firstName: "Sam",
    lastName: "Richard",
    email: "sam@gmail.com",
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
    if (username == testRoommate1.username) {
      return testRoommate1;
    } else if (username == testRoommate2.username) {
      return testRoommate2;
    } else {
      return null;
    }
  }

  async findWhere(profile: Partial<RoommateProfile>): Promise<Roommate[]> {
    throw new Error("Function should not be called for this unit test");
  }

  async getAll(): Promise<Roommate[]> {
    throw new Error("Function should not be called for this unit test");
  }
  async update(
    username: string,
    roommateProfile: RoommateProfile
  ): Promise<boolean> {
    throw new Error("Function should not be called for this unit test");
  }
  async delete(username: string): Promise<boolean> {
    throw new Error("Function should not be called for this unit test");
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
    return [usernameToAdd];
  }
  async deleteFromRoommateList(
    username: string,
    usernameToDelete: string
  ): Promise<string[]> {
    return [];
  }
}

describe("List Service", () => {
  let listService: ListService;

  beforeAll(async () => {
    container.snapshot();

    dotenv.config();

    container.unbind(TYPES.RoommateRepository);
    container
      .bind<RoommateRepository>(TYPES.RoommateRepository)
      .to(RoommateRepositoryMock);

    listService = container.get<ListService>(TYPES.ListService);
  });

  afterAll(async () => {
    container.restore();
  });

  it("Checks adding and deleting valid usernames and invalid usernames", async () => {
    expect(
      await listService.addToRoommateList(
        testRoommate1.username,
        testRoommate2.username
      )
    ).toEqual([testRoommate2.username]);
    expect(
      await listService.deleteFromRoommateList(
        testRoommate1.username,
        testRoommate2.username
      )
    ).toEqual([]);
    expect(async () => {
      await listService.addToRoommateList(
        testRoommate1.username,
        "usernameNotInDB"
      );
    }).rejects.toThrowError();
    expect(async () => {
      await listService.deleteFromRoommateList(
        testRoommate1.username,
        "usernameNotInDB"
      );
    }).rejects.toThrowError();
  });
});
