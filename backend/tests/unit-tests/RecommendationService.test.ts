import { RoommateRepository, RoommateRepositoryImplMongo } from "../../src/repository/RoommateRepository";
import { RecommendationService } from "../../src/services/RecommendationService";
import { Roommate } from "../../../shared/src/roommate";
import { RoommateProfile } from "../../../shared/src/roommateProfile";
import { Area } from "../../../shared/src/area";
import * as dotenv from "dotenv";
import TYPES from "../../types";

import container from "../../inversify.config";
import { injectable } from "inversify";
import { Test } from '@nestjs/testing';
import { jest, describe, expect, it, beforeAll, afterAll } from "@jest/globals";

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
        hobbies: ["hiking", "running", "cooking", "knitting", "tennis", "soccer", "gaming", "basketball"],
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
        lastName: "Smith",
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
    username: "Isabela",
    password: "IsabelaPassword",
    profile: {
        firstName: "Isabela",
        lastName: "Smith",
        email: "Isabela@gmail.com",
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


describe("Recommendation Service", () => {
    let recommendationService: RecommendationService;
  
    beforeAll(async () => {
      recommendationService = new RecommendationService();
      dotenv.config();
      // Best plan is to not do anything fancy with the injection, do what deborah did
      // First merge andre-backend in this branch first though
    });

    
    afterAll(async () => {
      
    });
  
    it("Checks ranking of recommended roommates", async () => {
        
    });
  });


//Mock the RommateRepository to return these 12
//Ensure that the RecommendationService returns the top 10 in the correct order