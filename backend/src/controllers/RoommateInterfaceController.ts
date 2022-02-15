import { Application, Request, Response } from "express";
import { injectable } from "inversify";
import { RegistrableController } from "./RegistrableController";
import { Areas } from "../roommate/area";
import { PersonalityTraits } from "../roommate/personalityTrait";
import { Hobbies } from "../roommate/hobby";

@injectable()
export class RoommateInterfaceController implements RegistrableController {
  public register(app: Application): void {
    app.route("/roommate/types/areas").get(this.getAreas);
    app.route("/roommate/types/hobbies").get(this.getHobbies);
    app.route("/roommate/types/personalities").get(this.getPersonalityTraits);
  }

  private getAreas = (req: Request, res: Response) => {
    const areas = Object.values(Areas).filter((x) => typeof x === "string");
    res.status(200).json(areas);
  };

  private getHobbies = (req: Request, res: Response) => {
    const hobbies = Object.values(Hobbies).filter((x) => typeof x === "string");
    res.status(200).json(hobbies);
  };

  private getPersonalityTraits = (req: Request, res: Response) => {
    const personalityTraits = Object.values(PersonalityTraits).filter(
      (x) => typeof x === "string"
    );
    res.status(200).json(personalityTraits);
  };
}
