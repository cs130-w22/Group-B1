import { Roommate } from "../../../shared/src/roommate";
import { RoommateModel } from "./Schemas";
import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class RoommateRepository {
  /**
   * Create a Roommate
   * @param roommate Roommate as represented in Shared folder
   * @returns False if already exists, true if entered successfully
   */
  async create(roommate: Roommate): Promise<boolean> {
    const existingRoommate = await RoommateModel.findOne({
      username: roommate.username,
    });
    if (existingRoommate) {
      return false;
    }
    const roommateDoc = new RoommateModel(roommate);
    await roommateDoc.save();
    return true;
  }

  /**
   * Finds a roommate given a username
   * @param username
   * @returns Null if does not exist, otherwise Roommate
   */
  async findOne(username: string): Promise<Roommate | null> {
    const roommate = await RoommateModel.findOne({ username: username });
    return roommate ? roommate.toObject() : null;
  }

  /**
   * Get all of the roommates
   * @returns List of all roommates
   */
  async getAll(): Promise<Roommate[]> {
    const roommateDocs = await RoommateModel.find();
    return roommateDocs.map((roommateDoc) => roommateDoc.toObject());
  }

  /**
   * Updates a roommate with a given username
   * @param username
   * @param roommate
   * @returns False if the roommate did not exist, true if update succeedd
   */
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

  /**
   * Deletes a roommate given a username
   * @param username
   * @returns True if the roommate was deleted, false otherwise
   */
  async delete(username: string): Promise<boolean> {
    return (await RoommateModel.deleteOne({ username })).deletedCount == 1;
  }
}
