import React from "react";
import { Roommate } from "../../util/Roommate";

interface ViewedProfilePanelProps {
  roommate: Roommate | null;
}

export const ViewedProfilePanel: React.FC<ViewedProfilePanelProps> = (
  props: ViewedProfilePanelProps
) => {
  const { roommate } = props;

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
            <p>Username: {roommate?.username} </p>
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
