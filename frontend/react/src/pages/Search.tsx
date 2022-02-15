import React from 'react';
import {useEffect, useState} from 'react';
import Modal from 'react-modal';
import { WithContext as ReactTags } from 'react-tag-input';

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
interface Roommate {
  username: string;
  profile: RoommateProfile;
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
    bio: '[about me] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    hobbies: [],
    personality: [],
    additionalInfo: '[additional info] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  };
  profile.email = profile.firstName + ' ' + profile.lastName + '@' + (Math.random()<0.5?'gmail':'yahoo') + '.com';
  for (let i = 0, n = randInt(2,5); i < n; i++) {
    profile.personality.push(personalities[randInt(0,personalities.length-1)])
  }
  profiles.push(profile);
}
var roommates:Roommate[] = [];
for (let profile of profiles) {
  let roommate:Roommate = {
    username: profile.firstName + Math.round(Math.random()*1000),
    profile: profile
  };
  roommates.push(roommate);
}
var viewedProfile:RoommateProfile = profiles[0];
var viewedId:number = 0;

window['connectDev'] = {
  rootUrl: 'http://localhost:5000',

  user: {
    username: 'testuser',
    password: 'testpass',
    profile: {
      firstName: 'Katniss',
      lastName: 'Everdeen',
      email: 'survivor@gmail.com',
      area: 'Los Angeles',
      bio: '[test bio]',
      hobbies: [],
      personality: [],
      additionalInfo: '[test info]'
    }
  },
  authToken: '',

  registerStub: function(): void {
    console.log('registering debug user...');
    var rootUrl = window['connectDev'].rootUrl;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        console.log('registration success');
        console.log(xmlHttp.responseText);
      }
    }
    xmlHttp.open("POST", rootUrl+'/roommate/', true); // true for async
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.send(JSON.stringify( window['connectDev'].user ));
  },
  loginStub: function(): void {
    console.log('logging in debug user...');
    var rootUrl = window['connectDev'].rootUrl;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        var response = JSON.parse(xmlHttp.responseText);
        window['connectDev'].authToken = response.accessToken;
        console.log('login success');
        console.log(xmlHttp.responseText);
      }
    }
    xmlHttp.open("POST", rootUrl+'/roommate/login', true); // true for async
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.send(JSON.stringify({
      username: window['connectDev'].user.username,
      password: window['connectDev'].user.password
    }));
  },

  roommates: roommates,

  testGet: function(): void {
    console.log('attempting get...');
    var rootUrl = window['connectDev'].rootUrl;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        console.log(xmlHttp.responseText);
    }
    xmlHttp.open("GET", rootUrl, true); // true for async
    xmlHttp.send(null);
  }
};

// fetch data
var authToken = ''; // eventually stored in cookie
var rootUrl = 'http://localhost:5000';
function getProfiles() {
  return profiles;
}
function getAllRoommates(callback:(string)=>void): void {
  console.log('looking up roommates...');

  // callback(roommates);
  // return;

  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  }
  xmlHttp.open("GET", rootUrl+'/roommate/', true); // true for async
  xmlHttp.setRequestHeader('authorization', authToken);
  xmlHttp.send(null);
}
function getRoommate(username:string, callback:(string)=>void): void {
  console.log('looking up profile for '+username+'...');

  // for (let roommate of roommates) {
  //   if (username == roommate.username) {
  //     callback(roommate);
  //     return;
  //   }
  // }
  // return;

  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  }
  xmlHttp.open("GET", rootUrl+'/roommate/'+username, true); // true for async
  xmlHttp.setRequestHeader('authorization', authToken);
  xmlHttp.send(null);
}
function getFilteredRoommates(filter, callback:(string)=>void): void {
  console.log('looking up roommates that match filter...');

  let filterStr = '';
  for (let property of filter) {
    filterStr += (filterStr==''?'?':'&') + property + '=' + filter[property];
  }

  // callback(roommates);
  // return;

  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  }
  xmlHttp.open("GET", rootUrl+'/roommate/'+filterStr, true); // true for async
  xmlHttp.setRequestHeader('authorization', authToken);
  xmlHttp.send(null);
}

// components
const useProfile = (newId) => {
  const [id, setId] = useState(0);
  setId(newId);
  return [id, setId];
}

// const UserProfilePanel: React.FC = (props) => {
//   var userProfile:RoommateProfile = props.profile;
//   var openUserPreferencesPanel = props.onSettingsClick;

//   return (
//     <div className="user-profile-panel">
//       <div className='profilePicture'></div>
//       <p className='profileName'>{userProfile.firstName} {userProfile.lastName}</p>

//       <div className='settingsButton' onClick={openUserPreferencesPanel}></div>
//     </div>
//   )
// }
const UserProfilePanel: React.FC = () => {
  return (
    <div className="user-profile-panel">
      <div className='profilePicture'></div>
      <p className='profileName'>Hodor Hodurson</p>
      <div className='settingsButton'></div>
    </div>
  )
}

