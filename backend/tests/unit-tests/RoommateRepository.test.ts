import { RoommateRepository } from "../../src/repository/RoommateRepository";
import { Area } from "../../../shared/src/area";
import { describe, expect, it, beforeAll, afterAll } from "@jest/globals";
import jestConfig from "../../jest.config";
import { connect, connection } from "mongoose";
import * as dotenv from "dotenv";
import { RoommateDoc, RoommateModel, RoommateProfileDoc, RoommateProfileModel } from "../../src/repository/Schemas";
import * as mockingoose from "mockingoose";
import { Roommate } from "../../../shared/src/roommate";
import { RoommateProfile } from "../../../shared/src/roommateProfile";


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
  roommateList: [],
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
  roommateList: [],
};

const roommates = [roommate1, roommate2]

const roommateDoc1: RoommateDoc = {
  username: "Tom",
  password: "TomPassword",
  profile: "tom@gmail.com",
  roommateList: [],
};

const roommateProfileDoc1: RoommateProfileDoc = {
  firstName: "Tom",
  lastName: "Richard",
  email: "tom@gmail.com",
  area: "Los Angeles" as Area,
  bio: "NYU grad",
  hobbies: [],
  personality: [],
  additionalInfo: "Looking for 1 roommate"
};

const roommateDoc2: RoommateDoc = {
  username: "Bob",
  password: "BobPassword",
  profile: "bob@gmail.com",
  roommateList: [],
};

const roommateProfileDoc2: RoommateProfileDoc = {
  firstName: "Bob",
  lastName: "Smith",
  email: "bob@gmail.com",
  area: "Austin" as Area,
  bio: "UCLA grad",
  hobbies: [],
  personality: [],
  additionalInfo: "Looking for 2 roommates"
};

// beforeAll(() => {
//   //Connect to DB
//   dotenv.config();
//   const MONGODB_URL = process.env.DB_URL_DEV;
//   connect(MONGODB_URL).then(() => {
//   console.log("Connected to database");

//   //Clear all documents
//   RoommateModel.deleteMany({})
//   .then(()=>{})
//   .catch((err) => {
//     console.log(err.message);
//   })
//   RoommateProfileModel.deleteMany({})
//   .then(()=>{})
//   .catch((err) => {
//     console.log(err.message);
//   });

// })
//   .catch(err => {
//     console.error("Failed to connect to database: ", err.message);
//     process.exit(1);
//   });

// });

afterAll(done => {
  // Disconnect DB, allows Jest to end successfully
  connection.close()
  done()
})

describe("Roommate Repository", () => {
  it("Creates roommate", async () => {
    const roommateRepository = new RoommateRepository();

    mockingoose(RoommateModel).toReturn([], 'find'); //No existing roommate is found
    mockingoose(RoommateModel).toReturn(null, 'save'); //Successfully save
    mockingoose(RoommateProfileModel).toReturn(null, 'save'); //Successfully save

    
    expect(await roommateRepository.create(roommate1)).toEqual(true);
  });

  it("Create roommate 2", async () => {
    const roommateRepository = new RoommateRepository();
    mockingoose(RoommateModel).toReturn([], 'find'); //No existing roommate is found
    mockingoose(RoommateModel).toReturn(null, 'save'); //Successfully save
    mockingoose(RoommateProfileModel).toReturn(null, 'save'); //Successfully save

    expect(await roommateRepository.create(roommate2)).toEqual(true);
  });

  it("Finds roommate ", async () => {
    const roommateRepository = new RoommateRepository();

    mockingoose(RoommateModel).toReturn([roommateDoc1], 'find');
    mockingoose(RoommateProfileModel).toReturn([roommateProfileDoc1], 'find');

    expect(await roommateRepository.findOne(roommate2.username)).toEqual(roommate2);
  });

  it("Find all roommates ", async () => {
    const roommateRepository = new RoommateRepository();
    const allRoommates = await roommateRepository.getAll();
    mockingoose(RoommateModel).toReturn([roommateDoc1, roommateDoc2], 'find');
    mockingoose(RoommateProfileModel).toReturn(roommateProfileDoc1, 'find');
    mockingoose(RoommateProfileModel).toReturn(roommateProfileDoc2, 'find');

    expect(allRoommates).toContain(roommates);
    expect(allRoommates.length).toEqual(roommates.length);
  });



});
