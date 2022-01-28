import { injectable, inject } from "inversify";
import TYPES from "../../types";
import { RoommateRepository } from "../repository/RoommateRepository";
import { Roommate } from "../../../shared/src/roommate";
import "reflect-metadata";

@injectable()
export class RecommendationService {
    @inject(TYPES.RoommateRepository)
    private roommateRepository: RoommateRepository;

    public async getRecommendations(username: string): Promise<Roommate[]> {
        throw new Error('Method not implemented.');
    }
    

}
