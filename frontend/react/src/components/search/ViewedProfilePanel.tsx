import React from "react";
import { Roommate } from "../../util/Roommate";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
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
          </div>
        </Card.Body>

        <Card.Header>{roommate?.profile.bio}</Card.Header>
        <Card.Text>
          <ListGroup>
            <ListGroup.Item>
              Personality: {roommate?.profile.personality.join(", ")}
            </ListGroup.Item>
            <ListGroup.Item>
              Hobbies: {roommate?.profile.hobbies.join(", ")}
            </ListGroup.Item>
          </ListGroup>
        </Card.Text>
        <Card.Footer>
          Additional Info: {roommate?.profile.additionalInfo}
        </Card.Footer>
      </Card>
    </div>
  );
};
