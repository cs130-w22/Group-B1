import { RoommateRepository } from "../../src/repository/RoommateRepository";
import { RecommendationService } from "../../src/services/RecommendationService";
import { Roommate } from "../../src/roommate/roommate";
import { RoommateProfile } from "../../src/roommate/roommateProfile";
import { Area } from "../../src/roommate/area";
import * as dotenv from "dotenv";
import TYPES from "../../types";

import container from "../../inversify.config";
import { injectable } from "inversify";
import { describe, expect, it, beforeAll, afterAll } from "@jest/globals";

//This user will not be matched with anyone
const blankRoommate: Roommate = {
  username: "RyanIsCool",
  password: "SuperHashedPassword",
  profile: {
    firstName: "Ryan",
    lastName: "Richard",
    email: "",
    area: "Seattle" as Area,
    bio: "",
    hobbies: [],
    personality: [],
    additionalInfo: "",
  },
};

//Create a user roommate, and then 5 increasingly related users
const user: Roommate = {
  username: "Bob",
  password: "BobPassword",
  profile: {
    firstName: "Bob",
    lastName: "Smith",
    email: "bob@gmail.com",
    area: "Austin" as Area,
    bio: "",
    hobbies: [
      "hiking",
      "running",
      "cooking",
      "knitting",
      "tennis",
      "soccer",
      "gaming",
      "basketball",
    ],
    personality: ["introvert", "feeler", "judger", "thinker", "perceiver"],
    additionalInfo: "",
  },
};

//Shares same area only
const match1: Roommate = {
  username: "Tom",
  password: "TomPassword",
  profile: {
    firstName: "Tom",
    lastName: "Smith",
    email: "tom@gmail.com",
    area: "Austin" as Area,
    bio: "",
    hobbies: ["reading"],
    personality: ["extrovert", "sensor"],
    additionalInfo: "",
  },
};

//Share area + 1 hobby
const match2: Roommate = {
  username: "Julia",
  password: "JuliaPassword",
  profile: {
    firstName: "Julia",
    lastName: "West",
    email: "julia@gmail.com",
    area: "Austin" as Area,
    bio: "",
    hobbies: ["reading", "hiking"],
    personality: ["extrovert", "sensor"],
    additionalInfo: "",
  },
};

//Share area + 1 hobby + 1 personality
const match3: Roommate = {
  username: "Isabela",
  password: "IsabelaPassword",
  profile: {
    firstName: "Isabela",
    lastName: "Smith",
    email: "Isabela@gmail.com",
    area: "Austin" as Area,
    bio: "",
    hobbies: ["reading", "hiking"],
    personality: ["introvert"],
    additionalInfo: "",
  },
};

//Share area + 2 hobbies + 1 personality
const match4: Roommate = {
  username: "Carly",
  password: "CarlyPassword",
  profile: {
    firstName: "Carly",
    lastName: "Johnson",
    email: "Carly@gmail.com",
    area: "Austin" as Area,
    bio: "",
    hobbies: ["reading", "hiking", "cooking"],
    personality: ["introvert"],
    additionalInfo: "",
  },
};

//Share area + 2 hobbies + 2 personality
const match5: Roommate = {
  username: "John",
  password: "JohnPassword",
  profile: {
    firstName: "John",
    lastName: "Smith",
    email: "John@gmail.com",
    area: "Austin" as Area,
    bio: "",
    hobbies: ["reading", "hiking", "cooking"],
    personality: ["sensor", "introvert", "feeler"],
    additionalInfo: "",
  },
};

const correctRecommnedations = [match5, match4, match3, match2, match1];
const correctNames = correctRecommnedations.map((roommate: Roommate) => {
  return roommate.profile.firstName;
});

@injectable()
class RoommateRepositoryMock implements RoommateRepository {
  async create(roommate: Roommate): Promise<boolean> {
    throw new Error("Function should not be called for this unit test");
  }

  async findOne(username: string): Promise<Roommate | null> {
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
    if (profileFields === user.profile) {
      //Give the matches for user in a random order
      return [match1, match2, match3, match4, match5].sort(
        (_a, _b) => 0.5 - Math.random()
      );
    }
    if (profileFields === blankRoommate.profile) {
      return [];
    } else {
      throw new Error(
        "Can only give overlapping profiles for 'user' test roommate"
      );
    }
  }
}

describe("Recommendation Service", () => {
  let recommendationService: RecommendationService;

  beforeAll(async () => {
    container.snapshot();

    dotenv.config();

    container.unbind(TYPES.RoommateRepository);
    container
      .bind<RoommateRepository>(TYPES.RoommateRepository)
      .to(RoommateRepositoryMock);

    recommendationService = container.get<RecommendationService>(
      TYPES.RecommendationService
    );
  });

  afterAll(async () => {
    container.restore();
  });

  it("Checks ranking of recommended roommates", async () => {
    const reccommendedUsers = await recommendationService.getRecommendations(
      user
    );
    const foundNames = reccommendedUsers.map((roommate: Roommate) => {
      return roommate.profile.firstName;
    });
    try {
      expect(reccommendedUsers).toEqual(correctRecommnedations);
    } catch (err) {
      let moreInfo = `Matches are supposed to be:  ${correctNames} \n
                instead they are ${foundNames}`;
      err.message = `${err.message}\n\n: ${moreInfo}`;
      throw err;
    }

    expect(
      await recommendationService.getRecommendations(blankRoommate)
    ).toEqual([]);
  });
});
