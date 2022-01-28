import React from 'react';

import './Search.css';
import '../shared/roommateProfile.ts';

// copy-pasted shared typescript, until we can find a way to actually access the shared versions
enum PersonalityTraits {
  "introvert",
  "extrovert",
  "sensor",
  "intuitive",
  "thinker",
  "feeler",
  "judger",
  "perceiver",
}
type PersonalityTrait = keyof typeof PersonalityTraits;
enum Hobbies {
  "baseball",
  "basketball",
  "cooking",
  "gaming",
  "hiking",
  "knitting",
  "reading",
  "running",
  "soccer",
  "tennis",
}
type Hobby = keyof typeof Hobbies;
enum Areas {
  "Austin",
  "Los Angeles",
  "Miami",
  "New York",
  "San Francisco",
  "Seattle",
}
type Area = keyof typeof Areas;
interface RoommateProfile {
  firstName: string;
  lastName: string;
  email: string;
  area: Area;
  bio: string;
  hobbies: Hobby[];
  personality: PersonalityTrait[];
  additionalInfo: string;
}

// stub data
function randInt(min:number, max:number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomEnum<T>(anEnum: T): T[keyof T] {
  const enumValues = Object.keys(anEnum)
    .map(n => Number.parseInt(n))
    .filter(n => !Number.isNaN(n)) as unknown as T[keyof T][]
  const randomIndex = Math.floor(Math.random() * enumValues.length)
  const randomEnumValue = enumValues[randomIndex]
  return randomEnumValue;
}
const firstnames:string[] = ['John', 'Joe', 'Katie', 'Lauren', 'Mariana', 'Katniss', 'Peter', 'Tyler', 'Tara', 'Ezekiel'];
const lastnames:string[] = ['Smith', 'Cooper', 'Westfield', 'Everdeen', 'Rennel', 'Miller', 'Steinbech', 'Reinhardt'];
const personalities:PersonalityTrait[] = ['introvert', 'extrovert', 'sensor', 'intuitive', 'thinker', 'feeler', 'judger', 'perceiver'];
var profiles:RoommateProfile[] = [];
for (let i = 0; i < 30; i++) {
  let profile:RoommateProfile = {
    firstName: firstnames[randInt(0,firstnames.length-1)],
    lastName: lastnames[randInt(0,lastnames.length-1)],
    email: 'example@email.com',
    //area: randomEnum(Areas),
    area: 'Los Angeles',
    bio: '[about me]',
    hobbies: [],
    personality: [],
    additionalInfo: '[more info]'
  };
  for (let i = 0, n = randInt(2,5); i < n; i++) {
    profile.personality.push(personalities[randInt(0,personalities.length-1)])
  }
  profiles.push(profile);
}

// fetch data
function getProfiles() {
  return profiles;
}

// components
const UserProfilePanel: React.FC = () => {
  return (
    <div className='user-profile-panel'/>
  )
}
const RoommateSelectionPanel: React.FC = () => {
  const profiles = getProfiles();
  return (
    <div className='roommate-selection-panel'>
      <div className="roommate-list-panel">
        {profiles.map((profile) =>
           <div className="miniProfile">
             <div class="miniProfilePicture"></div>
             <div class="miniProfilePreference"></div>
             <p class="miniProfileName">{profile.firstName} {profile.lastName}</p>
             <p class="miniProfileText">{profile.personality.join(', ')}</p>
           </div>
        )}
      </div>
    </div>
  )
}
const ViewedProfilePanel: React.FC = () => {
  return (
    <div className='viewed-profile-panel'/>
  )
}

// page
const Search: React.FC = () => {
  return (
    <div>
      <UserProfilePanel/>
      <RoommateSelectionPanel/>
      <ViewedProfilePanel/>
    </div>
  )
}

export default Search;