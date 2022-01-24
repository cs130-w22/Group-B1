import { Roommate } from "../../../shared/src/roommate";
import {
  roommateToDocument,
  documentsToRoommate,
  RoommateModel,
  RoommateDoc,
} from "./Schemas";
import { injectable } from "inversify";
import { HydratedDocument } from "mongoose";
import "reflect-metadata";

@injectable()
export class RoommateRepository {
  /**
   * Create a Roommate
   * @param roommate Roommate as represented in Shared folder
   * @returns false if already exists, true if entered successfully
   */
  async create(roommate: Roommate): Promise<boolean> {
    const existingRoommate = await this.findOne(roommate.username);
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
    const roommateDoc = await this.findRoommateDoc(username);
    if (!roommateDoc) {
      return null;
    }
    return documentsToRoommate(roommateDoc);
  }

  /**
   * Get all of the roommates
   * @returns Promise<Roommate[]> List of Roommates
   */
  async getAll(): Promise<Roommate[]> {
    const roommateDocs = await RoommateModel.find();
    return roommateDocs.map((roommateDoc) => documentsToRoommate(roommateDoc));
  }

  async update(username: string, roommate: Roommate): Promise<boolean> {
    const roommateDoc = await this.findRoommateDoc(username);
    if (!roommateDoc) {
      return false;
    }
    roommateDoc.password = roommate.password;
    Object.assign(roommateDoc.profile, roommate.profile);
    await roommateDoc.save();
    return true;
  }

  delete(id: string): Promise<Roommate> {
    throw new Error("Method not implemented.");
  }

  /**
   * Given a username returns a RoommateDoc object
   * @param username
   * @returns HydratedDocument<Roommate> or null if does not exist
   */
  private async findRoommateDoc(
    username: string
  ): Promise<HydratedDocument<RoommateDoc> | null> {
    const roommateDocs = await RoommateModel.find({ username: username });
    console.log({ fn: "findRoommateDoc", roommateDocs });
    if (roommateDocs.length == 0) {
      return null;
    } else if (roommateDocs.length > 1) {
      const error_str = `Error there are multiple Roommates with the username: ${username}`;
      console.log(error_str);
      return null;
    } else {
      return roommateDocs[0];
    }
  }
}
