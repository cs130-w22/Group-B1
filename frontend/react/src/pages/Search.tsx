import React from "react";
import { useEffect, useState } from "react";

import { UserProfilePanel } from "../components/search/UserProfilePanel";
import { ViewedProfilePanel } from "../components/search/ViewedProfilePanel";
import { RoommateSelectionPanel } from "../components/search/RoommateSelectionPanel";
import { ProfilePreferencesPanel } from "../components/search/ProfilePreferencesPanel";

import { fetchRoommateProfile } from "../util/ApiCalls";

import "./Search.css";

const Search: React.FC = () => {
  const [isPreferencePopUpOpen, setIsPreferencePopUpOpen] = useState(false);
  const togglePreferencePopUp = () => {
    setIsPreferencePopUpOpen(!isPreferencePopUpOpen);
  };
  const [viewedRoommate, setViewedRoommate] = useState<any>(null);
  const [userRoommateProfile, setUserRoommateProfile] = useState<any>(null);

  const getUserRoommateProfile = async () => {
    const response = await fetchRoommateProfile();
    if (response.ok) {
      setUserRoommateProfile(await response.json());
    }
  };
  useEffect(() => {
    getUserRoommateProfile();
  }, []);

  return (
    <div>
      <UserProfilePanel
        onSettingsClick={togglePreferencePopUp}
        profile={userRoommateProfile}
      />
      <RoommateSelectionPanel setRoommate={setViewedRoommate} />
      <ViewedProfilePanel roommate={viewedRoommate} />
      <ProfilePreferencesPanel
        isPreferencePopUpOpen={isPreferencePopUpOpen}
        onCloseClick={togglePreferencePopUp}
      />
    </div>
  );
};

export default Search;
