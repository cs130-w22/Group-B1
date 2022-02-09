import { Application, Request, Response } from "express";
import { Roommate } from "../../../shared/src/roommate";
import { injectable, inject } from "inversify";
import TYPES from "../../types";
import { RecommendationService } from "../services/RecommendationService";
import { RoommateService } from "../services/RoommateService";

import { RegistrableController } from "./RegistrableController";

@injectable()
export class RecommendationController implements RegistrableController {
  @inject(TYPES.RoommateService)
  private recommendationService: RecommendationService;

  @inject(TYPES.RoommateService)
  private roommmateService: RoommateService;

  public register(app: Application): void {
    app.route("/recommendation/").get(async (req: Request, res: Response) => {
      try {
        const username = req.query.username;
        if (username) {
          const roommate = await this.roommmateService.findRoommate(username);
          if (!roommate) {
            return res.status(404).json({
              message: "Roommate not found.",
            });
          }

          const roommateProfiles = (
            await this.recommendationService.getRecommendations(roommate)
          ).map((roommate) => roommate.profile);
          res.status(200).json({ data: roommateProfiles });
        } else {
          return res.status(400).json({
            message: "Username required.",
          });
        }
      } catch (err) {
        return res.status(500).json({
          message: "Failed to get roommate recommendations.",
        });
      }
    });
  }
}
