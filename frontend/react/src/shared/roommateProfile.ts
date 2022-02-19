import { Area } from "./area";
import { Hobby } from "./hobby";
import { PersonalityTrait } from "./personalityTrait";

export interface RoommateProfile {
  firstName: string;
  lastName: string;
  email: string;
  area: Area;
  bio: string;
  hobbies: Hobby[];
  personality: PersonalityTrait[];
  additionalInfo: string;
}
