import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import TYPES from "../../types";
import { AuthorizationService } from "../services/AuthorizationService";
import "reflect-metadata";

@injectable()
export class AuthorizationMiddleware {
  @inject(TYPES.AuthorizationService)
  private authorizationService: AuthorizationService;

  public verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authorization: string = req.headers.authorization;
      const validToken = await this.authorizationService.validToken(
        authorization,
        req.body.username
      );
      if (!validToken) {
        res.status(400).json({ message: "Invalid token." });
      } else {
        next();
      }
    } catch (err) {
      res.status(500).json({ message: "Faild to verify token." });
    }
  };

  public verifyPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.body.password) {
        return res.status(400).json({ message: "Missing password." });
      }
      req.body.password = await this.authorizationService.encryptPassword(
        req.body.password
      );
      next();
    } catch (err) {
      res.status(500).json({ message: "Failed to verify password." });
    }
  };
}
