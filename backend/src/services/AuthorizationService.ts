import { injectable, inject } from "inversify";
import TYPES from "../../types";
import { RoommateRepository } from "../repository/RoommateRepository";
import { Roommate } from "../../../shared/src/roommate";
import { createHmac, randomBytes } from "crypto";

const jwt = require("jsonwebtoken");

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@injectable()
export class AuthorizationService {
  @inject(TYPES.RoommateRepository)
  private roommateRepository: RoommateRepository;

  public async login(
    username: string,
    password: string
  ): Promise<AuthTokens | null> {
    const validUsernamePassword = await this.validUsernamePassword(
      username,
      password
    );
    if (!validUsernamePassword) {
      return null;
    }

    const jwtSecret = process.env.JWT_SECRET;
    const refreshId = username + jwtSecret;
    const salt = randomBytes(16).toString("base64");
    const hash = createHmac("sha512", salt).update(refreshId).digest("base64");

    const accessToken = jwt.sign({ username, salt }, jwtSecret);
    const refreshToken = Buffer.from(hash).toString("base64");

    return { accessToken, refreshToken };
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
    const hash = createHmac("sha512", salt).update(password).digest("base64");

    return hash == hashedPassword;
  }

  public async validToken(authorization: string): Promise<boolean> {
    try {
      let authorizations = authorization.split(" ");
      if (authorizations[0] !== "Bearer") {
        return false;
      } else {
        const jwtSecret = process.env.JWT_SECRET;
        jwt.verify(authorizations[1], jwtSecret);
        return true;
      }
    } catch (err) {
      return false;
    }
  }
}
