import { Roommate } from "../../../shared/src/roommate";
import {
  roommateToDocument,
  roommateProfileToDocument,
  documentsToRoommate,
  RoommateModel,
  RoommateProfileModel,
  RoommateDoc,
  RoommateProfileDoc,
} from "./Schemas";
import { injectable } from "inversify";
import { HydratedDocument } from "mongoose";
import "reflect-metadata";

@injectable()
export class RoommateRepository {
  /**
   * Create a Roommate
   * @param roommate Roommate as represented in Shared folder
   * @returns false if already exists, true if entered successfully
   */
  create(roommate: Roommate): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      //TODO: Pretty sure these async calls can be ordered many different ways
      //So see if theres a better way

      //Return false if username already exists
      this.findOne(roommate.username)
        .then((roommate) => {
          if (roommate != null) {
            resolve(false);
            return;
          }
        })
        .catch((err) => {
          reject(err);
          return;
        });

      //Save the roommate
      const roommateDoc = roommateToDocument(roommate);
      roommateDoc.save().catch((err) => {
        const error_str = `Error saving Roommate:  ${err.message}`;
        console.log(error_str);
        reject(error_str);
        return;
      });

      //TODO, check if profile with email already exists

      //Save the roommateProfile
      const roommateProfileDoc = roommateProfileToDocument(roommate.profile);
      roommateProfileDoc
        .save()
        .then(() => {
          resolve(true);
          return;
        })
        .catch((err) => {
          //TODO: delete the roomate we just saved
          const error_str = `Error saving RoommateProfile:  ${err.message}`;
          console.log(error_str);
          reject(error_str);
          return;
        });
    });
  }

  /**
   * Finds a roommate given a username
   * @param username
   * @returns null if does not exist, otherwise Roommate as defined in shared
   */
  findOne(username: string): Promise<Roommate | null> {
    console.log({ fn: "findOne", username: username });
    return new Promise<Roommate | null>((resolve, reject) => {
      //Find Roommate by username
      this.findRoommateDoc(username)
        .then((roommateDoc) => {
          if (roommateDoc) {
            console.log({ fn: "findOne", roommateDoc });
            resolve(documentsToRoommate(roommateDoc));
          } else {
            resolve(null);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  /**
   * Get all of the roommates
   * @returns Promise<Roommate[]> List of Roommates
   */
  getAll(): Promise<Roommate[]> {
    return new Promise<Roommate[]>((resolve, reject) => {
      RoommateModel.find()
        .then((roommateDocs) => {
          const res = roommateDocs.map((roommateDoc) =>
            documentsToRoommate(roommateDoc)
          );
          console.log({ fn: "getAll", roommateDocs, res });
          resolve(res);
        })
        .catch((err) => {
          const error_str = `Error finding all Roommates ${err.message}`;
          console.log(error_str);
          reject(error_str);
          return;
        });
    });
  }

  update(username: string, roommate: Roommate): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  delete(id: string): Promise<Roommate> {
    throw new Error("Method not implemented.");
  }

  /**
   * Given a username returns a RoommateDoc object
   * @param username
   * @returns HydratedDocument<Roommate> or null if does not exist
   */
  private findRoommateDoc(
    username: string
  ): Promise<HydratedDocument<RoommateDoc>> {
    return new Promise<HydratedDocument<RoommateDoc>>((resolve, reject) => {
      RoommateModel.find({ username: username })
        .then((docs) => {
          console.log({
            fn: "findRoommateDoc",
            args: docs,
            username: username,
          });
          if (docs.length < 1) {
            //Could not find an associated Roommate
            resolve(null);
            return;
          } else if (docs.length > 1) {
            //Found multiple Roommate's with that username
            const error_str = `Error there are multiple Roommates with the username: ${username}`;
            console.log(error_str);
            reject(error_str);
            return;
          } else {
            //Found the Roommate
            resolve(docs[0]);
            return;
          }
        })
        .catch((err) => {
          const error_str = `Error finding a Roommate: ${err.message}`;
          console.log(error_str);
          reject(error_str);
          return;
        });
    });
  }

  /**
   * Given an email finds a RoommateProfileDoc object
   * @param email
   * @returns HydratedDocument<RoommateProfile>
   */
  private findRoommateProfileDoc(
    email: string
  ): Promise<HydratedDocument<RoommateProfileDoc>> {
    return new Promise<HydratedDocument<RoommateProfileDoc>>(
      (resolve, reject) => {
        console.log({ fn: "findRoommateProfileDoc", args: email });
        RoommateProfileModel.find({ email: email })
          .then((docs) => {
            console.log({ fn: "findRoommateProfileDoc", docs });
            if (docs.length < 1) {
              //Could not find an associated RoommateProfile
              resolve(null);
              return;
            } else if (docs.length > 1) {
              //Found multiple RoommateProfiles with that email
              const error_str = `Error there are multiple RoommateProfiles with the email: ${email}`;
              console.log(error_str);
              reject(error_str);
              return;
            } else {
              //Found the RoommateProfile
              resolve(docs[0]);
              return;
            }
          })
          .catch((err) => {
            const error_str = `Error finding a RoommateProfile: ${err.message}`;
            console.log(error_str);
            reject(error_str);
            return;
          });
      }
    );
  }
}
