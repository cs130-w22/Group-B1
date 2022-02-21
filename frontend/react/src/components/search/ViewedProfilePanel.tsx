import React from "react";
import { Roommate } from "../../util/Roommate";
import ReactJson from "react-json-view";
import Card from "react-bootstrap/Card";

interface ViewedProfilePanelProps {
  roommate: Roommate | null;
}

export const ViewedProfilePanel: React.FC<ViewedProfilePanelProps> = (
  props: ViewedProfilePanelProps
) => {
  const { roommate } = props;

  return (
    <div className="viewed-profile-panel">
      <Card>
        <ReactJson src={roommate || {}} name={null} />
      </Card>
    </div>
  );
};
