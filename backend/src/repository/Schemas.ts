import { Schema, model, HydratedDocument } from "mongoose";
import { Roommate } from "../../../shared/src/roommate";

//Make Schemas, the outlines for our documents
//---------------------------------------------
const roommateSchema = new Schema<Roommate>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      area: { type: String, required: true },
      bio: { type: String, required: true },
      hobbies: { type: [String], required: true },
      personality: { type: [String], required: true },
      additionalInfo: { type: String, required: true },
    },
  },
  {
    toObject: {
      versionKey: false,
      transform: function (doc, ret) {
        delete ret._id;
      },
    },
  }
);

//Make Models, the constructors that make documents
//-------------------------------------------------
export const RoommateModel = model<Roommate>("Roommate", roommateSchema);

//Functions to Convert Shared Classes to DB Models
//------------------------------------------------
export const roommateToDocument = (
  roommate: Roommate
): HydratedDocument<Roommate> => {
  const roommateDoc = new RoommateModel({
    username: roommate.username,
    password: roommate.password,
    profile: roommate.profile,
  });
  return roommateDoc;
};
