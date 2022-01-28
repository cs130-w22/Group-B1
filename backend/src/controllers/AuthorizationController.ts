import { Application, Request, Response } from "express";
import { injectable, inject } from "inversify";
import TYPES from "../../types";
import { AuthorizationService } from "../services/AuthorizationService";
import { RegistrableController } from "./RegistrableController";

@injectable()
export class AuthorizationController implements RegistrableController {
  @inject(TYPES.AuthorizationService)
  private authorizationService: AuthorizationService;

  public register(app: Application): void {
    app.route("/roommate/login").get(async (req: Request, res: Response) => {
      try {
        const username: string = req.query.username;
        const password: string = req.query.password;
        const tokens = await this.authorizationService.login(
          username,
          password
        );
        if (tokens) {
          return res.status(200).json({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          });
        } else {
          return res.status(400).json({
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
