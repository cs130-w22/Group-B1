import React from "react";
import { Roommate } from "../../util/Roommate";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import { ViewedProfilePanel } from "./ViewedProfilePanel";

interface RoommateProfileSnippetProps {
  roommates: Roommate[];
  isListPanel: boolean;
  onClickAddToList: (username: string) => Promise<void>;
  onClickDeleteFromList: (username: string) => Promise<void>;
}

/**
 * Component for showing and hiding roommate profile information.
 * Profile information shown as a {@link ViewedProfilePanel}
 */
export const RoommateProfileSnippetPanel: React.FC<
  RoommateProfileSnippetProps
> = (props: RoommateProfileSnippetProps) => {
  const { roommates, isListPanel, onClickAddToList, onClickDeleteFromList } =
    props;
  return (
    <>
      <div className="miniViewFade" />
      <div className="roommate-list-panel">
        <Accordion>
          {(roommates || []).map((roommate, i) => (
            <Accordion.Item key={i} eventKey={i.toString()}>
              <Accordion.Header>
                {roommate?.profile.firstName} {roommate?.profile.lastName}
              </Accordion.Header>
              <Accordion.Body>
                <Card>
                  <ViewedProfilePanel roommate={roommate} />
                  <Card.Footer>
                    {isListPanel ? (
                      <Button
                        onClick={() =>
                          onClickDeleteFromList(roommate?.username)
                        }
                      >
                        Remove
                      </Button>
                    ) : (
                      <Button
                        onClick={() => onClickAddToList(roommate?.username)}
                      >
                        Add
                      </Button>
                    )}
                  </Card.Footer>
                </Card>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </>
  );
};
