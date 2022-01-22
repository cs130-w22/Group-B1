import { RoommateRepository } from "../../src/repository/RoommateRepository";
import { Area } from "../../../shared/src/area";

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
    jest.setTimeout(30000)
    const roommateRepository = new RoommateRepository();
    await expect(roommateRepository.create(testRoommate)).toEqual(true);
  });
});
