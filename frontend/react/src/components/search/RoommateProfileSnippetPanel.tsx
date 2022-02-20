import React from "react";
import { Roommate } from "../../util/Roommate";

interface RoommateProfileSnippetProps {
  setRoommate: React.Dispatch<any>;
  roommates: Roommate[];
  isListPanel: boolean;
  onClickAddToList: (username: string) => Promise<void>;
  onClickDeleteFromList: (username: string) => Promise<void>;
}

export const RoommateProfileSnippetPanel: React.FC<
  RoommateProfileSnippetProps
> = (props: RoommateProfileSnippetProps) => {
  const {
    setRoommate,
    roommates,
    isListPanel,
    onClickAddToList,
    onClickDeleteFromList,
  } = props;
  return (
    <>
      <div className="miniViewFade" />
      <div className="roommate-list-panel">
        {roommates ? (
          roommates.map((roommate) => (
            <div
              key={roommate?.username}
              className="miniProfile"
              onClick={() => {
                setRoommate(roommate);
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
              {isListPanel ? (
                <button
                  onClick={() => onClickDeleteFromList(roommate?.username)}
                >
                  Remove
                </button>
              ) : (
                <button onClick={() => onClickAddToList(roommate?.username)}>
                  Add
                </button>
              )}
            </div>
          ))
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
};
