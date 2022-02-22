import { Application, Request, Response } from "express";
import { injectable, inject } from "inversify";
import TYPES from "../../types";
import { RecommendationService } from "../services/RecommendationService";
import { RoommateService } from "../services/RoommateService";
import { AuthorizationMiddleware } from "../middleware/AuthorizationMiddleware";
import { RegistrableController } from "./RegistrableController";

/**
 * RecommendationController manages an endpoint that recommends roommates for a given user.
 */
@injectable()
export class RecommendationController implements RegistrableController {
  @inject(TYPES.RecommendationService)
  private recommendationService: RecommendationService;

  @inject(TYPES.RoommateService)
  private roommmateService: RoommateService;

  @inject(TYPES.AuthorizationMiddleware)
  private authorizationMiddleware: AuthorizationMiddleware;

  public register(app: Application): void {
    app
      .route("/roommate/recommendations/:username")
      .get(this.authorizationMiddleware.verifyToken, this.getRecommendations);
  }

  private getRecommendations = async (req: Request, res: Response) => {
    try {
      const username = req.params["username"];
      const roommate = await this.roommmateService.findRoommate(username);
      if (!roommate) {
        return res.status(404).json({
          message: "Roommate not found.",
        });
      }

      const roommateProfiles = (
        await this.recommendationService.getRecommendations(roommate)
      ).map((roommate) => {
        return { username: roommate.username, profile: roommate.profile };
      });
      res.status(200).json(roommateProfiles);
    } catch (err) {
      console.log("Error is: ", err.message);
      return res.status(500).json({
        message: "Failed to get roommate recommendations.",
      });
    }
  };
}
