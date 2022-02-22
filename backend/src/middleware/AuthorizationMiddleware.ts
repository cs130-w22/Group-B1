import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import TYPES from "../../types";
import { AuthorizationService } from "../services/AuthorizationService";
import "reflect-metadata";

/**
 * AuthorizationMiddleware is used to check if a token is valid, and to verify and encrypt new passwords.
 */
@injectable()
export class AuthorizationMiddleware {
  @inject(TYPES.AuthorizationService)
  private authorizationService: AuthorizationService;

  public verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorization: string = req.headers.authorization;
      const username = this.requireUsernameParamToMatchToken(req)
        ? req.params["username"]
        : undefined;
      const validToken = this.authorizationService.validToken(
        authorization,
        username
      );
      if (!validToken) {
        res.status(401).json({ message: "Invalid token." });
      } else {
        next();
      }
    } catch (err) {
      res.status(500).json({ message: "Failed to verify token." });
    }
  };

  public verifyPasswordExists = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.body.password) {
        return res.status(400).json({ message: "Missing password." });
      }
      req.body.password = this.authorizationService.encryptPassword(
        req.body.password
      );
      next();
    } catch (err) {
      res.status(500).json({ message: "Failed to encrypt password." });
    }
  };

  private requireUsernameParamToMatchToken(req: Request): boolean {
    return (
      req.method === "POST" ||
      req.method === "PUT" ||
      req.method === "DELETE" ||
      req.url.startsWith("/roommate/list") ||
      req.url.startsWith("/roommate/recommendations")
    );
  }
}
