import { injectable, inject } from "inversify";
import TYPES from "../../types";
import { RoommateRepository } from "../repository/RoommateRepository";
import { Roommate } from "../roommate/roommate";
import jwt from "jsonwebtoken";
import crypto from "crypto";

@injectable()
export class AuthorizationService {
  @inject(TYPES.RoommateRepository)
  private roommateRepository: RoommateRepository;

  public async login(
    username: string,
    password: string
  ): Promise<string | null> {
    const validUsernamePassword = await this.validUsernamePassword(
      username,
      password
    );
    if (!validUsernamePassword) {
      return null;
    }

    const jwtSecret = process.env.JWT_SECRET;
    const salt = crypto.randomBytes(16).toString("base64");

    const accessToken = jwt.sign({ username, salt }, jwtSecret, {
      expiresIn: Number(process.env.TOKEN_EXPIRESIN),
    });

    return accessToken;
  }

  public async validUsernamePassword(
    username: string,
    password: string
  ): Promise<boolean> {
    const roommate: Roommate | null = await this.roommateRepository.findOne(
      username
    );

    if (!roommate) {
      return false;
    }
    const [salt, hashedPassword] = roommate.password.split("$");
    const hash = crypto
      .createHmac("sha512", salt)
      .update(password)
      .digest("base64");
    return hash == hashedPassword;
  }

  public validToken(authorization: string, username?: string): boolean {
    try {
      const authorizations = authorization.split(" ");
      if (authorizations[0] !== "Bearer") {
        return false;
      } else {
        const jwtSecret = process.env.JWT_SECRET;
        const jwtObject = jwt.verify(
          authorizations[1],
          jwtSecret
        ) as jwt.JwtPayload;
        if (username && jwtObject.username) {
          return username == jwtObject.username;
        } else {
          return true;
        }
      }
    } catch (err) {
      return false;
    }
  }

  public encryptPassword(password: string) {
    const salt = crypto.randomBytes(16).toString("base64");
    const hash = crypto
      .createHmac("sha512", salt)
      .update(password)
      .digest("base64");
    return salt + "$" + hash;
  }
}
