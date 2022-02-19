import React from "react";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { WithContext as ReactTags } from "react-tag-input";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import "./Search.css";
import "../shared/roommateProfile.ts";

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

window["connectDev"] = {
  rootUrl: "http://localhost:5000",

  user: {
    username: "testuser",
    password: "testpass",
    profile: {
      firstName: "Katniss",
      lastName: "Everdeen",
      email: "survivor@gmail.com",
      area: "Los Angeles",
      bio: "[test bio]",
      hobbies: [],
      personality: [],
      additionalInfo: "[test info]",
    },
  },
  accessToken: "",
};
interface UserProfilePanelProps {
  onSettingsClick: () => void;
}

interface RoommateSelectionPanelProps {
  setRoommate: React.Dispatch<any>;
}

interface RoommateProfileSnippetProps {
  setRoommate: React.Dispatch<any>;
  roommates: Roommate[];
}

interface ViewedProfilePanelProps {
  roommate: Roommate | null;
}

interface ProfilePreferencesPanelProps {
  isPreferencePopUpOpen: boolean;
  onCloseClick: () => void;
}

const rootUrl = "http://localhost:5000";

function getFilteredRoommates(filter, callback: (string) => void): void {
  console.log("looking up roommates that match filter...");

  let filterStr = "";
  for (let property of filter) {
    filterStr +=
      (filterStr === "" ? "?" : "&") + property + "=" + filter[property];
  }

  // callback(roommates);
  // return;

  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
      callback(xmlHttp.responseText);
  };
  xmlHttp.open("GET", rootUrl + "/roommate/" + filterStr, true); // true for async
  xmlHttp.setRequestHeader(
    "authorization",
    "Bearer " + window["connectDev"].accessToken
  );
  xmlHttp.send(null);
}

const fetchProfile = async (): Promise<Response> => {
  const rootUrl = "http://localhost:5000";
  const username = window.sessionStorage.getItem("username");
  const accessToken = window.sessionStorage.getItem("accessToken");
  const url = rootUrl + "/roommate/" + username;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
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
};

const UserProfilePanel: React.FC<UserProfilePanelProps> = (
  props: UserProfilePanelProps
) => {
  const { onSettingsClick } = props;
  const [profile] = useProfile();

  return (
    <div className="user-profile-panel">
      <div className="profilePicture"></div>
      <p className="profileName">
        {profile?.firstName} {profile?.lastName}
      </p>

      <div className="settingsButton" onClick={onSettingsClick}></div>
    </div>
  );
};

const ProfilePreferencesPanel: React.FC<ProfilePreferencesPanelProps> = (
  props: ProfilePreferencesPanelProps
) => {
  const { isPreferencePopUpOpen, onCloseClick } = props;

  const [profile, setProfile] = useState<any>([]);

  const getProfile = async () => {
    const response = await fetchProfile();
    if (response.ok) {
      setProfile(await response.json());
    }
  };

  const [hobbies, setHobbies] = useState<any>([]);

  const getHobbies = async () => {
    const rootUrl = "http://localhost:5000";
    const url = rootUrl + "/roommate/types/hobbies";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      setHobbies(await response.json());
    }
  };

  const [areas, setAreas] = useState<any>([]);

  const getAreas = async () => {
    const rootUrl = "http://localhost:5000";
    const url = rootUrl + "/roommate/types/areas";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      setAreas(await response.json());
    }
  };

  const [personalities, setPersonalities] = useState<any>([]);

  const getPersonalities = async () => {
    const rootUrl = "http://localhost:5000";
    const url = rootUrl + "/roommate/types/personality";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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

    const rootUrl = "http://localhost:5000";
    const username = window.sessionStorage.getItem("username");
    const accessToken = window.sessionStorage.getItem("accessToken");

    const url = rootUrl + "/roommate/" + username;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify(profile),
    });
    if (response.ok) {
      setProfile(await response.json());
    }
  };

  const handleChange = (key) => {
    return (event) => {
      setProfile({ ...profile, [key]: event.target.value });
    };
  };

  // kinda a hack for now
  const areaOptions = areas
    .filter((key) => key.length !== 1)
    .map((area) => {
      return <option value={area}>{area}</option>;
    });

  // React tags functions
  const KeyCodes = {
    comma: 188,
    enter: 13,
  };

  const delimiters = [KeyCodes.comma, KeyCodes.enter];

  const generateReactTags = (profileTags) => {
    if (profileTags) {
      return profileTags.map((trait) => {
        return { id: String(trait), text: String(trait) };
      });
    }
    return [];
  };

  const handleTagDelete = (key) => {
    return (i) => {
      setProfile({
        ...profile,
        [key]: profile[key].filter((tag, index) => index !== i),
      });
    };
  };

  const handlePersonalityTagAddition = (tag) => {
    if (personalities.includes(tag.id)) {
      setProfile({ ...profile, personality: [...profile.personality, tag.id] });
    }
  };

  const handleHobbyTagAddition = (tag) => {
    if (hobbies.includes(tag.id)) {
      setProfile({ ...profile, hobbies: [...profile.hobbies, tag.id] });
    }
  };

  return (
    <Modal
      isOpen={isPreferencePopUpOpen}
      onRequestClose={onCloseClick}
      contentLabel="User Preferences"
    >
      <h1>User Preferences</h1>
      <h2>User Info</h2>
      <form onSubmit={submitProfileChanges}>
        <div>
          <label>
            First name:{" "}
            <input
              type="text"
              value={profile.firstName}
              onChange={handleChange("firstName")}
            />
          </label>
        </div>
        <div>
          <label>
            Last name:{" "}
            <input
              type="text"
              value={profile.lastName}
              onChange={handleChange("lastName")}
            />
          </label>
        </div>
        <div>
          <label>
            Email:{" "}
            <input
              type="text"
              value={profile.email}
              onChange={handleChange("email")}
            />
          </label>
        </div>
        <div>
          <label>
            Area:
            <select value={profile.area} onChange={handleChange("area")}>
              {areaOptions}
            </select>
          </label>
        </div>
        <div>
          <label>
            Bio: <textarea value={profile.bio} onChange={handleChange("bio")} />
          </label>
        </div>
        <div>
          <label>
            Additional Info:{" "}
            <textarea
              value={profile.additionalInfo}
              onChange={handleChange("additionalInfo")}
            />
          </label>
        </div>
        <h2>User Tags</h2>
        <div>
          Personality Tags:
          <ReactTags
            tags={generateReactTags(profile?.personality)}
            delimiters={delimiters}
            suggestions={generateReactTags(
              personalities.filter((key) => key.length !== 1)
            )}
            handleDelete={handleTagDelete("personality")}
            handleAddition={handlePersonalityTagAddition}
            autocomplete
          />
        </div>
        <div>
          Hobby Tags:
          <ReactTags
            tags={generateReactTags(profile?.hobbies)}
            suggestions={generateReactTags(
              hobbies.filter((key) => key.length !== 1)
            )}
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
  );
};

