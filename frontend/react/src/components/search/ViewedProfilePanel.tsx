import React from "react";
import { Roommate } from "../../util/Roommate";
import ReactJson from "react-json-view";

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
          <div className="fullProfileBio">
            <ReactJson src={roommate} name={null} />
          </div>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
};
