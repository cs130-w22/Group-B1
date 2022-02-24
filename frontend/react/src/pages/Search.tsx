import React from "react";
import { useEffect, useState } from "react";
import ReactDOM from 'react-dom';

import { UserProfilePanel } from "../components/search/UserProfilePanel";
import { RoommateSelectionPanel } from "../components/search/RoommateSelectionPanel";
import { ProfilePreferencesPanel } from "../components/search/ProfilePreferencesPanel";

import { fetchRoommateProfile } from "../util/ApiCalls";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import "./Search.css";

const Search: React.FC = () => {
  const [isPreferencePopUpOpen, setIsPreferencePopUpOpen] = useState(false);
  const togglePreferencePopUp = () => {
    setIsPreferencePopUpOpen(!isPreferencePopUpOpen);
  };
  const [userRoommateProfile, setUserRoommateProfile] = useState<any>(null);

  const getUserRoommateProfile = async () => {
    const response = await fetchRoommateProfile();
    if (response.ok) {
      setUserRoommateProfile(await response.json());
    }
  };
  useEffect(() => {
    getUserRoommateProfile();
  }, []);

  return (
    <Container>
      <Row>
        <Col>
          <UserProfilePanel
            onSettingsClick={togglePreferencePopUp}
            profile={userRoommateProfile}
          />
          <ProfilePreferencesPanel
            isPreferencePopUpOpen={isPreferencePopUpOpen}
            onCloseClick={togglePreferencePopUp}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <RoommateSelectionPanel />
        </Col>
      </Row>
    </Container>
  );
};

export default Search;
