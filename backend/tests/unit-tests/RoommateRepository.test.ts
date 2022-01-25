import { RoommateRepository } from "../../src/repository/RoommateRepository";
import { Area } from "../../../shared/src/area";
import { describe, expect, it, beforeEach } from "@jest/globals";
import {
  RoommateModel,
  roommateToDocument,
} from "../../src/repository/Schemas";
import * as mockingoose from "mockingoose";
import { Roommate } from "../../../shared/src/roommate";
import { cloneDeep } from "lodash";

const roommate1: Roommate = {
  username: "Bob",
  password: "BobPassword",
  profile: {
    firstName: "Bob",
    lastName: "Smith",
    email: "bob@gmail.com",
    area: "Austin" as Area,
    bio: "UCLA grad",
    hobbies: [],
    personality: [],
    additionalInfo: "Looking for 2 roommates",
  },
};

const roommate2: Roommate = {
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

const roommates = [roommate1, roommate2];

describe("Roommate Repository", () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it("Creates roommate", async () => {
    const roommateRepository = new RoommateRepository();

    mockingoose(RoommateModel).toReturn([], "find"); //No existing roommate is found
    mockingoose(RoommateModel).toReturn(null, "save"); //Successfully save

    expect(await roommateRepository.create(roommate1)).toEqual(true);
  });

  it("Finds roommate ", async () => {
    const roommateRepository = new RoommateRepository();

    mockingoose(RoommateModel).toReturn([roommate2], "find");

    expect(await roommateRepository.findOne(roommate2.username)).toEqual(
      roommate2
    );
  });

  it("Find all roommates ", async () => {
    const roommateRepository = new RoommateRepository();

    mockingoose(RoommateModel).toReturn([roommate1, roommate2], "find");

    const allRoommates = await roommateRepository.getAll();
    expect(allRoommates).toEqual(expect.arrayContaining(roommates));
    expect(allRoommates.length).toEqual(roommates.length);
  });

  it("Updates roommate", async () => {
    const roommateRepository = new RoommateRepository();
    mockingoose(RoommateModel).toReturn([], "find"); //No existing roommate is found
    mockingoose(RoommateModel).toReturn(null, "save"); //Successfully save

    expect(await roommateRepository.create(roommate2)).toEqual(true);
    const roommate2Updated = cloneDeep(roommate2);
    roommate2Updated.profile.bio = "Recent NYU grad";

    const finderMock = (query) => {
      if (query.getQuery().username === roommate2.username) {
        return [roommateToDocument(roommate2)];
      }
    };
    mockingoose(RoommateModel).toReturn(finderMock, "find");

    const saveMock = (query) => {
      expect(query.profile.bio === roommate2Updated.profile.bio).toEqual(true);
    };

    mockingoose(RoommateModel).toReturn(saveMock, "save"); //Successfully save

    expect(
      await roommateRepository.update(
        roommate2Updated.username,
        roommate2Updated
      )
    ).toEqual(true);
  });
});
