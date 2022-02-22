import React from "react";
import { Roommate } from "../../util/Roommate";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

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
          <Card.Title>@{roommate?.username}</Card.Title>
        </Card.Body>
        <Card.Header>Bio: {roommate?.profile.bio}</Card.Header>
        <Card.Text>
          <ListGroup>
            <ListGroup.Item>Area: {roommate?.profile.area}</ListGroup.Item>
            <ListGroup.Item>Email: {roommate?.profile.email}</ListGroup.Item>
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
