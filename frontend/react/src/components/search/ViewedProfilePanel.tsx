import React from "react";
import { Roommate } from "../../util/Roommate";
import Card from "react-bootstrap/Card";
import "./ViewedProfilePanel.css";
import * as Unicons from "@iconscout/react-unicons";

interface ViewedProfilePanelProps {
  roommate: Roommate | null;
}

const ICON_SIZE = 25;

/**
 * Component for showing details of an individual roommate profile
 */
export const ViewedProfilePanel: React.FC<ViewedProfilePanelProps> = (
  props: ViewedProfilePanelProps
) => {
  const { roommate } = props;

  return (
    <div className="viewed-profile-panel">
      <Card>
        <Card.Body>
          {/*profile name*/}
          <Card.Title className="header_name">{roommate?.username}</Card.Title>

          {/*wrapper for area and email*/}
          <div className="area_email_wrapper">
            <Card.Text className="area_email_text">
              {/*area*/}
              <Unicons.UilMapMarker size={ICON_SIZE} />
              {roommate?.profile.area}
            </Card.Text>

            {/*email contact*/}
            <Card.Text className="area_email_text email">
              <Unicons.UilEnvelopeSend size={ICON_SIZE} />
              <a
                href={
                  "https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&to=" +
                  roommate?.profile.email
                }
                target="_blank"
                rel="noreferrer"
              >
                {roommate?.profile.email}
              </a>
            </Card.Text>

            {/*personalities*/}
            <div className="bold_wrapper">
              <Card.Text className="bold">Personality:</Card.Text>
              <Card.Text>{roommate?.profile.personality.join(", ")}</Card.Text>
            </div>

            {/*hobbies*/}
            <div className="bold_wrapper">
              <Card.Text className="bold">Hobbies:</Card.Text>
              <Card.Text>{roommate?.profile.hobbies.join(", ")} </Card.Text>
            </div>
          </div>
        </Card.Body>

        <Card.Header>
          {roommate?.profile.bio}
          <div className="bold_wrapper">
            <Card.Text className="bold">Additional Info:</Card.Text>
            <Card.Text>{roommate?.profile.additionalInfo}</Card.Text>
          </div>
        </Card.Header>
      </Card>
    </div>
  );
};
