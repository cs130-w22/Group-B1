import { Application, Request, Response } from "express";
import { injectable } from "inversify";
import { RegistrableController } from "./RegistrableController";
import { Areas } from "../roommate/area";
import { PersonalityTraits } from "../roommate/personalityTrait";
import { Hobbies } from "../roommate/hobby";

/**
 * RoommateInterfaceController manages an endpoint that gets the different possible values for
 * areas, hobbies, and personalities.
 */
@injectable()
export class RoommateInterfaceController implements RegistrableController {
  /**
   * Registers all endpoints for retrieving valid areas, hobbies, and personalities.
   * @param app The app to register the endpoints on.
   */
  public register(app: Application): void {
    app.route("/roommate/types/areas").get(this.getAreas);
    app.route("/roommate/types/hobbies").get(this.getHobbies);
    app.route("/roommate/types/personalities").get(this.getPersonalityTraits);
  }

  /**
   * Gets valid areas.
   * @param res The HTTP response containing a list of the supported areas.
   */
  private getAreas = (req: Request, res: Response) => {
    const areas = Object.values(Areas).filter((x) => typeof x === "string");
    res.status(200).json(areas);
  };

  /**
   * Gets valid hobbies.
   * @param res The HTTP response containing a list of the supported hobbies.
   */
  private getHobbies = (req: Request, res: Response) => {
    const hobbies = Object.values(Hobbies).filter((x) => typeof x === "string");
    res.status(200).json(hobbies);
  };

  /**
   * Gets valid personality traits.
   * @param res The HTTP response containing a list of the supported personality traits.
   */
  private getPersonalityTraits = (req: Request, res: Response) => {
    const personalityTraits = Object.values(PersonalityTraits).filter(
      (x) => typeof x === "string"
    );
    res.status(200).json(personalityTraits);
  };
}
