import { injectable, inject } from "inversify";
import TYPES from "../../types";
import { RoommateRepository } from "../repository/RoommateRepository";
import { Roommate } from "../../../shared/src/roommate";

@injectable()
export class RoommateService {
  @inject(TYPES.RoommateRepository)
  private roommateRepository: RoommateRepository;

  public async getAllRoommates(): Promise<Roommate[]> {
    return await this.roommateRepository.getAll();
  }

  public async createRoommate(roommate: Roommate): Promise<boolean> {
    return await this.roommateRepository.create(roommate);
  }

  public async updateRoommate(
    username: string,
    roommate: Roommate
  ): Promise<boolean> {
    return await this.roommateRepository.update(username, roommate);
  }
}
