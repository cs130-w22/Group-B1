import { injectable, inject } from "inversify";
import TYPES from "../../types";
import { RoommateRepository } from "../repository/RoommateRepository";
import { Roommate } from "../roommate/roommate";
import { RoommateProfile } from "../roommate/roommateProfile";
import "reflect-metadata";

/**
 * RoommateService handles the logic of getting, creating, and updating roommates.
 */
@injectable()
export class RoommateService {
  @inject(TYPES.RoommateRepository)
  private roommateRepository: RoommateRepository;

  /**
   * Get all of the roommates.
   * @returns All of the roommates that exist.
   */
  public async getAllRoommates(): Promise<Roommate[]> {
    return await this.roommateRepository.getAll();
  }

  /**
   * Finds a roommate whose profile matches profile fields.
   * @param profile A partial RoommateProfile, which must all match the roommate to find.
   * @returns An array of roommates who match search criteria.
   */
  public async findRoommatesWhere(
    profile: Partial<RoommateProfile>
  ): Promise<Roommate[]> {
    return await this.roommateRepository.findWhere(profile);
  }

  /**
   * Creates a roommate
   * @param roommate Roommate to create.
   * @returns  False if the roommate already exists, true if the roommate was created successfully.
   */
  public async createRoommate(roommate: Roommate): Promise<boolean> {
    return await this.roommateRepository.create(roommate);
  }

  /**
   * Finds a single roommate given a username.
   * @param username The username of the roommate to find.
   * @returns False if the roommate already exists, true if entered successfully
   */
  public async findRoommate(username: string): Promise<Roommate | null> {
    return await this.roommateRepository.findOne(username);
  }

  /**
   * Updates a roommate profile.
   * @param username The username of the user to update.
   * @param roommateProfile The new roommate profile the user should have.
   * @returns False if the roommate did not exist, true if update succeedd
   */
  public async updateRoommate(
    username: string,
    roommateProfile: RoommateProfile
  ): Promise<boolean> {
    return await this.roommateRepository.update(username, roommateProfile);
  }
}
