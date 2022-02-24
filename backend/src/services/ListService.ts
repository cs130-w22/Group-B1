import { injectable, inject } from "inversify";
import TYPES from "../../types";
import { RoommateRepository } from "../repository/RoommateRepository";
import "reflect-metadata";

/**
 * ListService handles the logic of adding or removing a user from another user's roommate list.
 */
@injectable()
export class ListService {
  @inject(TYPES.RoommateRepository)
  private roommateRepository: RoommateRepository;

  /**
   * Add a roommate to another user's roommate list.
   * @param username The username of the user who owns the roommate list.
   * @param usernameToAdd The username of the roommate to be added to the list.
   * @returns The updated roommate list on success.
   */
  public async addToRoommateList(
    username: string,
    usernameToAdd: string
  ): Promise<string[]> {
    // check if the added user is in database
    const roommateDoc = await this.roommateRepository.findOne(usernameToAdd);
    if (!roommateDoc) {
      throw new Error(
        `The user being added [${usernameToAdd}] does not exist.`
      );
    }
    return await this.roommateRepository.addToRoommateList(
      username,
      usernameToAdd
    );
  }

  /**
   * Delete a roommate from another user's roommate list.
   * @param username The username of the user who owns the roommate list.
   * @param usernameToDelete The username of the roommate to be deleted from the list.
   * @returns The updated roommate list on success.
   */
  public async deleteFromRoommateList(
    username: string,
    usernameToDelete: string
  ): Promise<string[]> {
    // check if the deleted user is in database
    const roommateDoc = await this.roommateRepository.findOne(usernameToDelete);
    if (!roommateDoc) {
      throw new Error(
        `The user being deleted [${usernameToDelete}] does not exist.`
      );
    }
    return await this.roommateRepository.deleteFromRoommateList(
      username,
      usernameToDelete
    );
  }
}