// const ProfilePreferencesPanel: React.FC = (props) => {
//   var userProfile:RoommateProfile = props.profile;
//   var isPreferencePopUpOpen = props.isPreferencePopUpOpen;
//   var closeModal = props.onCloseClick;
  
//   // state variable to keep track of updating user info
//   const [currentUserProfile, setCurrentUserProfile] = useState(userProfile);

//   // place holder function for submitting a profile edit request 
//   const submitProfileChanges = (event) => {
//     // TODO: make the PUT request
//     event.preventDefault();
//     console.log("submitting profile", currentUserProfile);
//   };
//   const handleChange = (key) => { 
//     return (event) => {
//       setCurrentUserProfile({...currentUserProfile, [key]: event.target.value});
//     }
//   };

//   // kinda a hack for now
//   const areaOptions = Object.keys(Areas).filter(key => key.length != 1).map(area => {
//     return <option value={area}>{area}</option>
//   });

//   // React tags functions 
//   const KeyCodes = {
//     comma: 188,
//     enter: 13
//   };
  
//   const delimiters = [KeyCodes.comma, KeyCodes.enter];

//   const generateReactTags = (profileTags) => {
//     return profileTags.map(trait => { return {id: String(trait), text: String(trait)}});
//   }

//   const handleTagDelete = (key) => {
//     return (i) => {
//       setCurrentUserProfile({...currentUserProfile, [key]: currentUserProfile[key].filter((tag, index) => index !== i)});
//     }
//   }

//   const handlePersonalityTagAddition =  (tag) => {
//       if(Object.keys(PersonalityTraits).includes(tag.id)) {
//         setCurrentUserProfile({...currentUserProfile, personality: [...currentUserProfile.personality, tag.id]});
//       }
//   }

//   const handleHobbyTagAddition = (tag) => {
//     if(Object.keys(Hobbies).includes(tag.id)) {
//       setCurrentUserProfile({...currentUserProfile, hobbies: [...currentUserProfile.hobbies, tag.id]});
//     }
// }

//   return (
//     <Modal 
//       isOpen={isPreferencePopUpOpen}
//       onRequestClose={closeModal}
//       contentLabel="User Preferences"
//     >
//       <h1>User Preferences</h1>
//       <h2>User Info</h2>
//       <form onSubmit={submitProfileChanges}>
//         <div><label>First name: <input type="text" value={currentUserProfile.firstName} onChange={handleChange("firstName")}/></label></div>
//         <div><label>Last name: <input type="text" value={currentUserProfile.lastName} onChange={handleChange("lastName")}/></label></div>
//         <div><label>Email: <input type="text" value={currentUserProfile.email} onChange={handleChange("email")}/></label></div>
//         <div><label>Area: 
//           <select value={currentUserProfile.area} onChange={handleChange("area")}>{areaOptions}</select>
//         </label></div>
//         <div><label>Bio: <textarea type="text" value={currentUserProfile.bio} onChange={handleChange("bio")}/></label></div>
//         <div><label>Additional Info: <textarea type="text" value={currentUserProfile.additionalInfo} onChange={handleChange("additionalInfo")}/></label></div>
//         <h2>User Tags</h2>
//         <div>
//           Personality Tags:
//           <ReactTags 
//             tags={generateReactTags(currentUserProfile.personality)}
//             delimiters={delimiters}
//             suggestions={generateReactTags(Object.keys(PersonalityTraits).filter(key => key.length != 1))}
//             handleDelete={handleTagDelete("personality")}
//             handleAddition={handlePersonalityTagAddition}
//             autocomplete
//           />
//         </div>
//         <div>
//           Hobby Tags:
//           <ReactTags 
//             tags={generateReactTags(currentUserProfile.hobbies)}
//             suggestions={generateReactTags(Object.keys(Hobbies).filter(key => key.length != 1))}
//             handleDelete={handleTagDelete("hobbies")}
//             handleAddition={handleHobbyTagAddition}
//             autocomplete
//           />
//         </div>
//         <button type="submit">Save</button>
//       </form>
//       <h2>Mini Profile</h2>
//       <h2>Full Profile</h2>
//     </Modal>
//   )
// }
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
// const Search: React.FC = () => {
//   const [isPreferencePopUpOpen, setIsPreferencePopUpOpen] = useState(false);
//   // TODO: get request to load user info and enums
//   const togglePreferencePopUp = () => {
//     console.log("clicking button; isPreferencePopUpOpen:", isPreferencePopUpOpen);
//     setIsPreferencePopUpOpen(!isPreferencePopUpOpen);
//   }

//   return (
//     <div>
//       <UserProfilePanel profile={mockUserProfile} onSettingsClick={togglePreferencePopUp}/>
//       <RoommateSelectionPanel/>
//       <ViewedProfilePanel/>
//       <ProfilePreferencesPanel profile={mockUserProfile} isPreferencePopUpOpen={isPreferencePopUpOpen} onCloseClick={togglePreferencePopUp}/>
//     </div>
//   )
// }
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