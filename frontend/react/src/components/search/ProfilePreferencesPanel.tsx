import React from "react";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import ReactTags from "react-tag-autocomplete";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import * as Unicons from "@iconscout/react-unicons";

import { BACKEND_URL } from "../../util/Constants";
import { fetchAreas, fetchRoommateProfile } from "../../util/ApiCalls";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import "bootstrap/dist/css/bootstrap.min.css";

import "./ProfilePreferencesPanel.css";

const close_icon_size = 37.5;

interface ProfilePreferencesPanelProps {
  isPreferencePopUpOpen: boolean;
  onCloseClick: () => void;
}

export const ProfilePreferencesPanel: React.FC<ProfilePreferencesPanelProps> = (
  props: ProfilePreferencesPanelProps
) => {
  const { isPreferencePopUpOpen, onCloseClick } = props;

  const [profile, setProfile] = useState<any>(null);

  const getUserRoommateProfile = async () => {
    const response = await fetchRoommateProfile();
    if (response.ok) {
      setProfile(await response.json());
    }
  };

  const [hobbies, setHobbies] = useState<any>([]);

  const getHobbies = async () => {
    const url = BACKEND_URL + "/roommate/types/hobbies";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      setHobbies(await response.json());
    }
  };

  const [areas, setAreas] = useState<any>([]);

  const getAreas = async () => {
    const response = await fetchAreas();
    if (response.ok) {
      setAreas(await response.json());
    }
  };

  const [personalities, setPersonalities] = useState<any>([]);

  const getPersonalities = async () => {
    const url = BACKEND_URL + "/roommate/types/personalities";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      setPersonalities(await response.json());
    }
  };

  useEffect(() => {
    getUserRoommateProfile();
    getHobbies();
    getAreas();
    getPersonalities();
  }, []);

  const submitProfileChanges = async (event) => {
    event.preventDefault();
    console.log("submitting profile", profile);

    const username = window.sessionStorage.getItem("username");
    const accessToken = window.sessionStorage.getItem("accessToken");

    const url = BACKEND_URL + "/roommate/" + username;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify(profile),
    });
    if (response.ok) {
      setProfile(await response.json());
    }
  };

  const handleChange = (key) => {
    return (event) => {
      setProfile({ ...profile, [key]: event.target.value });
    };
  };

  // kinda a hack for now
  const areaOptions = areas
    .filter((key) => key.length !== 1)
    .map((area) => {
      return <option value={area}>{area}</option>;
    });

  const generateReactTags = (profileTags) => {
    if (profileTags) {
      return profileTags.map((trait) => {
        return { id: String(trait), name: String(trait) };
      });
    }
    return [];
  };

  const handleTagDelete = (key) => {
    return (i) => {
      setProfile({
        ...profile,
        [key]: profile[key].filter((tag, index) => index !== i),
      });
    };
  };

  const handlePersonalityTagAddition = (tag) => {
    if (personalities.includes(tag.id)) {
      setProfile({
        ...profile,
        personality: [...profile?.personality, tag.id],
      });
    }
  };

  const handleHobbyTagAddition = (tag) => {
    if (hobbies.includes(tag.id)) {
      setProfile({ ...profile, hobbies: [...profile?.hobbies, tag.id] });
    }
  };

  return (
    <Card>
      <Modal className="modal_wrapper"
        isOpen={isPreferencePopUpOpen}
        onRequestClose={onCloseClick}
        contentLabel="User Preferences"
      >
        <h1 className="title">User Preferences</h1>
        <button onClick={onCloseClick} className="profile-preferences-close">
          <Unicons.UilMultiply size={close_icon_size} />
        </button>
        <Row> 
          {/*short response fill-ins (i.e. first / last name, etc) */}
          <Col>
            <Form.Group className="mb-3">
              <Form.Label className="form_label">First Name</Form.Label>
              <Form.Control
                type="text"
                value={profile?.firstName}
                onChange={handleChange("firstName")}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={profile?.lastName}
                onChange={handleChange("lastName")}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={profile?.email}
                onChange={handleChange("email")}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Area</Form.Label>
              <Form.Select value={profile?.area} onChange={handleChange("area")}>
                {areaOptions}
              </Form.Select>
            </Form.Group>
          </Col>

          {/*long response fill-ins (i.e. bio, additional info, etc) */}
          <Col>
              <Form onSubmit={submitProfileChanges}>
              <Form.Group className="mb-3">
                <Form.Label>Bio</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={profile?.bio}
                  onChange={handleChange("bio")}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Additional Info</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={profile?.additionalInfo}
                  onChange={handleChange("additionalInfo")}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Personality Tags</Form.Label>
                <ReactTags
                  tags={generateReactTags(profile?.personality)}
                  suggestions={generateReactTags(
                    personalities.filter((key) => key.length !== 1)
                  )}
                  onDelete={handleTagDelete("personality")}
                  onAddition={handlePersonalityTagAddition}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Hobby Tags</Form.Label>
                <ReactTags
                  tags={generateReactTags(profile?.hobbies)}
                  suggestions={generateReactTags(
                    hobbies.filter((key) => key.length !== 1)
                  )}
                  onDelete={handleTagDelete("hobbies")}
                  onAddition={handleHobbyTagAddition}
                  placeholderText="Hobby"
                />
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Button type="submit" className="submit_button">Save</Button>
      </Modal>
    </Card>
  );
};
