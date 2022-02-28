import React from "react";
import { Roommate } from "../../util/Roommate";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import "./ViewedProfilePanel.css"
import * as Unicons from "@iconscout/react-unicons";

var icon_size = 25

interface ViewedProfilePanelProps {
  roommate: Roommate | null;
}

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
          <Card.Title className="header_name">@{roommate?.username}</Card.Title>
          <div className="area_email_wrapper">
            <Card.Text className="area_email_text">
              {/*area*/}
              <Unicons.UilMapMarker size={icon_size} />
              {roommate?.profile.area}
            </Card.Text>

            {/*email contact*/}
            <Card.Text className="area_email_text email">
              <Unicons.UilEnvelopeSend size={icon_size}/>
              <a href={"https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&to=" + roommate?.profile.email} target="_blank">
                {roommate?.profile.email}
              </a>
            </Card.Text>
          </div>

        </Card.Body>

        <Card.Header>Bio: {roommate?.profile.bio}</Card.Header>
        <Card.Text>
          <ListGroup>
{/*            <ListGroup.Item>Area: {roommate?.profile.area}</ListGroup.Item>
            <ListGroup.Item>Email: {roommate?.profile.email}</ListGroup.Item>*/}
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
