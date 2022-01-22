import { Roommate } from "../../../shared/src/roommate";
import { roommateToDocument } from "./Schemas";
import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class RoommateRepository {

  create(roommate: Roommate): Promise<boolean> {
    const doc = roommateToDocument(roommate); //TODO: switch to an implementation where it creates profile as well 

    return new Promise<boolean>((resolve, reject) => {
      
      if(false){ //TODO: replace with condition where roommate already exists
        resolve(false);
      }
      console.log("so this ran");
      doc.save()
        .then((data)=> {
          console.log("1 ran");
          resolve(true);
        })
        .catch((err)=> {
          console.log("the error is:");
          console.log(err);
          reject(err);
        })
      }
     );

  }

  findOne(username: string): Promise<Roommate | null> {
    throw new Error("Method not implemented.");
  }

  getAll(): Promise<Roommate[]> {
    throw new Error("Method not implemented.");
  }

  update(username: string, roommate: Roommate): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  delete(id: string): Promise<Roommate> {
    throw new Error("Method not implemented.");
  }
}
