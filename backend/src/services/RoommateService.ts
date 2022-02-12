import { injectable, inject } from "inversify";
import TYPES from "../../types";
import { RoommateRepository } from "../repository/RoommateRepository";
import { Roommate } from "../roommate/roommate";
import { RoommateProfile } from "../roommate/roommateProfile";
import "reflect-metadata";

@injectable()
export class RoommateService {
  @inject(TYPES.RoommateRepository)
  private roommateRepository: RoommateRepository;

  public async getAllRoommates(): Promise<Roommate[]> {
    return await this.roommateRepository.getAll();
  }

  public async findRoommatesWhere(
    profile: Partial<RoommateProfile>
  ): Promise<Roommate[]> {
    return await this.roommateRepository.findWhere(profile);
  }

  public async createRoommate(roommate: Roommate): Promise<boolean> {
    return await this.roommateRepository.create(roommate);
  }

  public async findRoommate(username: string): Promise<Roommate | null> {
    return await this.roommateRepository.findOne(username);
  }

  public async updateRoommate(
    username: string,
    roommateProfile: RoommateProfile
  ): Promise<boolean> {
    return await this.roommateRepository.update(username, roommateProfile);
  }
}
