import React from "react";
import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Row from "react-bootstrap/Row";
import { RoommateProfileSnippetPanel } from "./RoommateProfileSnippetPanel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import {
  fetchAllProfiles,
  fetchRecommendedProfiles,
  fetchRoommateProfile,
  fetchListUsernames,
  addUsernameToList,
  deleteUsernameFromList,
  fetchAreas,
  fetchProfilesWithFilters,
} from "../../util/ApiCalls";

/**
 * Component that includes 3 tabs for viewing all roommates, roommate list, and recommendations.
 * Each tab has a {@link RoommateProfileSnippetPanel}
 */
export const RoommateSelectionPanel: React.FC = () => {
  const [roommates, setRoommates] = useState<any>([]);
  const [recommendedRoommates, setRecommendedRoommates] = useState<any>([]);
  const [listRoommates, setListRoommate] = useState<any>([]);

  // API returns { username, profile }
  const getAllProfiles = async () => {
    const response = await fetchAllProfiles();
    if (response.ok) {
      setRoommates(await response.json());
    }
  };

  const getRecommendedProfiles = async () => {
    const response = await fetchRecommendedProfiles();
    if (response.ok) {
      setRecommendedRoommates(await response.json());
    }
  };

  const getListProfiles = async () => {
    const listUsernamesResponse = await fetchListUsernames();
    if (listUsernamesResponse.ok) {
      const listUsernames = await listUsernamesResponse.json();
      const responses = await Promise.all(
        listUsernames.map((username) => fetchRoommateProfile(username))
      );
      if (responses.find((response) => !response.ok)) {
        alert("Error retrieving roommate list profiles");
      } else {
        const roommateProfiles = await Promise.all(
          responses.map((response) => response.json())
        );
        const roommates = roommateProfiles.map((profile, index) => {
          return { username: listUsernames[index], profile };
        });
        setListRoommate(roommates);
      }
    } else {
      alert((await listUsernamesResponse.json()).message);
    }
  };

  const onClickAddToList = async (usernameToAdd: string) => {
    const addUsernameToListResponse = await addUsernameToList(usernameToAdd);
    if (addUsernameToListResponse.ok) {
      getListProfiles();
    } else {
      alert((await addUsernameToListResponse.json()).message);
    }
  };

  const onClickDeleteFromList = async (usernameToDelete: string) => {
    const deleteUsernameFromListResponse = await deleteUsernameFromList(
      usernameToDelete
    );
    if (deleteUsernameFromListResponse.ok) {
      getListProfiles();
    } else {
      alert((await deleteUsernameFromListResponse.json()).message);
    }
  };

  const [areas, setAreas] = useState<any>([]);
  const getAreas = async () => {
    const response = await fetchAreas();
    if (response.ok) {
      const officialAreas = await response.json();
      setAreas(["Any", ...officialAreas]);
    }
  };
  const areaOptions = areas
    .filter((key) => key.length !== 1)
    .map((area) => {
      return (
        <option value={area} key={area}>
          {area}
        </option>
      );
    });

  const searchFilters: {
    firstName?: string;
    lastName?: string;
    email?: string;
    area?: string;
  } = {};

  const handleFilterChange = (key) => {
    return (event) => {
      searchFilters[key] = event.target.value;
    };
  };

  const performSearch = async (event) => {
    event.preventDefault();
    Object.keys(searchFilters).forEach(
      (k) => searchFilters[k] === "" && delete searchFilters[k]
    );
    if (searchFilters["area"] === "Any") {
      delete searchFilters["area"];
    }
    const response = await fetchProfilesWithFilters(searchFilters);
    if (response.ok) {
      setRoommates(await response.json());
    } else {
      alert((await response.json()).message);
    }
  };

  useEffect(() => {
    getAllProfiles();
    getRecommendedProfiles();
    getListProfiles();
    getAreas();
  }, []);

  return (
    <div className="roommate-selection-panel">
      <Tabs>
        <TabList>
          <Tab>Recommendations</Tab>
          <Tab>List</Tab>
          <Tab>All Roommates</Tab>
        </TabList>

        <TabPanel>
          <RoommateProfileSnippetPanel
            roommates={recommendedRoommates}
            isListPanel={false}
            onClickAddToList={onClickAddToList}
            onClickDeleteFromList={onClickDeleteFromList}
          />
        </TabPanel>
        <TabPanel>
          <RoommateProfileSnippetPanel
            roommates={listRoommates}
            isListPanel={true}
            onClickAddToList={onClickAddToList}
            onClickDeleteFromList={onClickDeleteFromList}
          />
        </TabPanel>
        <TabPanel>
          <Row>
            <Form onSubmit={performSearch}>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  id="firstName"
                  onChange={handleFilterChange("firstName")}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  id="lastName"
                  onChange={handleFilterChange("lastName")}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  onChange={handleFilterChange("email")}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Area</Form.Label>
                <Form.Select onChange={handleFilterChange("area")}>
                  {areaOptions}
                </Form.Select>
              </Form.Group>
              <Button type="submit">Search</Button>
            </Form>
          </Row>
          <Row>
            <RoommateProfileSnippetPanel
              roommates={roommates}
              isListPanel={false}
              onClickAddToList={onClickAddToList}
              onClickDeleteFromList={onClickDeleteFromList}
            />
          </Row>
        </TabPanel>
      </Tabs>
    </div>
  );
};
