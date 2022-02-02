import { Schema, model } from "mongoose";
import { Roommate } from "../roommate/roommate";

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

export const RoommateModel = model<Roommate>("Roommate", roommateSchema);
