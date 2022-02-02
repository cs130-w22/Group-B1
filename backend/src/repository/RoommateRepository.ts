import { Roommate } from "../../../shared/src/roommate";
import { RoommateProfile } from "../../../shared/src/roommateProfile";
import { RoommateModel } from "./Schemas";
import { injectable } from "inversify";
import "reflect-metadata";

export interface RoommateRepository {
  create(roommate: Roommate): Promise<boolean>;
  findOne(username: string): Promise<Roommate | null>;
  findOverlap(profileFields: Partial<RoommateProfile>, keysToIgnore?: string[]): Promise<Roommate[]>
  getAll(): Promise<Roommate[]>;
  update(username: string, roommate: Roommate): Promise<boolean>;
  delete(username: string): Promise<boolean>;
}

@injectable()
export class RoommateRepositoryImplMongo implements RoommateRepository {
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
   * Get roommates that match any of the similar attributes
   * @param profileFields to match
   * @param keysToIgnore a list of keys that will not be used to match
   * @returns List of matching roommates
   */
  async findOverlap(profileFields: Partial<RoommateProfile>, keysToIgnore: string[] = []): Promise<Roommate[]> {

    //Convert object to list of {profile.key : value}, flattening the lists as well, to make the query arg
    const fields = Object.entries(profileFields).flatMap(function ([key, value]) {

      if (keysToIgnore.includes(key)) {
        return [];
      }

      const new_key = `profile.${key}`;
      if (Array.isArray(value)) {
        return value.map((x: string) => ({ [new_key]: x }));
      }
      else {
        return { [new_key]: value };
      }
    });

    const to_match = {
      "$or": fields
    }

    const roommateDocs = await RoommateModel.find(to_match);

    return roommateDocs.map((roommateDoc) => roommateDoc.toObject());
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
