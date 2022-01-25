import { Roommate } from "../../../shared/src/roommate";
import { roommateToDocument, RoommateModel } from "./Schemas";
import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class RoommateRepository {
  /**
   * Create a Roommate
   * @param roommate Roommate as represented in Shared folder
   * @returns false if already exists, true if entered successfully
   */
  async create(roommate: Roommate): Promise<boolean> {
    const existingRoommate = await RoommateModel.findOne({
      username: roommate.username,
    });
    if (existingRoommate) {
      return false;
    }
    const roommateDoc = roommateToDocument(roommate);
    await roommateDoc.save();
    return true;
  }

  /**
   * Finds a roommate given a username
   * @param username
   * @returns null if does not exist, otherwise Roommate as defined in shared
   */
  async findOne(username: string): Promise<Roommate | null> {
    const roommateDoc = await RoommateModel.findOne({ username: username });
    if (!roommateDoc) {
      return null;
    }
    return roommateDoc.toObject();
  }

  /**
   * Get all of the roommates
   * @returns Promise<Roommate[]> List of Roommates
   */
  async getAll(): Promise<Roommate[]> {
    const roommateDocs = await RoommateModel.find();
    return roommateDocs.map((roommateDoc) => roommateDoc.toObject());
  }

  async update(username: string, roommate: Roommate): Promise<boolean> {
    const roommateDoc = await RoommateModel.findOne({ username: username });
    if (!roommateDoc) {
      return false;
    }
    roommateDoc.password = roommate.password;
    Object.assign(roommateDoc.profile, roommate.profile);
    await roommateDoc.save();
    return true;
  }

  async delete(username: string): Promise<boolean> {
    return (await RoommateModel.deleteOne({ username })).acknowledged;
  }
}
