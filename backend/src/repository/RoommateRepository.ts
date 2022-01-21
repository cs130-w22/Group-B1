import { Roommate } from "../../../shared/src/roommate";
import { injectable } from "inversify";

@injectable()
export class RoommateRepository {
  create(roommate: Roommate): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  findOne(id: string): Promise<Roommate | null> {
    throw new Error("Method not implemented.");
  }

  getAll(): Promise<Roommate[]> {
    throw new Error("Method not implemented.");
  }

  update(id: string, roommate: Roommate): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  delete(id: string): Promise<Roommate> {
    throw new Error("Method not implemented.");
  }
}
