import React from "react";
import { RoommateProfile } from "../../util/Roommate";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

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
    <Card>
      <div className="profilePicture"></div>
      <Card.Title>
        {profile?.firstName} {profile?.lastName}
      </Card.Title>
      <Card.Body>
        <Button className="settingsButton" onClick={onSettingsClick}>
          Edit Profile
        </Button>
      </Card.Body>
    </Card>
  );
};
