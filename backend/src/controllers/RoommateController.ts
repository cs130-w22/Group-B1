import { Application, Request, Response } from "express";
import { Roommate } from "../../../shared/src/roommate";
import { injectable, inject } from "inversify";
import TYPES from "../../types";
import { RoommateService } from "../services/RoommateService";
import { AuthorizationMiddleware } from "../middleware/AuthorizationMiddleware";
import { RegistrableController } from "./RegistrableController";
import { RoommateProfile } from "../../../shared/src/roommateProfile";

@injectable()
export class RoommateController implements RegistrableController {
  @inject(TYPES.RoommateService)
  private roommateService: RoommateService;

  @inject(TYPES.AuthorizationMiddleware)
  private authorizationMiddleware: AuthorizationMiddleware;

  public register(app: Application): void {
    app
      .route("/roommate/")
      .get(this.authorizationMiddleware.verifyToken, this.getRoommates)
      .post(
        this.authorizationMiddleware.verifyPasswordExists,
        this.createRoomate
      )
      .put(this.authorizationMiddleware.verifyToken, this.updateRoommate);
  }

  private getRoommates = async (req: Request, res: Response) => {
    try {
      const username = req.query.username;
      if (username) {
        const roommate = await this.roommateService.findRoommate(username);
        if (!roommate) {
          res.status(404).json({ message: "Roommate not found." });
        } else {
          res.status(200).json(roommate.profile);
        }
      } else {
        const roommateProfiles = (
          await this.roommateService.getAllRoommates()
        ).map((roommate) => roommate.profile);
        res.status(200).json({ data: roommateProfiles });
      }
    } catch (err) {
      return res.status(500).json({
        message: "Failed to get all roommates.",
      });
    }
  };

  private createRoomate = async (req: Request, res: Response) => {
    try {
      const roommate: Roommate = req.body as Roommate;
      const roommateCreated = await this.roommateService.createRoommate(
        roommate
      );
      if (roommateCreated) {
        return res.status(200).json(roommate.profile);
      } else {
        return res.status(400).json({
          message: "Username already taken.",
        });
      }
    } catch (err) {
      return res.status(500).json({
        message: "Failed to create roommate.",
      });
    }
  };

  private updateRoommate = async (req: Request, res: Response) => {
    try {
      const username = req.query.username;
      const roommateProfile: RoommateProfile = req.body as RoommateProfile;
      const roommateUpdated = await this.roommateService.updateRoommate(
        username,
        roommateProfile
      );
      if (roommateUpdated) {
        return res.status(200).json(roommateProfile);
      } else {
        return res.status(400).json({
          message: "Roommate username invalid.",
        });
      }
    } catch (err) {
      return res.status(500).json({
        message: "Failed to update roommate.",
      });
    }
  };
}
