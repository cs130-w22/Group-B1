import React from "react";
import { RoommateProfile } from "../../util/Roommate";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "./UserProfilePanel.css";
import * as Unicons from "@iconscout/react-unicons";

const ICON_SIZE = 25;

interface UserProfilePanelProps {
  onSettingsClick: () => void;
  profile: RoommateProfile;
}

/**
 * Component that shows user's name and a button that opens {@link ProfilePreferencesPanel}
 */
export const UserProfilePanel: React.FC<UserProfilePanelProps> = (
  props: UserProfilePanelProps
) => {
  const { onSettingsClick, profile } = props;

  return (
    <Card id="user_profile_card">
      <Card.Title id="name">
        {profile?.firstName} {profile?.lastName}
        <Button className="settingsButton" onClick={onSettingsClick}>
          <Unicons.UilSetting size={ICON_SIZE} />
        </Button>
      </Card.Title>
    </Card>
  );
};
