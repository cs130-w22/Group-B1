import { RoommateRepository } from "../../src/repository/RoommateRepository";
import { Area } from "../../../shared/src/area";
import { describe, expect, it } from "@jest/globals";
import {
  RoommateDoc,
  RoommateModel,
  RoommateProfileDoc,
  RoommateProfileModel,
} from "../../src/repository/Schemas";
import * as mockingoose from "mockingoose";
import { Roommate } from "../../../shared/src/roommate";

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

const roommateProfileDoc1: RoommateProfileDoc = {
  firstName: "Tom",
  lastName: "Richard",
  email: "tom@gmail.com",
  area: "Los Angeles" as Area,
  bio: "NYU grad",
  hobbies: [],
  personality: [],
  additionalInfo: "Looking for 1 roommate",
};

const roommateDoc1: RoommateDoc = {
  username: "Tom",
  password: "TomPassword",
  profile: roommateProfileDoc1,
};

const roommateProfileDoc2: RoommateProfileDoc = {
  firstName: "Bob",
  lastName: "Smith",
  email: "bob@gmail.com",
  area: "Austin" as Area,
  bio: "UCLA grad",
  hobbies: [],
  personality: [],
  additionalInfo: "Looking for 2 roommates",
};

const roommateDoc2: RoommateDoc = {
  username: "Bob",
  password: "BobPassword",
  profile: roommateProfileDoc2,
};

describe("Roommate Repository", () => {
  it("Creates roommate", async () => {
    const roommateRepository = new RoommateRepository();

    mockingoose(RoommateModel).toReturn([], "find"); //No existing roommate is found
    mockingoose(RoommateModel).toReturn(null, "save"); //Successfully save
    mockingoose(RoommateProfileModel).toReturn(null, "save"); //Successfully save

    expect(await roommateRepository.create(roommate1)).toEqual(true);
  });

  it("Create roommate 2", async () => {
    const roommateRepository = new RoommateRepository();
    mockingoose(RoommateModel).toReturn([], "find"); //No existing roommate is found
    mockingoose(RoommateModel).toReturn(null, "save"); //Successfully save
    mockingoose(RoommateProfileModel).toReturn(null, "save"); //Successfully save

    expect(await roommateRepository.create(roommate2)).toEqual(true);
  });

  it("Finds roommate ", async () => {
    const roommateRepository = new RoommateRepository();

    mockingoose(RoommateModel).toReturn([roommateDoc1], "find");
    mockingoose(RoommateProfileModel).toReturn([roommateProfileDoc1], "find");

    expect(await roommateRepository.findOne(roommate2.username)).toEqual(
      roommate2
    );
  });

  it("Find all roommates ", async () => {
    const roommateRepository = new RoommateRepository();

    mockingoose(RoommateModel).toReturn([roommateDoc1, roommateDoc2], "find");

    const allRoommates = await roommateRepository.getAll();
    expect(allRoommates).toEqual(expect.arrayContaining(roommates));
    expect(allRoommates.length).toEqual(roommates.length);
  });
});
