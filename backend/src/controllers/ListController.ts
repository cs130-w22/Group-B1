import { Application, Request, Response } from "express";
import { injectable, inject } from "inversify";
import TYPES from "../../types";
import { RoommateService } from "../services/RoommateService";
import { AuthorizationMiddleware } from "../middleware/AuthorizationMiddleware";
import { RegistrableController } from "./RegistrableController";
import { ListService } from "../services/ListService";

/**
 * ListController manages an endpoint to get or modify a roommate list.
 */
@injectable()
export class ListController implements RegistrableController {
  @inject(TYPES.RoommateService)
  private roommateService: RoommateService;

  @inject(TYPES.ListService)
  private listService: ListService;

  @inject(TYPES.AuthorizationMiddleware)
  private authorizationMiddleware: AuthorizationMiddleware;

  /**
   * Registers the endpoints for roommate list.
   * @param app The app to register the endpoints on.
   */
  public register(app: Application): void {
    app
      .route("/roommate/list/:username")
      .get(this.authorizationMiddleware.verifyToken, this.getRoommateList)
      .post(this.authorizationMiddleware.verifyToken, this.addToRoommateList)
      .delete(
        this.authorizationMiddleware.verifyToken,
        this.deleteFromRoommateList
      );
  }

  /**
   * Gets a roommate list given a request containing a username.
   * @param req The HTTP request. It should have a username as a path parameter.
   * @param res The HTTP response. If no errors, will return the roommate list.
   */
  private getRoommateList = async (req: Request, res: Response) => {
    try {
      const username = req.params["username"];
      const roommate = await this.roommateService.findRoommate(username);
      if (!roommate) {
        res.status(404).json({ message: "Roommate not found." });
      } else {
        res.status(200).json(roommate.list || []);
      }
    } catch (err) {
      return res.status(500).json({
        message: "Failed to get roommate list of the user.",
      });
    }
  };

  /**
   * Adds a roommate to someone's roommate list given a request.
   * @param req The HTTP request. It should have a username as a path parameter, and the username to add in the body.
   * @param res The HTTP response. If no errors, it will send back the updated roommate list.
   * @returns
   */
  private addToRoommateList = async (req: Request, res: Response) => {
    try {
      const username = req.params["username"];
      const usernameToAdd = req.body.usernameToAdd;
      if (username === usernameToAdd) {
        return res.status(400).json({
          message: "User should not add him or herself to the roommate list.",
        });
      }
      const roommateListUpdated = await this.listService.addToRoommateList(
        username,
        usernameToAdd
      );
      return res.status(200).json(roommateListUpdated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Failed to add the user to roommate list.",
      });
    }
  };

  /**
   * Deletes a roommate from someone's roommate list given a request.
   * @param req The HTTP request. It should have a username as a path parameter, and the username to delete in the body.
   * @param res The HTTP response. If no errors, it will send back the updated roommate list.
   * @returns
   */
  private deleteFromRoommateList = async (req: Request, res: Response) => {
    try {
      const username = req.params["username"];
      const usernameToDelete = req.body.usernameToDelete;
      const roommateListUpdated = await this.listService.deleteFromRoommateList(
        username,
        usernameToDelete
      );
      return res.status(200).json(roommateListUpdated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Failed to remove the user from roommate list.",
      });
    }
  };
}
