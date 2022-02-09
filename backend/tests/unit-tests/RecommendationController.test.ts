import TYPES from "../../types";
import container from "../../inversify.config";
import { describe, expect, it, beforeAll, afterAll } from "@jest/globals";
import { Roommate } from "../../src/roommate/roommate";
import { RoommateProfile } from "../../src/roommate/roommateProfile";
import { Area } from "../../src/roommate/area";
import { RecommendationService } from "../../src/services/RecommendationService";
import { RoommateService } from "../../src/services/RoommateService";
import { AuthorizationMiddleware } from "../../src/middleware/AuthorizationMiddleware";
import { Request, Response, NextFunction } from "express";

import { injectable } from "inversify";
import request from "supertest";
import { RegistrableController } from "../../src/controllers/RegistrableController";
import express from "express";
import { json } from "body-parser";

const user: Roommate = {
  username: "Bob",
  password: "BobPassword",
  profile: {
    firstName: "Bob",
    lastName: "Smith",
    email: "bob@gmail.com",
    area: "Austin" as Area,
    bio: "",
    hobbies: [],
    personality: [],
    additionalInfo: "",
  },
};

const match1: Roommate = {
  username: "Tom",
  password: "TomPassword",
  profile: {
    firstName: "Tom",
    lastName: "Smith",
    email: "tom@gmail.com",
    area: "Austin" as Area,
    bio: "",
    hobbies: [],
    personality: [],
    additionalInfo: "",
  },
};

const match2: Roommate = {
  username: "Julia",
  password: "JuliaPassword",
  profile: {
    firstName: "Julia",
    lastName: "West",
    email: "julia@gmail.com",
    area: "Austin" as Area,
    bio: "",
    hobbies: [],
    personality: [],
    additionalInfo: "",
  },
};

const matches = [match1, match2];
const matchesProfile = matches.map((roommate: Roommate) => {
  return roommate.profile;
});

@injectable()
class RoommateServiceMock extends RoommateService {
  public async getAllRoommates(): Promise<Roommate[]> {
    throw new Error("Function should not be called for this unit test");
  }

  public async createRoommate(roommate: Roommate): Promise<boolean> {
    throw new Error("Function should not be called for this unit test");
  }

  public async updateRoommate(
    username: string,
    roommateProfile: RoommateProfile
  ): Promise<boolean> {
    throw new Error("Function should not be called for this unit test");
  }
  public async findRoommate(username: string): Promise<Roommate | null> {
    if (username == user.username) {
      return user;
    } else if (username == match1.username) {
      return match1;
    } else {
      return null;
    }
  }
}

@injectable()
class RecommendationServiceMock extends RecommendationService {
  public async getRecommendations(roommate: Roommate): Promise<Roommate[]> {
    if (roommate === user) {
      return matches;
    } else {
      throw new Error("An unexpected user was used as an argument");
    }
  }
}

@injectable()
class AuthorizationMiddlewareMock extends AuthorizationMiddleware {
  public verifyToken = (req: Request, res: Response, next: NextFunction) => {
    next();
  };
}

describe("GET /recommendations", function () {
  const app = express();
  app.use(json());

  beforeAll(async () => {
    container.snapshot();
    container.unbind(TYPES.RoommateService);
    container.unbind(TYPES.RecommendationService);
    container.unbind(TYPES.AuthorizationMiddleware);

    container
      .bind<RoommateService>(TYPES.RoommateService)
      .to(RoommateServiceMock);

    container
      .bind<RecommendationService>(TYPES.RecommendationService)
      .to(RecommendationServiceMock);

    container
      .bind<AuthorizationMiddleware>(TYPES.AuthorizationMiddleware)
      .to(AuthorizationMiddlewareMock);

    const controllers: RegistrableController[] =
      container.getAll<RegistrableController>(TYPES.Controller);
    controllers.forEach((controller) => controller.register(app));
  });

  afterAll(async () => {
    container.restore();
  });

  it("No Username Given", async function () {
    const response = await request(app)
      .get("/recommendations")
      .set("Accept", "application/json")
      .send();
    expect(response.status).toEqual(400);
  });

  it("Cannot Find Username", async function () {
    const response = await request(app)
      .get(`/recommendations/?username=${match2.username}`)
      .set("Accept", "application/json")
      .send();
    expect(response.status).toEqual(404);
  });

  it("Trigger an Internal Error", async function () {
    //match1 will trigger internal error because of way RecommendationServiceMock.getRecommendations is mocked
    const response = await request(app)
      .get(`/recommendations/?username=${match1.username}`)
      .set("Accept", "application/json")
      .send();
    expect(response.status).toEqual(500);
  });

  it("Successful Recommendation Get", async function () {
    const response = await request(app)
      .get(`/recommendations/?username=${user.username}`)
      .set("Accept", "application/json")
      .send();
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(matchesProfile);
  });
});
