import { injectable, inject } from "inversify";
import TYPES from "../../types";
import { RoommateRepository } from "../repository/RoommateRepository";
import { Roommate } from "../roommate/roommate";
import { RoommateProfile } from "../roommate/roommateProfile";
import voca from "voca";
import _ from "lodash";

@injectable()
export class RecommendationService {
  @inject(TYPES.RoommateRepository)
  private roommateRepository: RoommateRepository;

  private static readonly scores = {
    area: 3,
    bio: 4,
    hobbies: 2, //points per hobby match
    personality: 2, //points per personality match
  };

  private static readonly fieldsNotToCompare = [
    "firstName",
    "lastName",
    "email",
  ];

  /**
   * Returns the best matched roommates for a given roommate
   * @param roommate
   * @returns the top 10 most similar roommates if that many profiles exist with any shared attributes
   */
  public async getRecommendations(roommate: Roommate): Promise<Roommate[]> {
    //Get all users with any overlap of attributes at all
    const recommendedRoommates = await this.roommateRepository.findOverlap(
      roommate.profile,
      RecommendationService.fieldsNotToCompare
    );

    return _.chain(recommendedRoommates)
      .filter(
        (recommendedRoommate: Roommate) =>
          recommendedRoommate.username !== roommate.username
      )
      .sortBy(
        (otherRoommate: Roommate) =>
          -1 *
          this.getCompatibilityScore(otherRoommate.profile, roommate.profile)
      )
      .slice(0, 10)
      .value();
  }

  private getCompatibilityScore(
    profile1: RoommateProfile,
    profile2: RoommateProfile
  ): number {
    let score = 0;

    for (const [property, weight] of Object.entries(
      RecommendationService.scores
    )) {
      //Handle array matches
      if (Array.isArray(profile1[property])) {
        const sharedAttributes = _.intersection(
          profile1[property],
          profile2[property]
        );
        score += sharedAttributes.length * weight;
      } else if (
        !voca.isBlank(profile1[property]) &&
        profile1[property] === profile2[property]
      ) {
        //Handle normal matches, but ignore blank fields
        score += weight;
      }
    }

    return score;
  }
}
