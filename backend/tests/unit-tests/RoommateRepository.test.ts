import { RoommateRepository } from "../../src/repository/RoommateRepository";
import { Area } from "../../../shared/src/area";
import { describe, expect, it } from "@jest/globals";

const testRoommate = {
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
  roommateList: [],
};

describe("Roommate Repository", () => {
  it("Creates roommate", async () => {
    const roommateRepository = new RoommateRepository();
    expect(await roommateRepository.create(testRoommate)).toEqual(true);
  });
});
