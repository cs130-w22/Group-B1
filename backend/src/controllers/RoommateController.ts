import { Application, Request, Response } from "express";
import { Roommate } from "../../../shared/src/roommate";
import { injectable, inject } from "inversify";
import TYPES from "../../types";
import { RoommateService } from "../services/RoommateService";
import { RegistrableController } from "./RegistrableController";

@injectable()
export class RoommateController implements RegistrableController {
  private roommateService: RoommateService;

  constructor(@inject(TYPES.RoommateService) roommateService: RoommateService) {
    this.roommateService = roommateService;
  }

  public register(app: Application): void {
    app
      .route("/roommate/")
      .get(async (req: Request, res: Response) => {
        try {
          const roommates = await this.roommateService.getAllRoommates();
          res.status(200).json({ roommates });
        } catch (err) {
          return res.status(500).json({
            message: "Failed to get all roommates.",
            err: err.message,
          });
        }
      })
      .post(async (req: Request, res: Response) => {
        try {
          const roommate: Roommate = req.body as Roommate;
          const roommateCreated = await this.roommateService.createRoommate(
            roommate
          );
          return res.status(200).json({
            success: roommateCreated,
            roommate,
          });
        } catch (err) {
          return res.status(400).json({
            message: "Failed to create roommate.",
            err: err.message,
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
          return res.status(200).json({
            success: roommateUpdated,
            roommate,
          });
        } catch (err) {
          return res.status(400).json({
            message: "Failed to update roommate.",
            err: err.message,
          });
        }
      });
  }
}
