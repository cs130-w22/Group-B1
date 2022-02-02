import { Application, Request, Response } from "express";
import { injectable, } from "inversify";
import { RegistrableController } from "./RegistrableController";
import { Areas } from "../roommate/area";
import { PersonalityTraits } from "../roommate/personalityTrait";
import { Hobbies } from "../roommate/hobby";

@injectable()
export class RoommateInterfaceController implements RegistrableController {

  public register(app: Application): void {
    app.route("/roommate/areas").get(this.getAreas);
    app.route("/roommate/hobbies").get(this.getAreas);
    app.route("/roommate/personalities").get(this.getPersonalityTraits);
  }

  private getAreas = (req: Request, res: Response) => {
    const areas = Object.values(Areas).filter(x => typeof x === 'string')
    res.status(200).json(areas);
  };

  private getHobbies= (req: Request, res: Response) => {
    const areas = Object.values(Hobbies).filter(x => typeof x === 'string')
    res.status(200).json(areas);
  };

  private getPersonalityTraits= (req: Request, res: Response) => {
    const areas = Object.values(PersonalityTraits).filter(x => typeof x === 'string')
    res.status(200).json(areas);
  };
}
