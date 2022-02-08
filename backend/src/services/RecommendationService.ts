import { injectable, inject } from "inversify";
import TYPES from "../../types";
import { RoommateRepository } from "../repository/RoommateRepository";
import { Roommate } from "../../../shared/src/roommate";
import { RoommateProfile } from "../../../shared/src/roommateProfile";
import "reflect-metadata";

@injectable()
export class RecommendationService {
    @inject(TYPES.RoommateRepository)
    private roommateRepository: RoommateRepository;

    private static readonly scores = {
        "area": 3,
        "bio": 4,
        "hobbies": 2, //points per hobby match
        "personality": 2 //points per personality match
    };

    private static readonly fieldsNotToCompare = [
        "firstName",
        "lastName",
        "email"
    ]

    /**
     * Returns the best matched roommates for a given roommate
     * @param roommate 
     * @returns top 10 scored simiar roommates if there are that many in the database
     */
    public async getRecommendations(roommate: Roommate): Promise<Roommate[]> {

        //Get all users with any overlap of attributes at all
        let recommendedRoommates = await this.roommateRepository.findOverlap(roommate.profile, RecommendationService.fieldsNotToCompare);

        //Remove the given roommate from the list
        recommendedRoommates = recommendedRoommates.filter((recommendedRoommate: Roommate) => recommendedRoommate.username !== roommate.username);

        //Get all other Roommate's score with our roommate
        const roommatesAndScores = recommendedRoommates.map(
            recommendedRoommate => {
                return {
                    roommate: recommendedRoommate,
                    score: this.getCompatibilityScore(recommendedRoommate.profile, roommate.profile)
                }
            }
        );

        //Sort by score
        roommatesAndScores.sort((a, b) => {
            return b.score - a.score;
        });

        let finalRecommendations = roommatesAndScores.map((a) => {
            return a.roommate;
        });

        return finalRecommendations.slice(0, 10);
    }

    private getCompatibilityScore(profile1: RoommateProfile, profile2: RoommateProfile): number {
        let score = 0;

        for (const property in RecommendationService.scores) {

            //Handle array matches
            if (Array.isArray(RecommendationService.scores[property])) {
                const sharedAttributes = profile1[property].filter(value => profile2[property].includes(value));
                score += sharedAttributes.length * RecommendationService.scores[property]
            }
            else { //Handle normal matches, but ignore blank fields
                if (! profile1[property].isBlank() && profile1[property] === profile2[property]) {
                    score += RecommendationService.scores[property]
                }
            }
        }

        return score;
    }

}
