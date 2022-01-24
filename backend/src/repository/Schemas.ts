import { Schema, model, HydratedDocument } from "mongoose";
import { Roommate } from "../../../shared/src/roommate";
import { RoommateProfile } from "../../../shared/src/roommateProfile";
import { Area } from "../../../shared/src/area";
import { Hobby } from "../../../shared/src/hobby";
import { PersonalityTrait } from "../../../shared/src/personalityTrait";

//Repeat the Interfaces in Shared, but for the DB, with minor changes
//--------------------------------------------------
export interface RoommateDoc {
  username: string;
  password: string;
  profile: RoommateProfileDoc; //Stores roomateProfile email instead of entire profile
}

export interface RoommateProfileDoc {
  firstName: string;
  lastName: string;
  email: string;
  area: string;
  bio: string;
  hobbies: string[];
  personality: string[];
  additionalInfo: string;
}

//Make Schemas, the outlines for our documents
//---------------------------------------------
const roommateProfileSchema = new Schema<RoommateProfileDoc>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  area: { type: String, required: true },
  bio: { type: String, required: true },
  hobbies: { type: [String], required: true },
  personality: { type: [String], required: true },
  additionalInfo: { type: String, required: true },
});

const roommateSchema = new Schema<RoommateDoc>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  profile: roommateProfileSchema,
  //TODO: implement roommateList, thinking: roommateList :{type: [String], required: true}
});

//Make Models, the constructors that make documents
//-------------------------------------------------
export const RoommateModel = model<RoommateDoc>("Roommate", roommateSchema);
export const RoommateProfileModel = model<RoommateProfileDoc>(
  "RoommateProfile",
  roommateProfileSchema
);

//Functions to Convert Shared Classes to DB Models
//------------------------------------------------
export const roommateToDocument = (
  roommate: Roommate
): HydratedDocument<RoommateDoc> => {
  const roommateDoc = new RoommateModel({
    username: roommate.username,
    password: roommate.password,
    profile: roommate.profile,
  });
  return roommateDoc;
};

export const roommateProfileToDocument = (
  roommateProfile: RoommateProfile
): HydratedDocument<RoommateProfileDoc> => {
  const roommateProfileDoc = new RoommateProfileModel({ ...roommateProfile });
  return roommateProfileDoc;
};

//Functions to Convert DB models to Shared Classes
//------------------------------------------------

export const documentToRoommateProfile = (
  roommateProfileDoc: HydratedDocument<RoommateProfileDoc>
): RoommateProfile => {
  const roommateProfile = {
    firstName: roommateProfileDoc.firstName,
    lastName: roommateProfileDoc.lastName,
    email: roommateProfileDoc.email,
    area: roommateProfileDoc.area as Area,
    bio: roommateProfileDoc.bio,
    hobbies: roommateProfileDoc.hobbies as Hobby[],
    personality: roommateProfileDoc.personality as PersonalityTrait[],
    additionalInfo: roommateProfileDoc.additionalInfo,
  };
  return roommateProfile;
};

export const documentsToRoommate = (
  roommateDoc: HydratedDocument<RoommateDoc>
): Roommate => {
  const roommateProfileDoc = roommateDoc.profile;
  const profile = {
    firstName: roommateProfileDoc.firstName,
    lastName: roommateProfileDoc.lastName,
    email: roommateProfileDoc.email,
    area: roommateProfileDoc.area as Area,
    bio: roommateProfileDoc.bio,
    hobbies: roommateProfileDoc.hobbies as Hobby[],
    personality: roommateProfileDoc.personality as PersonalityTrait[],
    additionalInfo: roommateProfileDoc.additionalInfo,
  };
  const roommate = {
    username: roommateDoc.username,
    password: roommateDoc.password,
    profile,
  };
  return roommate;
};
