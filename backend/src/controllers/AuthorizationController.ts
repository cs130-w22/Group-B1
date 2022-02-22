import { Application, Request, Response } from "express";
import { injectable, inject } from "inversify";
import TYPES from "../../types";
import { AuthorizationService } from "../services/AuthorizationService";
import { RegistrableController } from "./RegistrableController";

/**
 * AuthorizationController manages an endpoint that logs in users.
 */
@injectable()
export class AuthorizationController implements RegistrableController {
  @inject(TYPES.AuthorizationService)
  private authorizationService: AuthorizationService;
  
  /**
   * Registers the roommate login endpoint.
   * @param app The app to register the endpoint on
   */
  public register(app: Application): void {
    app.route("/roommate/login").post(async (req: Request, res: Response) => {
      try {
        const username: string = req.body.username;
        const password: string = req.body.password;
        const accessToken = await this.authorizationService.login(
          username,
          password
        );
        if (accessToken) {
          return res.status(200).json({
            accessToken: accessToken,
          });
        } else {
          return res.status(401).json({
            message: "Invalid username or password",
          });
        }
      } catch (err) {
        return res.status(500).json({
          message: err.message,
        });
      }
    });
  }
}
