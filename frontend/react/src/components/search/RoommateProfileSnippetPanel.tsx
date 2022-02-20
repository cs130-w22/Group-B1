import React from "react";
import { Roommate } from "../../util/Roommate";

interface RoommateProfileSnippetProps {
  setRoommate: React.Dispatch<any>;
  roommates: Roommate[];
}

export const RoommateProfileSnippetPanel: React.FC<
  RoommateProfileSnippetProps
> = (props: RoommateProfileSnippetProps) => {
  return (
    <>
      <div className="miniViewFade" />
      <div className="roommate-list-panel">
        {props.roommates ? (
          props.roommates.map((roommate) => (
            <div
              key={roommate?.username}
              className="miniProfile"
              onClick={() => {
                props.setRoommate(roommate);
              }}
            >
              <div className="miniProfilePicture"></div>
              <div className="miniProfilePreference"></div>
              <p className="miniProfileName">
                {roommate?.profile.firstName} {roommate?.profile.lastName}
              </p>
              <p className="miniProfileText">
                {roommate?.profile.personality.join(", ")}
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
