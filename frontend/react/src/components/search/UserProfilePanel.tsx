import React from "react";
import { RoommateProfile } from "../../util/Roommate";

interface UserProfilePanelProps {
  onSettingsClick: () => void;
  profile: RoommateProfile;
}

export const UserProfilePanel: React.FC<UserProfilePanelProps> = (
  props: UserProfilePanelProps
) => {
  const { onSettingsClick, profile } = props;

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
