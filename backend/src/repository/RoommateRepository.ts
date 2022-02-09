import { Roommate } from "../roommate/roommate";
import { RoommateProfile } from "../roommate/roommateProfile";
import { RoommateModel } from "./Schemas";
import { injectable } from "inversify";
import "reflect-metadata";

export interface RoommateRepository {
  create(roommate: Roommate): Promise<boolean>;
  findOne(username: string): Promise<Roommate | null>;
  getAll(): Promise<Roommate[]>;
  update(username: string, roommateProfile: RoommateProfile): Promise<boolean>;
  delete(username: string): Promise<boolean>;
}

@injectable()
export class RoommateRepositoryImplMongo implements RoommateRepository {
  /**
   * Create a Roommate
   * @param roommate Roommate as represented in roommate folder
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
   * Updates a roommate's profile with a given username
   * @param username
   * @param roommate
   * @returns False if the roommate did not exist, true if update succeedd
   */
  async update(
    username: string,
    roommateProfile: RoommateProfile
  ): Promise<boolean> {
    const roommateDoc = await RoommateModel.findOne({ username: username });
    if (!roommateDoc) {
      return false;
    }
    roommateDoc.profile = roommateProfile;
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