const fetchAllProfiles = async (): Promise<Response> => {
  const rootUrl = "http://localhost:5000";
  const accessToken = window.sessionStorage.getItem("accessToken");
  const url = rootUrl + "/roommate/";
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });
  return response;
};

const fetchRecommendedProfiles = async (): Promise<Response> => {
  const rootUrl = "http://localhost:5000";
  const username = window.sessionStorage.getItem("username");
  const accessToken = window.sessionStorage.getItem("accessToken");
  const url = rootUrl + "/roommate/recommendations/" + username;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });
  return response;
};

const RoommateProfileSnippetPanel: React.FC<RoommateProfileSnippetProps> = (
  props: RoommateProfileSnippetProps
) => {
  return (
    <>
      <div className="miniViewFade" />
      <div className="roommate-list-panel">
        {props.roommates ? (
          props.roommates.map((roommate) => (
            <div
              className="miniProfile"
              onClick={() => {
                props.setRoommate(roommate);
              }}
            >
              <div className="miniProfilePicture"></div>
              <div className="miniProfilePreference"></div>
              <p className="miniProfileName">
                {roommate.profile.firstName} {roommate.profile.lastName}
              </p>
              <p className="miniProfileText">
                {roommate.profile.personality.join(", ")}
              </p>
            </div>
          ))
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
};

const RoommateSelectionPanel: React.FC<RoommateSelectionPanelProps> = (
  props: RoommateSelectionPanelProps
) => {
  const [roommates, setRoommates] = useState<any>([]);
  const [recommendedRoommates, setRecommendedRoommates] = useState<any>([]);

  // API returns { username, profile }
  const getAllProfiles = async () => {
    const response = await fetchAllProfiles();
    if (response.ok) {
      setRoommates(await response.json());
    }
  };

  const getRecommendedProfiles = async () => {
    const response = await fetchRecommendedProfiles();
    if (response.ok) {
      setRecommendedRoommates(await response.json());
    }
  };

  useEffect(() => {
    getAllProfiles();
    getRecommendedProfiles();
  }, []);

  return (
    <div className="roommate-selection-panel">
      <Tabs>
        <TabList>
          <Tab>Recommendations</Tab>
          <Tab>All Roommates</Tab>
        </TabList>

        <TabPanel>
          <RoommateProfileSnippetPanel
            roommates={recommendedRoommates}
            setRoommate={props.setRoommate}
          />
        </TabPanel>
        <TabPanel>
          <RoommateProfileSnippetPanel
            roommates={roommates}
            setRoommate={props.setRoommate}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
};
const ViewedProfilePanel: React.FC<ViewedProfilePanelProps> = (
  props: ViewedProfilePanelProps
) => {
  const roommate = props.roommate;

  return (
    <div>
      {" "}
      {roommate ? (
        <div className="viewed-profile-panel">
          <div className="fullProfilePicture" />
          <div className="fullProfilePreference" />
          <p className="fullProfileName">
            {roommate?.profile.firstName} {roommate?.profile.lastName}
          </p>
          <p className="fullProfileText">
            {roommate?.profile.personality.join(", ")}
          </p>
          <p className="email">{roommate?.profile.email}</p>
          <div className="fullProfileBio">
            <p>
              Area: <b>{roommate?.profile.area}</b>
            </p>
            <p>Bio: {roommate?.profile.bio}</p>
            <p>Additional Info: {roommate?.profile.additionalInfo}</p>
          </div>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
};

// page
const Search: React.FC = () => {
  const [isPreferencePopUpOpen, setIsPreferencePopUpOpen] = useState(false);
  const togglePreferencePopUp = () => {
    console.log(
      "clicking button; isPreferencePopUpOpen:",
      isPreferencePopUpOpen
    );
    setIsPreferencePopUpOpen(!isPreferencePopUpOpen);
  };
  const [roommate, setRoommate] = useState<any>(null);

  return (
    <div>
      <UserProfilePanel onSettingsClick={togglePreferencePopUp} />
      <RoommateSelectionPanel setRoommate={setRoommate} />
      <ViewedProfilePanel roommate={roommate} />
      <ProfilePreferencesPanel
        isPreferencePopUpOpen={isPreferencePopUpOpen}
        onCloseClick={togglePreferencePopUp}
      />
    </div>
  );
};

export default Search;
