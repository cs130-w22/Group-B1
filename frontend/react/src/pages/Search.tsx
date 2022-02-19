import React from 'react';
import {useEffect, useState} from 'react';
import Modal from 'react-modal';
import { WithContext as ReactTags } from 'react-tag-input';

import './Search.css';
import '../shared/roommateProfile.ts';

interface RoommateProfile {
  firstName: string;
  lastName: string;
  email: string;
  area: string;
  bio: string;
  hobbies: string[];
  personality: string[];
  additionalInfo: string;
}
interface Roommate {
  username: string;
  profile: RoommateProfile;
}

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
  accessToken: '',

  registerStub: function(): void {
    console.log('registering debug user...');
    var rootUrl = window['connectDev'].rootUrl;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        console.log('registration success');
        console.log(xmlHttp.responseText);
      }
    }
    xmlHttp.open("POST", rootUrl+'/roommate/', true); // true for async
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.send(JSON.stringify( window['connectDev'].user ));
  },
  
  // autoLogin: function(): void {
  //   console.log('registering debug user...');
  //   var rootUrl = window['connectDev'].rootUrl;
  //   var xmlHttp = new XMLHttpRequest();
  //   xmlHttp.onreadystatechange = function() { 
  //     if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
  //       console.log('registration success');
  //       console.log(xmlHttp.responseText);

  //       console.log('logging in debug user...');
  //       var rootUrl = window['connectDev'].rootUrl;
  //       var xmlHttp = new XMLHttpRequest();
  //       xmlHttp.onreadystatechange = function() { 
  //         if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
  //           var response = JSON.parse(xmlHttp.responseText);
  //           window['connectDev'].authToken = response.accessToken;
  //           console.log('login success');
  //           console.log(xmlHttp.responseText);
  //         }
  //       }
  //       xmlHttp.open("POST", rootUrl+'/roommate/login', true); // true for async
  //       xmlHttp.setRequestHeader('Content-Type', 'application/json');
  //       xmlHttp.send(JSON.stringify({
  //         username: window['connectDev'].user.username,
  //         password: window['connectDev'].user.password
  //       }));
  //     }
  //   }
  //   xmlHttp.open("POST", rootUrl+'/roommate/', true); // true for async
  //   xmlHttp.setRequestHeader('Content-Type', 'application/json');
  //   xmlHttp.send(JSON.stringify( window['connectDev'].user ));
  // },

  testGet: function(): void {
    console.log('attempting get...');
    var rootUrl = window['connectDev'].rootUrl;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
        console.log(xmlHttp.responseText);
    }
    xmlHttp.open("GET", rootUrl, true); // true for async
    xmlHttp.send(null);
  }
};

var viewedId:number = 0;

var mockUserProfile:RoommateProfile = {
  firstName: "Peter",
  lastName: "Parker",
  email: "notspiderman@marvel.com",
  area: 'New York',
  bio: "Hi I'm Peter Parker, your friendly neighborhood Spiderman",
  hobbies: ["reading", "running"],
  personality: ["introvert"],
  additionalInfo: "I'm looking for a roommate to help me fight crime!"
}


interface UserProfilePanelProps {
  onSettingsClick: () => void,
}

interface RoommateSelectionPanelProps {
  setId: React.Dispatch<React.SetStateAction<number>>,
}

interface ViewedProfilePanelProps {
  id: number
}

interface ProfilePreferencesPanelProps {
  isPreferencePopUpOpen: boolean,
  onCloseClick: () => void
}

// fetch data
var authToken = ''; // eventually stored in cookie
var rootUrl = 'http://localhost:5000';




function getAllRoommates(callback:(string)=>void): void {
  console.log('looking up roommates...');

  // callback(roommates);
  // return;

  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
      console.log(xmlHttp.responseText);
      callback(xmlHttp.responseText);
    }
  }
  xmlHttp.open("GET", rootUrl+'/roommate/', true); // true for async
  xmlHttp.setRequestHeader('authorization', 'Bearer '+window['connectDev'].accessToken);
  xmlHttp.send(null);
}
window['connectDev'].getAllRoommates = getAllRoommates;
function getRoommate(username:string, callback:(string)=>void): void {
  console.log('looking up profile for '+username+'...');

  // for (let roommate of roommates) {
  //   if (username === roommate.username) {
  //     callback(roommate);
  //     return;
  //   }
  // }
  // return;

  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
      callback(xmlHttp.responseText);
  }
  xmlHttp.open("GET", rootUrl+'/roommate/'+username, true); // true for async
  xmlHttp.setRequestHeader('authorization', 'Bearer '+window['connectDev'].accessToken);
  xmlHttp.send(null);
}
function getFilteredRoommates(filter, callback:(string)=>void): void {
  console.log('looking up roommates that match filter...');

  let filterStr = '';
  for (let property of filter) {
    filterStr += (filterStr === ''?'?':'&') + property + '=' + filter[property];
  }

  // callback(roommates);
  // return;

  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
      callback(xmlHttp.responseText);
  }
  xmlHttp.open("GET", rootUrl+'/roommate/'+filterStr, true); // true for async
  xmlHttp.setRequestHeader('authorization', 'Bearer '+window['connectDev'].accessToken);
  xmlHttp.send(null);
}

