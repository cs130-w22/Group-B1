import React from 'react';
import {useState} from 'react';

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
const areas:Area[] = ['Austin','Los Angeles','Miami','New York','San Francisco','Seattle'];
var profiles:RoommateProfile[] = [];
for (let i = 0; i < 30; i++) {
  let profile:RoommateProfile = {
    firstName: firstnames[randInt(0,firstnames.length-1)],
    lastName: lastnames[randInt(0,lastnames.length-1)],
    email: 'example@email.com',
    //area: randomEnum(Areas),
    area: areas[randInt(0,areas.length-1)],
    bio: '[about me]',
    hobbies: [],
    personality: [],
    additionalInfo: '[additional info]'
  };
  for (let i = 0, n = randInt(2,5); i < n; i++) {
    profile.personality.push(personalities[randInt(0,personalities.length-1)])
  }
  profiles.push(profile);
}
var viewedProfile:RoommateProfile = profiles[0];
var viewedId:number = 0;

// fetch data
function getProfiles() {
  return profiles;
}

// components
const useProfile = (newId) => {
  const [id, setId] = useState(0);
  setId(newId);
  return [id, setId];
}
const UserProfilePanel: React.FC = () => {
  return (
    <div className='user-profile-panel'/>
  )
}
const RoommateSelectionPanel: React.FC = () => {
  const profiles = getProfiles();
  // const [id, setId] = useProfile(0);
  const update = (newId) => {console.log('showing user ' + newId); viewedId = newId;}
  return (
    <div className='roommate-selection-panel'>
      <p className='recommendation-text'>Recommendations</p>
      <div className="miniViewFade"/>
      <div className="roommate-list-panel">
        {profiles.map((profile, newId) =>
           <div className="miniProfile" onClick={()=>{update(newId)}}>
             <div className="miniProfilePicture"></div>
             <div className="miniProfilePreference"></div>
             <p className="miniProfileName">{profile.firstName} {profile.lastName}</p>
             <p className="miniProfileText">{profile.personality.join(', ')}</p>
           </div>
        )}
      </div>
    </div>
  )
}
const ViewedProfilePanel: React.FC = () => {
  // const [id, setId] = useState(0);
  const [id, setId] = useState(0);
  const update = () => {
    // setId(prev => {
    //   console.log('update to ' + ((prev+1)%profiles.length));
    //   return (prev+1)%profiles.length;
    // });
    // console.log(id);
    // setId((id+1)%profiles.length);
    setId(viewedId);
  }
  return (
    <div className='viewed-profile-panel' onClick={update}>
      <div className="fullProfilePicture"/>
      <div className="fullProfilePreference"/>
      <p className="fullProfileName">{profiles[id].firstName} {profiles[id].lastName}</p>
      <p className="fullProfileText">{profiles[id].personality.join(', ')}</p>
      <p className="email">{profiles[id].email}</p>
      <div className="fullProfileBio">
        <p>I am from <b>{profiles[id].area}</b>!</p>
        <p>{profiles[id].bio}</p>
        <p>{profiles[id].additionalInfo}</p>
      </div>
    </div>
  )
}


// <div className="fullProfilePicture" onClick={update}/>


// contentStr += '<div id="fullProfilePicture"></div>';
// contentStr += '<div id="fullProfilePreference"></div>';
// contentStr += '<p id="fullProfileName">' + profiles[profileIndex].firstname + ' '  + profiles[profileIndex].lastname + '</p>';
// contentStr += '<p id="fullProfileText">' + profiles[profileIndex].personality + '</p>';
// contentStr += '<div id="personalityPreferences">[personality: self-desc + roommate prefs]</div>';
// contentStr += '<div id="housingPreferences">[housing: prefs + current residence if applicable]</div>';
// contentStr += '<p id="email">example@email.com</p>';



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