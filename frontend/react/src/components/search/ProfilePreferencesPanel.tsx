import React from "react";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import ReactTags from "react-tag-autocomplete";

import { BACKEND_URL } from "../../util/Constants";
import { fetchAreas, fetchRoommateProfile } from "../../util/ApiCalls";

import "./ProfilePreferencesPanel.css";

interface ProfilePreferencesPanelProps {
  isPreferencePopUpOpen: boolean;
  onCloseClick: () => void;
}

export const ProfilePreferencesPanel: React.FC<ProfilePreferencesPanelProps> = (
  props: ProfilePreferencesPanelProps
) => {
  const { isPreferencePopUpOpen, onCloseClick } = props;

  const [profile, setProfile] = useState<any>(null);

  const getUserRoommateProfile = async () => {
    const response = await fetchRoommateProfile();
    if (response.ok) {
      setProfile(await response.json());
    }
  };

  const [hobbies, setHobbies] = useState<any>([]);

  const getHobbies = async () => {
    const url = BACKEND_URL + "/roommate/types/hobbies";
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
    const response = await fetchAreas();
    if (response.ok) {
      setAreas(await response.json());
    }
  };

  const [personalities, setPersonalities] = useState<any>([]);

  const getPersonalities = async () => {
    const url = BACKEND_URL + "/roommate/types/personalities";
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
    getUserRoommateProfile();
    getHobbies();
    getAreas();
    getPersonalities();
  }, []);

  const submitProfileChanges = async (event) => {
    event.preventDefault();
    console.log("submitting profile", profile);

    const username = window.sessionStorage.getItem("username");
    const accessToken = window.sessionStorage.getItem("accessToken");

    const url = BACKEND_URL + "/roommate/" + username;
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

  const generateReactTags = (profileTags) => {
    if (profileTags) {
      return profileTags.map((trait) => {
        return { id: String(trait), name: String(trait) };
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
      setProfile({
        ...profile,
        personality: [...profile?.personality, tag.id],
      });
    }
  };

  const handleHobbyTagAddition = (tag) => {
    if (hobbies.includes(tag.id)) {
      setProfile({ ...profile, hobbies: [...profile?.hobbies, tag.id] });
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
              value={profile?.firstName}
              onChange={handleChange("firstName")}
            />
          </label>
        </div>
        <div>
          <label>
            Last name:{" "}
            <input
              type="text"
              value={profile?.lastName}
              onChange={handleChange("lastName")}
            />
          </label>
        </div>
        <div>
          <label>
            Email:{" "}
            <input
              type="text"
              value={profile?.email}
              onChange={handleChange("email")}
            />
          </label>
        </div>
        <div>
          <label>
            Area:
            <select value={profile?.area} onChange={handleChange("area")}>
              {areaOptions}
            </select>
          </label>
        </div>
        <div>
          <label>
            Bio:{" "}
            <textarea value={profile?.bio} onChange={handleChange("bio")} />
          </label>
        </div>
        <div>
          <label>
            Additional Info:{" "}
            <textarea
              value={profile?.additionalInfo}
              onChange={handleChange("additionalInfo")}
            />
          </label>
        </div>
        <h2>Personality Tags</h2>
        <div>
          <ReactTags
            tags={generateReactTags(profile?.personality)}
            suggestions={generateReactTags(
              personalities.filter((key) => key.length !== 1)
            )}
            onDelete={handleTagDelete("personality")}
            onAddition={handlePersonalityTagAddition}
            placeholderText="Personality"
          />
        </div>
        <h2>Hobby Tags</h2>
        <div>
          <ReactTags
            tags={generateReactTags(profile?.hobbies)}
            suggestions={generateReactTags(
              hobbies.filter((key) => key.length !== 1)
            )}
            onDelete={handleTagDelete("hobbies")}
            onAddition={handleHobbyTagAddition}
            placeholderText="Hobby"
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </Modal>
  );
};