// components
// const useProfile = (newId) => {
//   const [id, setId] = useState(0);
//   setId(newId);
//   return [id, setId];
// }

const fetchProfile = async (): Promise<Response> => {
  const rootUrl = 'http://localhost:5000';
  const username = window.sessionStorage.getItem("username");
  const accessToken = window.sessionStorage.getItem("accessToken");
  const url = rootUrl+'/roommate/'+username;
  const response = await fetch(url, { 
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken,
    },
  });
  return response;
};

const useProfile = () => {
  const [profile, setProfile] = useState<any>([]);

  const getProfile = async () => {
    const response = await fetchProfile();
    if (response.ok) {
      setProfile(await response.json());
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return [profile];
}

const UserProfilePanel: React.FC<UserProfilePanelProps> = (props: UserProfilePanelProps) => {
  const {onSettingsClick} = props;
  const [profile] = useProfile();

  return (
    <div className="user-profile-panel">
      <div className='profilePicture'></div>
      <p className='profileName'>{profile?.firstName} {profile?.lastName}</p>

      <div className='settingsButton' onClick={onSettingsClick}></div>
    </div>
  )
}

const ProfilePreferencesPanel: React.FC<ProfilePreferencesPanelProps> = (props: ProfilePreferencesPanelProps) => {
  const {isPreferencePopUpOpen, onCloseClick} = props;

  const [profile, setProfile] = useState<any>([]);

  const getProfile = async () => {
    const response = await fetchProfile();
    if (response.ok) {
      setProfile(await response.json());
    }
  };

  const [hobbies, setHobbies] = useState<any>([]);

  const getHobbies = async () => {
    const rootUrl = 'http://localhost:5000';
    const url = rootUrl+'/roommate/types/hobbies';
    const response = await fetch(url, { 
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      setHobbies(await response.json());
    }
  };

  const [areas, setAreas] = useState<any>([]);

  const getAreas = async () => {
    const rootUrl = 'http://localhost:5000';
    const url = rootUrl+'/roommate/types/areas';
    const response = await fetch(url, { 
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      setAreas(await response.json());
    }
  };

  const [personalities, setPersonalities] = useState<any>([]);

  const getPersonalities = async () => {
    const rootUrl = 'http://localhost:5000';
    const url = rootUrl+'/roommate/types/personality';
    const response = await fetch(url, { 
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      setPersonalities(await response.json());
    }
  };

  useEffect(() => {
    getProfile();
    getHobbies();
    getAreas();
  }, []);


  const submitProfileChanges = async (event) => {
    event.preventDefault();
    console.log("submitting profile", profile);

    const rootUrl = 'http://localhost:5000';
    const username = window.sessionStorage.getItem("username");
    const accessToken = window.sessionStorage.getItem("accessToken");

    const url = rootUrl+'/roommate/'+username;
    const response = await fetch(url, { 
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken,
      },
      body: JSON.stringify(profile)
    });
    if (response.ok) {
      setProfile(await response.json());
    }
  };

  const handleChange = (key) => { 
    return (event) => {
      setProfile({...profile, [key]: event.target.value});
    }
  };

  // kinda a hack for now
  const areaOptions = areas.filter(key => key.length !== 1).map(area => {
    return <option value={area}>{area}</option>
  });

  // React tags functions 
  const KeyCodes = {
    comma: 188,
    enter: 13
  };
  
  const delimiters = [KeyCodes.comma, KeyCodes.enter];

  const generateReactTags = (profileTags) => {
    if (profileTags) {
      return profileTags.map(trait => { return {id: String(trait), text: String(trait)}});
    }
    return [];
  }

  const handleTagDelete = (key) => {
    return (i) => {
      setProfile({...profile, [key]: profile[key].filter((tag, index) => index !== i)});
    }
  }

  const handlePersonalityTagAddition =  (tag) => {
      if(personalities.includes(tag.id)) {
        setProfile({...profile, personality: [...profile.personality, tag.id]});
      }
  }

  const handleHobbyTagAddition = (tag) => {
    if(hobbies.includes(tag.id)) {
      setProfile({...profile, hobbies: [...profile.hobbies, tag.id]});
    }
  }

  return (
    <Modal 
      isOpen={isPreferencePopUpOpen}
      onRequestClose={onCloseClick}
      contentLabel="User Preferences"
    >
      <h1>User Preferences</h1>
      <h2>User Info</h2>
      <form onSubmit={submitProfileChanges}>
        <div><label>First name: <input type="text" value={profile.firstName} onChange={handleChange("firstName")}/></label></div>
        <div><label>Last name: <input type="text" value={profile.lastName} onChange={handleChange("lastName")}/></label></div>
        <div><label>Email: <input type="text" value={profile.email} onChange={handleChange("email")}/></label></div>
        <div><label>Area: 
          <select value={profile.area} onChange={handleChange("area")}>{areaOptions}</select>
        </label></div>
        <div><label>Bio: <textarea  value={profile.bio} onChange={handleChange("bio")}/></label></div>
        <div><label>Additional Info: <textarea value={profile.additionalInfo} onChange={handleChange("additionalInfo")}/></label></div>
        <h2>User Tags</h2>
        <div>
          Personality Tags:
          <ReactTags 
            tags={generateReactTags(profile?.personality)}
            delimiters={delimiters}
            suggestions={generateReactTags(personalities.filter(key => key.length !== 1))}
            handleDelete={handleTagDelete("personality")}
            handleAddition={handlePersonalityTagAddition}
            autocomplete
          />
        </div>
        <div>
          Hobby Tags:
          <ReactTags 
            tags={generateReactTags(profile?.hobbies)}
            suggestions={generateReactTags(hobbies.filter(key => key.length !== 1))}
            handleDelete={handleTagDelete("hobbies")}
            handleAddition={handleHobbyTagAddition}
            autocomplete
          />
        </div>
        <button type="submit">Save</button>
      </form>
      <h2>Mini Profile</h2>
      <h2>Full Profile</h2>
    </Modal>
  )
}


const fetchAllProfiles = async (): Promise<Response> => {
  const rootUrl = 'http://localhost:5000';
  const accessToken = window.sessionStorage.getItem("accessToken");
  const url = rootUrl+'/roommate/';
  const response = await fetch(url, { 
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken,
    },
  });
  return response;
};

const RoommateSelectionPanel: React.FC<RoommateSelectionPanelProps> = (props: RoommateSelectionPanelProps) => {
  const [profiles, setProfiles] = useState<any>([]);

  // API returns { username, profile }
  const getAllProfiles = async () => {
    const response = await fetchAllProfiles();
    if (response.ok) {
      setProfiles(await response.json());
    }
  };

  useEffect(() => {
    getAllProfiles();
  }, []);

  const update = (newId) => {
    props.setId(newId);
  }

  return (
    <div className='roommate-selection-panel'>
      <p className='recommendation-text'>Recommendations</p>
      <div className="miniViewFade"/>
      <div className="roommate-list-panel">
        {profiles ? profiles.map((profile, newId) =>
           <div className="miniProfile" onClick={()=>{update(newId)}}>
             <div className="miniProfilePicture"></div>
             <div className="miniProfilePreference"></div>
             <p className="miniProfileName">{profile.profile.firstName} {profile.profile.lastName}</p>
             <p className="miniProfileText">{profile.profile.personality.join(', ')}</p>
           </div>
        ) : <div></div>}
      </div>
    </div>
  )
}
const ViewedProfilePanel: React.FC<ViewedProfilePanelProps> = (props: ViewedProfilePanelProps) => {
  const [profiles, setProfiles] = useState<any>([]);
  const id = props.id;

  // API returns { username, profile }
  const getAllProfiles = async () => {
    const response = await fetchAllProfiles();
    if (response.ok) {
      console.log("got all profiles");
      
      setProfiles(await response.json());
    }
  };

  useEffect(() => {
    getAllProfiles();
  }, []);

  return (
    <div> {
      profiles
    ? 
    <div className='viewed-profile-panel'>
      <div className="fullProfilePicture"/>
      <div className="fullProfilePreference"/>
      <p className="fullProfileName">{profiles[id].profile.firstName} {profiles[id].profile.lastName}</p>
      <p className="fullProfileText">{profiles[id].profile.personality.join(', ')}</p>
      <p className="email">{profiles[id].profile.email}</p>
      <div className="fullProfileBio">
        <p>I am from <b>{profiles[id].profile.area}</b>!</p>
        <p>{profiles[id].profile.bio}</p>
        <p>{profiles[id].profile.additionalInfo}</p>
      </div>
    </div>
    :
    <div/>
    }
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
  const [isPreferencePopUpOpen, setIsPreferencePopUpOpen] = useState(false);
  const togglePreferencePopUp = () => {
    console.log("clicking button; isPreferencePopUpOpen:", isPreferencePopUpOpen);
    setIsPreferencePopUpOpen(!isPreferencePopUpOpen);
  }

  const [id, setId] = useState(0);

  return (
    <div>
      <UserProfilePanel onSettingsClick={togglePreferencePopUp}/>
      <RoommateSelectionPanel setId={setId}/>
      <ViewedProfilePanel id={id}/>
      <ProfilePreferencesPanel isPreferencePopUpOpen={isPreferencePopUpOpen} onCloseClick={togglePreferencePopUp}/>
    </div>
  )
}

export default Search;