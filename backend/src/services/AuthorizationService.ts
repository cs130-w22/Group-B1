import { injectable, inject } from "inversify";
import TYPES from "../../types";
import { RoommateRepository } from "../repository/RoommateRepository";
import { Roommate } from "../roommate/roommate";
import jwt from "jsonwebtoken";
import crypto from "crypto";

/**
 * AuthorizationService handles the logic of logging in users, checking if a token is valid,
 * and encrypting passwords.
 */
@injectable()
export class AuthorizationService {
  @inject(TYPES.RoommateRepository)
  private roommateRepository: RoommateRepository;

  /**
   * Attempts to log in a user
   * @param username The username of the user to login
   * @param password The user's password in plain text.
   * @returns The user's access token upon success, null on failure.
   */
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

  /**
   * Given a username and password, returns whether the password is correct for the username.
   * @param username The username to correspond with the password.
   * @param password The password in plain text.
   * @returns True if username and password match, False otherwise
   */
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

  /**
   * Given an authorization argument and potentially a username, returns whether the token is valid
   * @param authorization The authorization string. Expected to take the form "Bearer {accessToken}"
   * @param username A username. If given, the access token must match the username.
   * @returns True if the token is valid, false otherwise.
   */
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

  /**
   * Encrypts a password.
   * @param password The password to encrypt.
   * @returns The encrypted password.
   */
  public encryptPassword(password: string) {
    const salt = crypto.randomBytes(16).toString("base64");
    const hash = crypto
      .createHmac("sha512", salt)
      .update(password)
      .digest("base64");
    return salt + "$" + hash;
  }
}
