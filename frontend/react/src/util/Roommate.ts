export interface RoommateProfile {
  firstName: string;
  lastName: string;
  email: string;
  area: string;
  bio: string;
  hobbies: string[];
  personality: string[];
  additionalInfo: string;
}

export interface Roommate {
  username: string;
  profile: RoommateProfile;
}
