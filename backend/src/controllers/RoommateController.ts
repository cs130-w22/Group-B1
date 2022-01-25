import { Application, Request, Response } from "express";
import { Roommate } from "../../../shared/src/roommate";
import { injectable, inject } from "inversify";
import TYPES from "../../types";
import { RoommateService } from "../services/RoommateService";
import { RegistrableController } from "./RegistrableController";

@injectable()
export class RoommateController implements RegistrableController {
  @inject(TYPES.RoommateService)
  private roommateService: RoommateService;

  public register(app: Application): void {
    app
      .route("/roommate/")
      .get(async (req: Request, res: Response) => {
        try {
          const roommateProfiles = (
            await this.roommateService.getAllRoommates()
          ).map((roommate) => roommate.profile);
          res.status(200).json({ data: roommateProfiles });
        } catch (err) {
          return res.status(500).json({
            message: "Failed to get all roommates.",
          });
        }
      })
      .post(async (req: Request, res: Response) => {
        try {
          const roommate: Roommate = req.body as Roommate;
          const roommateCreated = await this.roommateService.createRoommate(
            roommate
          );
          if (roommateCreated) {
            return res.status(200).json(roommate);
          } else {
            return res.status(400).json({
              message:
                "Failed to create roommate. Username likely already taken.",
            });
          }
        } catch (err) {
          return res.status(400).json({
            message: "Failed to create roommate.",
          });
        }
      })
      .put(async (req: Request, res: Response) => {
        try {
          const roommate: Roommate = req.body as Roommate;
          const roommateUpdated = await this.roommateService.updateRoommate(
            roommate.username,
            roommate
          );
          if (roommateUpdated) {
            return res.status(200).json(roommate);
          } else {
            return res.status(400).json({
              message: "Failed to update roommate. Roommate username invalid.",
            });
          }
        } catch (err) {
          return res.status(400).json({
            message: "Failed to update roommate.",
            err: err.message,
          });
        }
      });
  }
}
