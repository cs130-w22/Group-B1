import {
  RoommateRepository,
  RoommateRepositoryImplMongo,
} from "../../src/repository/RoommateRepository";
import { Area } from "../../src/roommate/area";
import { describe, expect, it, beforeAll, afterAll } from "@jest/globals";
import { RoommateModel } from "../../src/repository/Schemas";
import { Roommate } from "../../src/roommate/roommate";
import { connect, disconnect } from "mongoose";
import * as dotenv from "dotenv";

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

const roommate1Updated: Roommate = {
  username: "Bob",
  password: "BobPassword",
  profile: {
    firstName: "Bobby",
    lastName: "Smith",
    email: "bob@gmail.com",
    area: "Austin" as Area,
    bio: "USC grad",
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
  let roommateRepository: RoommateRepository;

  beforeAll(async () => {
    roommateRepository = new RoommateRepositoryImplMongo();
    dotenv.config();

    const MONGODB_URL = process.env.DB_URL_TEST;
    await connect(MONGODB_URL);
    await RoommateModel.deleteMany({});
  });

  afterAll(async () => {
    await RoommateModel.deleteMany({});
    disconnect();
  });

  it("Creates, updates, finds, and deletes roommate", async () => {
    expect(await roommateRepository.create(roommate1)).toEqual(true);
    expect(await roommateRepository.create(roommate1)).toEqual(false);

    expect(await roommateRepository.create(roommate2)).toEqual(true);

    expect(await roommateRepository.findOne(roommate1.username)).toEqual(
      roommate1
    );
    expect(await roommateRepository.getAll()).toEqual(
      expect.arrayContaining(roommates)
    );

    expect(
      await roommateRepository.update(
        roommate1.username,
        roommate1Updated.profile
      )
    ).toEqual(true);
    expect(await roommateRepository.findOne(roommate1.username)).toEqual(
      roommate1Updated
    );

    expect(await roommateRepository.delete(roommate2.username)).toEqual(true);
    expect(await roommateRepository.findOne(roommate2.username)).toEqual(null);

    expect((await roommateRepository.getAll()).length).toEqual(1);
  });
});
