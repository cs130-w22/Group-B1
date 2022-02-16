import { injectable, inject } from "inversify";
import TYPES from "../../types";
import { RoommateRepository } from "../repository/RoommateRepository";
import "reflect-metadata";

@injectable()
export class ListService {
  @inject(TYPES.RoommateRepository)
  private roommateRepository: RoommateRepository;

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
