import { Schema, model, Document } from "mongoose";
import { Roommate } from "../../../shared/src/roommate";
import { RoommateProfile } from "../../../shared/src/roommateProfile";

//Make Schemas, the outlines for our documents
//---------------------------------------------
const roommateProfileSchema  = new Schema<RoommateProfile>({
    firstName : {type: String, required: true},
    lastName : {type: String, required: true},
    email : {type: String, required: true},
    area : {type: String, required: true},
    bio : {type: String, required: true},
    hobbies : {type: [String], required: true},
    personality : {type: [String], required: true},
    additionalInfo : {type: String, required: true},
});

const roommateSchema = new Schema<Roommate>({
    username : {type: String, required: true},
    password : {type: String, required: true},
    profile : {type: String, required: true}, //Stores roomateProfile email instead
    //TODO: implement roommateList, thinking: roommateList :{type: [String], required: true}
});

//Make Models, the constructors that make documents
//-------------------------------------------------
const RoommateProfileModel = model<RoommateProfile>('RoommateProfile', roommateProfileSchema);
const RoommateModel = model<Roommate>('Roommate', roommateSchema);


export const roommateToDocument = (roommate : Roommate) : Document => {
    const roommateDoc = new RoommateModel({
        username : roommate.username,
        password : roommate.password,
        profile : roommate.profile.email
        //TODO: implement roommateList
    });
    //Create 
    return roommateDoc;
}

export const roommateProfileToDocument = (roommateProfile : RoommateProfile) : Document => {
    const roommateProfileDoc = new RoommateModel({
        firstName : roommateProfile.firstName,
        lastName : roommateProfile.lastName,
        email : roommateProfile.email,
        area : roommateProfile.area,
        bio : roommateProfile.bio,
        hobbies : roommateProfile.hobbies,
        personality : roommateProfile.personality,
        additionalInfo : roommateProfile.additionalInfo,
    });
    return roommateProfileDoc;
}
